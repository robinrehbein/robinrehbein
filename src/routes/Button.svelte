<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { ClassValue } from 'clsx';

	type Variant = 'primary' | 'secondary' | 'default';

	export let variant: Variant = 'default';
	export let className: ClassValue = undefined;
	export let handleClick: () => void;

	function handleClickInternal() {
		return handleClick();
	}
</script>

<button
	class={cn(
		{ 'p-4 rounded-md text-white bg-black': variant === 'primary' },
		{ 'p-4 rounded-md border-2': variant === 'secondary' },
		className
	)}
	type="button"
	on:click={() => handleClickInternal()}
>
	<slot />
</button>
