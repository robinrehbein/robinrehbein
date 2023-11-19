<script lang="ts">
	import desktop from '$lib/transition/desktop';
	import Window from './Window.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section in:desktop={{ duration: 300, delay: 300 }} out:desktop={{ duration: 300 }}>
	asdfasdfasdfasdf
</section>
