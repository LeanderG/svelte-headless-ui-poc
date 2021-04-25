<script lang="ts">
	import { getContext, onMount, tick } from 'svelte';
	import { Focus } from '../calculate-active-index';
	import { Keys } from '../keyboard';
	import { useId } from '../use-id';
	import type { StateDefinition } from './menu';
	import { MenuContext, MenuStates, throwIfMenuContextMissing } from './menu';

	export let disabled = false;

	const api = getContext<StateDefinition>(MenuContext);

	throwIfMenuContextMissing(api, 'MenuButton');

	const { openMenu, closeMenu, goToItem, itemsRef, menuState, buttonRef } = api;

	export let id = `headlessui-menu-button-${useId()}`;

	const buttonProps = { id, 'aria-haspopup': 'true', type: 'button' };

	$: if ($menuState === MenuStates.Open) {
		buttonProps['aria-expanded'] = 'true';
	} else {
		buttonProps['aria-expanded'] = undefined;
	}
	$: buttonProps['aria-controls'] = $itemsRef ? $itemsRef.id : undefined;

	onMount(() => {
		const button = document.getElementById(id);
		// TODO improve error message
		if (!button) throw new Error(`TODO better error message`);

		async function handleKeyDown(event: KeyboardEvent) {
			switch (event.key) {
				// Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13

				case Keys.Space:
				case Keys.Enter:
				case Keys.ArrowDown:
					event.preventDefault();
					event.stopPropagation();
					openMenu();
					await tick();
					$itemsRef?.focus({ preventScroll: true });
					goToItem(Focus.First);
					break;

				case Keys.ArrowUp:
					event.preventDefault();
					event.stopPropagation();
					openMenu();
					await tick();
					$itemsRef?.focus({ preventScroll: true });
					goToItem(Focus.Last);
					break;
			}
		}

		async function handlePointerUp(event: MouseEvent) {
			if (disabled) return;
			if ($menuState === MenuStates.Open) {
				closeMenu();
			} else {
				event.preventDefault();
				openMenu();
			}
		}

		buttonRef.set(document.getElementById(id));
		$buttonRef.addEventListener('keydown', handleKeyDown);
		$buttonRef.addEventListener('pointerup', handlePointerUp);
		return () => {
			$buttonRef.removeEventListener('keydown', handleKeyDown);
			$buttonRef.removeEventListener('pointerup', handlePointerUp);
		};
	});
</script>

<slot {buttonProps} open={$menuState === MenuStates.Open} />
