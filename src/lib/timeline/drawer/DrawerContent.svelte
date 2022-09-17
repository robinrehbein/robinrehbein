<script lang="ts">
	type Images = {
		readonly src: string;
		readonly alt: string;
		readonly description: string;
	};

	export let images: Images[];
</script>

<ul>
	{#each images as image}
		<li>
			<img src={image.src} alt={image.alt} />
			<p>{image.description}</p>
		</li>
	{/each}
</ul>

<style lang="scss">
</style>
