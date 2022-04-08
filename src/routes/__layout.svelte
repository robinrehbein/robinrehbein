<svelte:head>
	<!-- Normalize CSS     -->
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
	/>
</svelte:head>

<header>
    <!-- navbar -->
</header>

<main>
    <slot />
</main>

<footer>
    <!-- footer -->
    {new Date().getFullYear()} &copy; Robin Rehbein
</footer>

<style lang="scss"></style>