<script lang="ts">
</script>

<nav class="navbar">
	<ul class="navbar__brand">
		<li class="navbar__brand__item navbar__brand__logo">
			<img />
		</li>
		<li class="navbar__brand__item navbar__brand__name">Robin Rehbein</li>
	</ul>
	<ul class="navbar__list">
		<li class="navbar__list__item">blog</li>
		<li class="navbar__list__item">&#60;..&#62;</li>
	</ul>
	<ul class="subbar__list">
		<li class="subbar__list__item">work</li>
		<li class="subbar__list__item">skills</li>
		<li class="subbar__list__item">about</li>
		<li class="subbar__list__item">tbd</li>
	</ul>
</nav>

<style lang="scss">
	nav {
		position: fixed;
		top: 2rem;
		right: 2rem;
		left: 2rem;
		// transform: translateX(-50%);
		padding: 1.5rem 2rem;
		background-color: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(7px);
		border-radius: 7px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	ul {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		list-style: none;
	}

	li {
		min-width: fit-content;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.subbar__list {
		position: absolute;
		top: calc(66px + 0.1rem);
		right: 0;
		transform: scale(0.9);
		opacity: 0;
		flex-direction: column;
		background-color: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(7px);
		border-radius: 14px;
		transition: all 700ms cubic-bezier(0.075, 0.82, 0.165, 1);
	}

	.subbar__list {
		top: calc(66px + 1rem);
		transform: scale(1);
		opacity: 1;
		flex-direction: column;
		border-radius: 7px;
	}

	.subbar__list__item {
		padding: 0.75rem 2rem;
		&:first-child {
			margin-top: 0.75rem;
		}
		&:last-child {
			margin-bottom: 0.75rem;
		}
	}
</style>
