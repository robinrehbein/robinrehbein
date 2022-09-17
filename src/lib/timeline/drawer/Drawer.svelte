<script lang="ts">
	import DrawerContent from './DrawerContent.svelte';
	import DrawerCover from './DrawerCover.svelte';

	export let coverText: string;

	let coverHeight: number;
</script>

<div class="drawer" style={`height: ${coverHeight}px;`}>
	<div class="drawer-content">
		<DrawerContent
			images={[{ src: '/src/lib/Footer/love.svg', alt: 'Heart', description: 'made with love' }]}
		/>
	</div>
	<div bind:clientHeight={coverHeight} class="drawer-cover">
		<DrawerCover text={coverText} />
	</div>
</div>

<style lang="scss">
	.drawer {
		position: relative;
	}
	:global(.drawer-content, .drawer-cover) {
		padding: 1rem;
		transition: all linear 0.2s;
		border: 0.1rem solid hsl(0, 0%, 100%);
		min-height: 100%;
	}
	:global(.drawer-content) {
		background-color: var(--background-color);
		margin: 0 1rem 0 1rem;
		overflow: hidden;
		height: 100%;
		border-radius: 0.2rem 0.2rem 0 0;
		box-shadow: inset 0 4px 8px 0 rgb(170, 170, 170);
		// overflow: scroll;
	}
	:global(.drawer-cover) {
		position: absolute;
		border-top: 0.1rem solid var(--text-color);
		top: 0;
		right: 0;
		left: 0;
		background-color: white;
		border-radius: 0 0 0.2rem 0.2rem;
	}
	:global(.drawer:hover .drawer-cover) {
		border: 0.1rem solid var(--te);
		top: 100%;
		transform: scale(1.01);
		z-index: 1;
		box-shadow: 0 4px 8px 0 rgb(200, 200, 200);
	}
</style>
