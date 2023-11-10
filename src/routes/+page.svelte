<script lang="ts">
	import Counter from './Counter.svelte';
	import launch from '../lib/transition/launch';

	let mousePos = { x: 0, y: 0 };
	$: handleClick = (event: MouseEvent) => {
		mousePos.x = event.clientX;
		mousePos.y = event.clientY;
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section
	in:launch={{ duration: 300, delay: 300, mousePos }}
	out:launch={{ duration: 300, mousePos }}
>
	<!-- <h1 class="text-5xl">Robin Rehbein</h1>
	<h2 class="text-2xl mt-4">Full-Stack Developer</h2>

	<Counter /> -->
</section>
