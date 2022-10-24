<script lang="ts">
	import type { Pixel } from 'src/routes/api/grid-generator/+server';
	import { onMount } from 'svelte';

	export let pixels: Pixel[];
	export let width: number;
	export let height: number;
	export let density: number = 10;

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;

	function getColor(r: number, g: number, b: number, a: number): string {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}

	function getRadius(r: number, g: number, b: number): number {
		return (r + g + b) / 3 / density
	}

	function drawDots(): void {
		pixels.reduce((prev, curr) => {
			const radius = getRadius(curr.color.r, curr.color.g, curr.color.b);
			const color = getColor(curr.color.r, curr.color.g, curr.color.b, curr.color.a);

			if (prev && prev.y >= curr.y) {
				context.moveTo(curr.x, curr.y);
				return curr;
			}

			context.strokeStyle = color;
			context.fillStyle = color;

			context.beginPath();
			context.moveTo(curr.x, curr.y);
			context.arc(curr.x, curr.y, radius, 0, 360);
			context.closePath();

			context.fill();
			context.stroke();
			return curr;
		}, pixels[0]);
	}

	function drawLines(context: CanvasRenderingContext2D | null) {
		console.log('Draw on canvas dots');

		if (!context) {
			console.error('No context bound');
			return;
		}

		pixels.reduce((prev, curr) => {
			const radius = getRadius(curr.color.r, curr.color.g, curr.color.b, 10);
			const color = getColor(curr.color.r, curr.color.g, curr.color.b, curr.color.a);

			if (prev && prev.y >= curr.y) {
				context.moveTo(curr.x, curr.y);
				return curr;
			}

			// context.strokeStyle = color;
			// context.lineJoin = 'round';

			// context.beginPath();
			// context.moveTo(prev.x + radius, prev.y + radius);
			context.lineTo(curr.x + radius, curr.y + radius);
			// context.closePath();
			// context.fill();
			// context.stroke();
			return curr;
		}, pixels[0]);
		context.stroke();
	}

	onMount(() => {
		context = canvas.getContext('2d')!;
		drawDots();
	});
</script>

<canvas bind:this={canvas} {width} {height} />

<style lang="scss">
	canvas {
		position: absolute;
		left: 0;
		bottom: 0;
	}
</style>
