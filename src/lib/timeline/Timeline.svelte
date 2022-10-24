<script lang="ts">
	import Card from '$lib/timeline/card/Card.svelte';
	import Drawer from './drawer/Drawer.svelte';
	import Item from './item/Item.svelte';

	let items: string[] = [''];
</script>

<section id="timeline">
	<ul id="timeline-professional">
		{#each items as item}
			<Item>
				<Card>
					<h3 slot="title">Consultant</h3>
					<h4 slot="headline">MHP - A Porsche Company, Ludwigsburg</h4>
					<Drawer
						slot="drawer"
						coverText="At the beginning of 2022, I internally switched to an entirely new cluster that builds AWS-based software products that digitize, automate and enhance processes in manufacturing. Expanding my skills in DevOps and cloud development, I'm proud to be a part of a team that opens up completely new terrain for the company."
					/>
				</Card>
			</Item>
			<Item>
				<Card>
					<h3 slot="title">Developer</h3>
					<h4 slot="headline">MHP - A Porsche Company, Ludwigsburg</h4>
					<Drawer
						slot="drawer"
						coverText="I exchanged my old project for a fully AWS based project."
					/>
				</Card>
			</Item>
		{/each}
	</ul>
	<ul id="timeline-academic" />
</section>

<style lang="scss">
	section {
		min-height: 100vh;
	}
	h3 {
		padding: 1rem 1rem 0 1rem;
	}
	h4 {
		padding: 1rem;
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		position: relative;
	}
	ul::before {
		content: '';
		// background-color: var(--accent-color);
		background-color: var(--text-color);
		width: 0.1rem;
		height: 100%;
		position: absolute;
		// left: 16.85rem;
		left: 3.65rem;
	}
</style>
