<script lang="ts">
	import launch from '../lib/transition/launch';
	import { page } from '$app/stores';

	let mousePos = { x: 0, y: 0 };
	function handleClick(event: MouseEvent) {
		mousePos.x = event.clientX;
		mousePos.y = event.clientY;
	}
</script>

<section
	in:launch={{ duration: 300, delay: 300, mousePos }}
	out:launch={{ duration: 300, mousePos }}
	class="bg-neutral-100/80 backdrop-blur-sm border border-neutral-100/40 p-3 m-3 h-[calc(100vh-150px)] overflow-y-scroll shadow-sm rounded-lg"
>
	<slot />
</section>
