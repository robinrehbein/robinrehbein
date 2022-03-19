<script lang="ts">
	export let disabled: boolean = false;
	export let id: string = undefined;
	export let type: string = undefined;
	export let primary: boolean = undefined;
	export let danger: boolean = undefined;
	export let onClick: () => void = undefined;
</script>

<button {disabled} {id} {type} class:primary class:danger on:click={onClick}>
	<slot name="icon" />
	<slot name="label" />
	<slot />
</button>

<style lang="scss">
	button {
		padding: 0.5rem 1rem;
	}
	.primary {
		background-color: green;
	}
	.danger {
		background-color: red;
	}
</style>
