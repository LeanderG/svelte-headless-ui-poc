<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { createMenuStore, MenuContext, MenuStates } from "./menu";

  const api = createMenuStore();
  setContext(MenuContext, api);
  const { menuState, buttonRef, itemsRef } = api;

  onMount(() => {
    function handler(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const active = document.activeElement;

      if ($menuState !== MenuStates.Open) return;
      if ($buttonRef?.contains(target)) return;

      if (!$itemsRef?.contains(target)) api.closeMenu();
      if (active !== document.body && active?.contains(target)) return; // Keep focus on newly clicked/focused element
      if (!event.defaultPrevented) {
        $buttonRef?.focus({ preventScroll: true });
      }
    }

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });
</script>

<slot />
