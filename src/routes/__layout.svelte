<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import '../app.scss';
</script>

<Header><Navbar slot="navbar" /></Header>

<main>
	<slot />
</main>

<footer>footer</footer>

<style>
	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
