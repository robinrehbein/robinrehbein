import type { Config } from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			minWidth: {
				'16': '4rem',
				'17': '4.25rem',
				'18': '4.5rem',
				'19': '4.75rem'
			},
			inset: {
				'29': '122px'
			},
			fontSize: {
				'2xs': '0.625rem'
			}
		},
		plugins: []
	}
};
export default config;
