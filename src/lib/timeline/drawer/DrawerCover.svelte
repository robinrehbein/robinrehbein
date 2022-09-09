<script lang="ts">
	import handle from './handle.svg';
	export let className: string | undefined = undefined;
	export let text: string;
</script>

<!-- <div class="drawer-cover"> -->
	<div>
		<img src={handle} alt="Drawer Handle" />
	</div>
	<p>{text}</p>
<!-- </div> -->

<style lang="scss">
    div {
        text-align: center;
        img {
            margin: auto;
            height: 1rem;
        }}
	p {
		width: 100%;
		text-align: justify;
		}
	
</style>
