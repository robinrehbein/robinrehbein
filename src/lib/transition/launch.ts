import { cubicInOut } from 'svelte/easing';

export default function launch(
	_: unknown,
	{
		duration,
		delay = 0,
		mousePos
	}: { duration: number; delay?: number; mousePos: { x: number; y: number } }
) {
	// const x = event.clientX;
	// const y = event.clientY;

	return {
		duration,
		delay,
		css: (t: number) => {
			const cubic = cubicInOut(t);

			return `
                transform: translate(${mousePos.x}px, ${mousePos.y}px) scale(${cubic});
                transform-origin: bottom;
            `;
		}
	};
}
