<script lang="ts">
	import Menu from '$lib/menu/Menu.svelte';
	import MenuButton from '$lib/menu/MenuButton.svelte';
	import MenuItem from '$lib/menu/MenuItem.svelte';
	import MenuItems from '$lib/menu/MenuItems.svelte';
</script>

<Menu>
	<MenuButton let:buttonProps><button {...buttonProps}>Click me!</button></MenuButton>
	<MenuItems>
		<MenuItem let:active let:itemProps>
			<button {...itemProps} class:active>Item A</button></MenuItem
		>
		<MenuItem let:active let:itemProps><button {...itemProps} class:active>Item B</button></MenuItem
		>
		<MenuItem let:active let:itemProps let:disabled disabled
			><button {...itemProps} class:active class:disabled>Item C</button></MenuItem
		>
		<MenuItem let:active let:itemProps><button {...itemProps} class:active>Items</button></MenuItem>
	</MenuItems>
</Menu>

<style style lang="postcss">
	.active {
		background-color: aqua;
	}

	.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
