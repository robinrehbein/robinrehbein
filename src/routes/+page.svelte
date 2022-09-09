<script lang="ts">
	import Header from '$lib/header/Header.svelte';
import Timeline from '$lib/timeline/Timeline.svelte';
	import mouse from './mouse.svg';
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
