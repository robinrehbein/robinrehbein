<script lang="ts">
	import { page } from '$app/stores';
	import logo from './logo-robin.svg';
</script>

<nav data-sveltekit-prefetch>
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
		padding: 1rem;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
		background-color: hsla(0, 0%, 100%, 0.5);
		backdrop-filter: blur(5px) saturate(180%);
        z-index: 1;
	}
	img {
		height: 2rem;
	}
	span {
		flex-grow: 1;
	}
	ul {
		list-style: none;
		display: flex;
		gap: 1rem;
		justify-content: space-evenly;
		align-items: center;
	}
</style>
