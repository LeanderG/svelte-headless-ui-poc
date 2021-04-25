<script lang="ts">
	import { getContext, tick } from 'svelte';
	import { Focus } from '../calculate-active-index';
	import { Keys } from '../keyboard';
	import { useId } from '../use-id';
	import { throwIfMenuContextMissing } from './menu';
	import type { StateDefinition } from './menu';
	import { MenuContext, MenuStates } from './menu';

	const api = getContext<StateDefinition>(MenuContext);

	throwIfMenuContextMissing(api, 'MenuItems');

	const {
		menuState,
		activeItemIndex,
		items,
		itemsRef,
		buttonRef,
		searchQuery,
		search,
		closeMenu,
		goToItem,
		clearSearch
	} = api;

	const id = `headlessui-menu-items-${useId()}`;

	let searchDebounce: ReturnType<typeof setTimeout> | null;

	$: $itemsRef?.focus();

	async function handleKeyDown(event: KeyboardEvent) {
		if (searchDebounce) clearTimeout(searchDebounce);

		switch (event.key) {
			// Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12

			case Keys.Space:
				if ($searchQuery !== '') {
					event.preventDefault();
					return search(event.key);
				}
			// When in type ahead mode, fallthrough
			case Keys.Enter:
				event.preventDefault();
				if ($activeItemIndex !== null) {
					const { id } = $items[$activeItemIndex];
					document.getElementById(id)?.click();
				}
				closeMenu();
				await tick();
				$buttonRef?.focus({ preventScroll: true });
				break;

			case Keys.ArrowDown:
				event.preventDefault();
				return goToItem(Focus.Next);

			case Keys.ArrowUp:
				event.preventDefault();
				return goToItem(Focus.Previous);

			case Keys.Home:
			case Keys.PageUp:
				event.preventDefault();
				return goToItem(Focus.First);

			case Keys.End:
			case Keys.PageDown:
				event.preventDefault();
				return goToItem(Focus.Last);

			case Keys.Escape:
				event.preventDefault();
				closeMenu();
				await tick();
				$buttonRef?.focus({ preventScroll: true });
				break;

			case Keys.Tab:
				return event.preventDefault();

			default:
				if (event.key.length === 1) {
					search(event.key);
					searchDebounce = setTimeout(() => clearSearch(), 350);
				}
				break;
		}
	}
</script>

{#if $menuState === MenuStates.Open}
	<div
		bind:this={$itemsRef}
		{id}
		on:keydown={handleKeyDown}
		aria-activedescendant={$activeItemIndex ? $items[$activeItemIndex]?.id : undefined}
		aria-labelledby={$buttonRef?.id}
		role="menu"
		tabindex="0"
		class={$$props.class}
	>
		<slot />
	</div>
{/if}
