<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import Button from '$lib/button/Button.svelte';
</script>

<svelte:head>
	<title>home.</title>
</svelte:head>

<section>
	<Button id="button__contact" onClick={() => {}}>Button</Button>
</section>

<style lang="scss">
	section {
		height: 200vh;
		background-image: url('./static/svelte-welcome.png');
	}
</style>
