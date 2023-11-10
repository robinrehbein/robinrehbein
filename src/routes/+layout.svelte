<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import './styles.css';
	import Footer from './Footer.svelte';
	import launch from '../lib/transition/launch';

	let mousePos = { x: 0, y: 0 };
	const handleClick = (event: MouseEvent) => {
		mousePos.x = event.clientX;
		mousePos.y = event.clientY;
	};
</script>

<Header />
<main>
	<slot />
</main>
<Footer />
