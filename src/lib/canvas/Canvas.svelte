<script lang="ts">
	import { onMount } from 'svelte';
	export let width: number;
	export let height: number;

	type Pixel = {
		x: number;
		y: number;
		color: { r: number; g: number; b: number; a: number };
	};

	export let pixelColors: Pixel[];

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D | null;

	onMount(() => {
		context = canvas.getContext('2d');

		// context?.beginPath();
		pixelColors.reduce((prev, curr) => {
			// context?.arc(pixelColor.x * 10, pixelColor.y * 10, 1, 0, 2 * Math.PI);
			const x = curr.x;
			const y = curr.y;
			const combinedColor = (curr.color.r + curr.color.g + curr.color.b) / 3 / 20;

			if (prev && prev.y >= curr.y) {
				context?.moveTo(curr.x, curr.y);
				console.log(curr);
				return curr;
			}
			context?.lineTo(x + combinedColor, y + combinedColor);

			// ToDo: if line at the end moveTo beginning of canvas
			// x >= 1020 && context?.moveTo(0, x);
			// y >= 1020 && context?.moveTo(y, 0);

			return curr;

			// context?.moveTo(x, y);

			// context?.lineTo(y + combinedColor, x + combinedColor);

			//   context?.arc(x, y, x / Math.PI, 0, 2 * Math.PI, false);
			//   context?.fillStyle = ;
		}, pixelColors[0]);
		// context?.closePath();
		context?.stroke();
		// context?.fill();
		// context?.arc(x, y, 1, 0, 2 * Math.PI, true);

		// context.drawImage(src, 0, 0, 150, 300);

		// context.stroke();
		// console.log(context.getImageData(60, 150, 1, 1));
	});
</script>

<canvas bind:this={canvas} {width} {height} />

<style lang="scss"></style>
