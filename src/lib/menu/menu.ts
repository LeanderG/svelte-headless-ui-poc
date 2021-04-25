import { get, Writable, writable } from 'svelte/store';
import { calculateActiveIndex, Focus } from '../calculate-active-index';

export const MenuContext = Symbol('MenuContext');

export enum MenuStates {
	Open,
	Closed
}
export type MenuItemDataRef = { textValue: string; disabled: boolean };
export type StateDefinition = {
	// State
	menuState: Writable<MenuStates>;
	buttonRef: Writable<HTMLElement | null>;
	itemsRef: Writable<HTMLDivElement | null>;
	items: Writable<{ id: string; dataRef: MenuItemDataRef }[]>;
	searchQuery: Writable<string>;
	activeItemIndex: Writable<number | null>;

	// State mutators
	closeMenu(): void;
	openMenu(): void;
	goToItem(focus: Focus, id?: string): void;
	search(value: string): void;
	clearSearch(): void;
	registerItem(id: string, dataRef: MenuItemDataRef): void;
	unregisterItem(id: string): void;
};

export function createMenuStore(): StateDefinition {
	const menuState = writable(MenuStates.Closed);
	const buttonRef = writable(null);
	const itemsRef = writable(null);
	const items = writable([]);
	const searchQuery = writable('');
	const activeItemIndex = writable(null);

	const closeMenu = () => {
		menuState.set(MenuStates.Closed);
		activeItemIndex.set(null);
	};
	const openMenu = () => {
		menuState.set(MenuStates.Open);
	};
	const goToItem = (focus: Focus, id?: string) => {
		const nextActiveItemIndex = calculateActiveIndex(
			focus === Focus.Specific
				? { focus: Focus.Specific, id }
				: { focus: focus as Exclude<Focus, Focus.Specific> },
			{
				resolveItems: () => get(items),
				resolveActiveIndex: () => get(activeItemIndex),
				resolveId: (item) => item.id,
				resolveDisabled: (item) => item.dataRef.disabled
			}
		);

		if (get(searchQuery) === '' && get(activeItemIndex) === nextActiveItemIndex) return;
		searchQuery.set('');
		activeItemIndex.set(nextActiveItemIndex);
	};

	const search = (value: string) => {
		searchQuery.update((currentValue) => currentValue + value);

		const match = get(items).findIndex(
			(item) => item.dataRef.textValue.startsWith(get(searchQuery)) && !item.dataRef.disabled
		);

		if (match === -1 || match === get(activeItemIndex)) return;

		activeItemIndex.set(match);
	};

	const clearSearch = () => {
		searchQuery.set('');
	};

	const registerItem = (id: string, dataRef: MenuItemDataRef) => {
		items.update((items) => {
			items.push({ id, dataRef });
			return items;
		});
	};

	const unregisterItem = (id: string) => {
		const nextItems = get(items).slice();
		const currentActiveItem =
			get(activeItemIndex) !== null ? nextItems[get(activeItemIndex)] : null;
		const idx = nextItems.findIndex((a) => a.id === id);
		if (idx !== -1) nextItems.splice(idx, 1);
		items.set(nextItems);
		activeItemIndex.update((value) => {
			if (idx === value) return null;
			if (currentActiveItem === null) return null;

			// If we removed the item before the actual active index, then it would be out of sync. To
			// fix this, we will find the correct (new) index position.
			return nextItems.indexOf(currentActiveItem);
		});
	};

	return {
		menuState,
		buttonRef,
		itemsRef,
		items,
		searchQuery,
		activeItemIndex,
		closeMenu,
		openMenu,
		goToItem,
		search,
		clearSearch,
		registerItem,
		unregisterItem
	};
}

export function throwIfMenuContextMissing(api: StateDefinition, component: string): void {
	if (api == null) {
		const err = new Error(`<${component} /> is missing a parent <Menu /> component.`);
		// if (Error.captureStackTrace)
		//   Error.captureStackTrace(err, throwIfMenuContextMissing);
		throw err;
	}
}
