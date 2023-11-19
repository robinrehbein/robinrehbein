<script lang="ts">
	import windowStore from '$lib/store/windowStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/cn';

	type Variant = 'close' | 'minimize' | 'maximize';

	export let variant: Variant;

	// ToDo get id from windowstore
	let id: string = $page.url.pathname.split('/').pop() || '';

	function handleClick(variant: Variant) {
		switch (variant) {
			case 'minimize':
				handleMinimize();
				break;
			case 'maximize':
				// handleMinimize();
				break;
			case 'close':
				handleClose();
				break;
			// default:
			//     break;
		}
	}

	function handleClose() {
		goto('/');
		windowStore.delete(id);
	}

	function handleMinimize() {
		goto('/');
		windowStore.update(id, { minimized: true });
	}
</script>

<button
	class={cn(
		'rounded-full h-3 w-3',
		{ 'bg-green-500': variant === 'maximize' },
		{ 'bg-yellow-500': variant === 'minimize' },
		{ 'bg-red-500': variant === 'close' }
	)}
	type="button"
	on:click={() => handleClick(variant)}
>
	<slot />
</button>
