<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import '../app.css';
</script>

<Navbar />

<main>
	<slot />
</main>

<Footer />

<style lanng="scss">
	/* main { */
		/* padding: 0 2rem; */
		/* max-width: 1080px;
		margin: auto; */
	/* } */
</style>
