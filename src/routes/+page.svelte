<script lang="ts">
	import Canvas from '$lib/canvas/Canvas.svelte';
	import Header from '$lib/header/Header.svelte';
	import Timeline from '$lib/timeline/Timeline.svelte';
	import { onMount } from 'svelte';
	import type { Pixel } from './api/grid-generator/+server';
	import mouse from './mouse.svg';

	let pixels: Pixel[] = [];
	let height: number;
	let width: number;
	let density: number = 5;
	let size: number = 170;

	onMount(async () => {
		await gridGenerator();
	});

	async function gridGenerator() {
		const url = new URL('http://127.0.0.1:5173/api/grid-generator');
		url.searchParams.append('width', width.toString());
		url.searchParams.append('height', height.toString());
		url.searchParams.append('density', density.toString());
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		pixels = await response.json();
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Robin Rehbein" />
</svelte:head>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<section>
	{#if pixels.length > 0}
		<Canvas {pixels} {width} {height} {size} />
	{/if}

	<Header>
		<h1 slot="title">Robin Rehbein</h1>
		<h2 slot="headline">Full Stack Developer</h2>
	</Header>

	<button on:click={gridGenerator}>trigger</button>
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
