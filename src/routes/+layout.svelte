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

<style>
</style>
