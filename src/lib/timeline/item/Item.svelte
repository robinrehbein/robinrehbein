<script lang="ts"></script>

<li>
	<!-- eventuellm mit pseudo element -->
	<span class="timeline-dot" />

	<!-- <span class="timeline-horizontal-line" /> -->
	<div class="timeline-item">
		<slot />
	</div>
</li>

<style lang="scss">
	li {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}

	span {
		// background-color: var(--accent-color);
		background-color: var(--text-color);
		position: sticky;
		top: 50%;
		// height: 0.8rem;
		// border-radius: 50%;
		height: 0.1rem;
		width: 0.8rem;
	}

	// .timeline-horizontal-line {
	// 	height: 0.1rem;
	// 	flex-grow: 1;
	// 	background-color: var(--accent-color);
	// }
	div {
		flex: 1;
	}
	div::before {
		width: 10px;
		height: 10px;
		background-color: black;
	}
</style>
