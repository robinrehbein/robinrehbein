<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Header from '$lib/header/Header.svelte';
	import Timeline from '$lib/timeline/Timeline.svelte';
	import { onMount } from 'svelte';
	import mouse from './mouse.svg';

	let pixelColors: {
		x: number;
		y: number;
		color: { r: number; g: number; b: number; a: number };
	}[] = [];
	let width: number;
	let height: number;
	onMount(async () => {
		await gridGenerator();
	});
	async function gridGenerator() {
		const url = new URL('http://127.0.0.1:5173/api/grid-generator');
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		const body = await response.json();
		pixelColors = body.pixelColors;
		width = body.width;
		height = body.height;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Robin Rehbein" />
</svelte:head>

<section>
	<Header>
		<h1 slot="title">Robin Rehbein</h1>
		<h2 slot="headline">Full Stack Developer</h2>
	</Header>

	<button on:click={gridGenerator}>trigger</button>
	{#if pixelColors.length > 0}
		<Canvas {pixelColors} {width} {height} />
	{/if}
	<div>
		<a href="#timeline">
			<img src={mouse} alt="Mouse to scroll down" />
		</a>
	</div>
</section>
<Timeline />

<style lang="scss">
	div {
		height: 35vh;
		position: relative;
	}
	img {
		height: 2rem;
		position: absolute;
		bottom: 20%;
		left: calc(50% - 10px);
		animation: moveDown 1.5s infinite 1.5s ease-in-out;
	}
	@keyframes moveDown {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(10px);
		}
		100% {
			transform: translateY(0);
		}
	}
</style>
