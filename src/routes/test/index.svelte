<script lang="ts">
	import Menu from '../../lib/menu/menu.svelte';
	import MenuButton from '../../lib/menu/MenuButton.svelte';
	import MenuItem from '../../lib/menu/MenuItem.svelte';
	import MenuItems from '../../lib/menu/MenuItems.svelte';
</script>

<div class="w-56 text-right fixed top-16">
	<Menu>
		<div class="relative inline-block text-left">
			<div>
				<MenuButton let:buttonProps>
					<button
						{...buttonProps}
						class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
					>
						Options
					</button>
				</MenuButton>
			</div>

			<!-- <transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			> -->
			<MenuItems
				class="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			>
				<div class="px-1 py-1">
					<MenuItem let:active let:itemProps>
						<button
							{...itemProps}
							class={'group flex rounded-md items-center w-full px-2 py-2 text-sm' +
								(active ? ' bg-blue-500 text-white' : ' text-gray-900')}
						>
							Edit
						</button>
					</MenuItem>
					<MenuItem let:active let:itemProps>
						<button
							{...itemProps}
							class={'group flex rounded-md items-center w-full px-2 py-2 text-sm' +
								(active ? ' bg-blue-500 text-white' : ' text-gray-900')}
						>
							Duplicate
						</button>
					</MenuItem>
				</div>
				<div class="px-1 py-1">
					<MenuItem let:active let:itemProps>
						<button
							{...itemProps}
							class={'group flex rounded-md items-center w-full px-2 py-2 text-sm' +
								(active ? ' bg-blue-500 text-white' : ' text-gray-900')}
						>
							Archive
						</button>
					</MenuItem>
					<MenuItem let:active let:itemProps let:disabled disabled>
						<button
							{...itemProps}
							class={'group flex rounded-md items-center w-full px-2 py-2 text-sm' +
								(active ? ' bg-blue-500 text-white' : ' text-gray-900') +
								(disabled && ' cursor-not-allowed opacity-50')}
						>
							Move
						</button>
					</MenuItem>
				</div>

				<div class="px-1 py-1">
					<MenuItem let:active let:itemProps>
						<button
							{...itemProps}
							class={'group flex rounded-md items-center w-full px-2 py-2 text-sm' +
								(active ? ' bg-blue-500 text-white' : ' text-gray-900')}
						>
							Delete
						</button>
					</MenuItem>
				</div>
			</MenuItems>
			<!-- </transition> -->
		</div>
	</Menu>
</div>
