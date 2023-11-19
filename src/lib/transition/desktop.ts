import { cubicInOut } from 'svelte/easing';

export default function desktop(
	_: unknown,
	{ duration, delay = 0 }: { duration: number; delay?: number }
) {
	// const x = event.clientX;
	// const y = event.clientY;

	return {
		duration,
		delay,
		css: (t: number) => {
			const cubic = cubicInOut(t);
			return `
                transform: scale(${95 + cubic * 5}%);
                transform-origin: bottom;
				opacity: ${cubic};
            `;
		}
	};
}
