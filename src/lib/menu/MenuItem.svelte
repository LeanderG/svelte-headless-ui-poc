<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { Focus } from '../calculate-active-index';

	import { useId } from '../use-id';
	import { MenuContext, throwIfMenuContextMissing } from './menu';
	import type { StateDefinition, MenuItemDataRef } from './menu';

	export let id = `headlessui-menu-item-${useId()}`;
	export let disabled = false;

	const api = getContext<StateDefinition>(MenuContext);

	throwIfMenuContextMissing(api, 'MenuItem');

	const {
		items,
		activeItemIndex,
		buttonRef,
		closeMenu,
		goToItem,
		registerItem,
		unregisterItem
	} = api;

	const dataRef: MenuItemDataRef = { disabled, textValue: '' };

	let active = false;
	$: active = $activeItemIndex !== null ? $items[$activeItemIndex].id === id : false;

	const itemProps = { role: 'menuitem', tabindex: -1, id };

	onMount(() => {
		async function handleClick(event: MouseEvent) {
			if (disabled) return event.preventDefault();
			closeMenu();
			await tick();
			$buttonRef?.focus({ preventScroll: true });
		}

		function handleFocus() {
			if (disabled) return goToItem(Focus.Nothing);
			goToItem(Focus.Specific, id);
		}

		function handlePointerMove() {
			if (disabled) return;
			if (active) return;
			goToItem(Focus.Specific, id);
		}

		function handlePointerLeave() {
			if (disabled) return;
			if (!active) return;
			goToItem(Focus.Nothing);
		}

		const itemRef = document.getElementById(id);
		// TODO throw error if itemRef=undefined
		const textValue = itemRef.textContent?.toLowerCase().trim();
		if (textValue !== undefined) dataRef.textValue = textValue;

		itemRef.addEventListener('click', handleClick);
		itemRef.addEventListener('focus', handleFocus);
		itemRef.addEventListener('pointermove', handlePointerMove);
		itemRef.addEventListener('pointerleave', handlePointerLeave);
		registerItem(id, dataRef);

		return () => {
			itemRef.removeEventListener('click', handleClick);
			itemRef.removeEventListener('focus', handleFocus);
			itemRef.removeEventListener('pointermove', handlePointerMove);
			itemRef.removeEventListener('pointerleave', handlePointerLeave);
			unregisterItem(id);
		};
	});
</script>

<slot {itemProps} {active} {disabled} />
