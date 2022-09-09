<script lang="ts">
	import DrawerContent from './DrawerContent.svelte';
	import DrawerCover from './DrawerCover.svelte';

	export let coverText: string;
	let coverHeight: number;
</script>
<div class="drawer" style={`height: ${coverHeight}px;`}>
	<div class="drawer-content">
		<DrawerContent className="drawer-content" />
	</div>
	<div bind:clientHeight={coverHeight} class="drawer-cover">
		<DrawerCover text={coverText} />
	</div>
</div>

<style lang="scss">
	:global(.drawer) {
		position: relative;
	}
	:global(.drawer-content, .drawer-cover) {
		padding: 1rem;
		transition: all cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s;
		border: 1px solid hsl(0, 0%, 100%);
		border-top: 1px solid hsl(0, 0%, 50%);
		min-height: 150px;
	}
	:global(.drawer-content) {
		background-color: rgb(50, 50, 50);
		color: white;
		margin: 0 1rem 0 1rem;
		overflow: hidden;
		height: 100%;
		border-radius: 0.2rem 0.2rem 0 0;
		box-shadow: inset 0 8px 8px 0 rgba(0, 0, 0, 0.8);
	}
	:global(.drawer-cover) {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		background-color: white;
		border-radius: 0 0 0.2rem 0.2rem;
	}
	:global(.drawer:hover .drawer-cover) {
		border: 1px solid hsl(0, 0%, 50%);
		top: 100%;
		transform: scale(1.01);
		box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(51, 51, 51, 0.2);
	}
</style>
