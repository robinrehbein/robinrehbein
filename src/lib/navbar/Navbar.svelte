<script lang="ts">
	import { page } from '$app/stores';
	import logo from './logo-robin.svg';

	let scrollY: number = 0;
</script>

<svelte:window bind:scrollY />

<nav data-sveltekit-prefetch class:scrolled={scrollY > 0}>
	<img src={logo} alt="SvelteKit" />
	<span>Robin Rehbein</span>
	<ul>
		<li class:active={$page.url.pathname === '/'}>
			<a href="/">home</a>
		</li>
		<li class:active={$page.url.pathname === '/work'}>
			<a href="/work">work</a>
		</li>
		<li class:active={$page.url.pathname === '/skills'}>
			<a href="/skills">skills</a>
		</li>
		<li class:active={$page.url.pathname === '/about'}>
			<a href="/about">about</a>
		</li>
	</ul>
</nav>

<style lang="scss">
	nav {
		padding: 1rem 2rem;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
		transition: backdrop-filter cubic-bezier(0.075, 0.82, 0.165, 1) 1000ms,
			background-color cubic-bezier(0.075, 0.82, 0.165, 1) 1000ms;
		z-index: 1;
	}

	nav.scrolled {
		background-color: hsla(var(--background-color), 0.5);
		backdrop-filter: blur(5px) saturate(180%);
	}
	img {
		height: 2rem;
	}
	span {
		flex-grow: 1;
	}
	ul {
		display: flex;
		gap: 1rem;
		justify-content: space-evenly;
		align-items: center;
	}
</style>
