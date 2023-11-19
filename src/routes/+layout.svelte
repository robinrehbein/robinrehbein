<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import './styles.css';
	import Footer from './Footer.svelte';
	import launch from '../lib/transition/launch';
</script>

<Header />
<main>
	<slot />
</main>
<Footer />
