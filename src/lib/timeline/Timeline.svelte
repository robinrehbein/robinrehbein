<script lang="ts">
	import Card from '$lib/timeline/card/Card.svelte';
	import Drawer from './drawer/Drawer.svelte';
</script>

<section id="timeline">
	<section id="timeline-professional">
		<Card>
            <h3 slot="title">January 01, 2022 - October 31, 2022</h3>
			<h4 slot="headline">MHP - A Porsche Company, Ludwigsburg</h4>
			<Drawer
				slot="drawer"
				coverText="At the beginning of 2022, I internally switched to an entirely new cluster that builds AWS-based software products that digitize, automate and enhance processes in manufacturing. Expanding my skills in DevOps and cloud development, I'm proud to be a part of a team that opens up completely new terrain for the company."
			/>
		</Card>
		<Card>
            <h3 slot="title">January 01, 2022 - October 31, 2022</h3>
			<h4 slot="headline">MHP - A Porsche Company, Ludwigsburg</h4>
			<Drawer
				slot="drawer"
				coverText="I exchanged my old project for a fully AWS based project."
			/>
		</Card>
	</section>
	<section id="timeline-academic" />
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
</style>
