<script lang="ts">
	import launch from '../lib/transition/launch';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import windowStore from '$lib/store/windowStore';

	import type { Window as WindowType } from '$lib/store/windowStore';
	import WindowButton from './WindowButton.svelte';

	let id: string = $page.url.pathname.split('/').pop() || '';

	onMount(async () => {
		!$windowStore.find((window: WindowType) => window.id === id)
			? windowStore.create({
					id,
					position: {
						x: 50,
						y: 50
					},
					size: {
						width: 200,
						height: 200
					},
					minimized: false
			  })
			: windowStore.update(id, { minimized: false });
	});
</script>

<section
	in:launch={{ duration: 300, delay: 300 }}
	out:launch={{ duration: 300 }}
	class="m-3 h-[calc(100vh-9.375rem)] shadow-sm rounded-lg"
>
	<ul class="flex flex-row justify-end gap-1 pr-1 w-full rounded-t-lg bg-neutral-100/30">
		<li>
			<WindowButton variant="maximize" />
		</li>
		<li>
			<WindowButton variant="minimize" />
		</li>
		<li>
			<WindowButton variant="close" />
		</li>
	</ul>
	<div
		class="p-3 overflow-y-scroll h-[calc(100%-1.5rem)] rounded-b-lg backdrop-blur-sm bg-neutral-100/80 border border-neutral-100/40"
	>
		<slot />
	</div>
</section>
