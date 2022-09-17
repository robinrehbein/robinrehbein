<script lang="ts">
	import love from './love.svg';
</script>

<footer>
	<ul>
		<li><a href="">Imprint</a></li>
		<li><a href="">Data Protection</a></li>
		<li><a href="">Disclaimer</a></li>
	</ul>
	<p>Made with <img src={love} alt="Heart (meant as love)" /> by Robin Rehbein</p>
	<p>Copyright © <em>2022 Robin Rehbein</em> - All rights reserved.</p>
</footer>

<style lang="scss">
	footer {
		margin-top: 5vh; // Todo exchange for variable
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	li,
	p {
		margin-bottom: 1rem;
	}
	img {
		height: 0.7rem;
	}
</style>
