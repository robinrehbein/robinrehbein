<script lang="ts"></script>

<div>
    <slot name="title" />
    <slot name="headline" />
    <slot />
	<slot name="drawer" />
</div>

<style lang="scss">
	div {
		border: 1px solid hsl(0, 0%, 50%);
		padding: 1rem;
		margin: 1rem;
		border-radius: 0.2rem;
        background-color: white;
	}
</style>
