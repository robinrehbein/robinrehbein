<script lang="ts"></script>

<div>
	<slot name="title" />
	<slot name="headline" />
	<slot />
	<slot name="drawer" />
</div>

<style lang="scss">
	div {
		border: 0.1rem solid var(--text-color);
		padding: 2rem;
		border-radius: 0.2rem;
		background-color: var(--pure-white);
		box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.1), 0 8px 16px 0 rgba(51, 51, 51, 0.2);
	}
</style>
