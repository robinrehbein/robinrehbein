import { writable } from 'svelte/store';

export type Window = {
	id: string;
	position: {
		x: number;
		y: number;
	};
	size: {
		width: number;
		height: number;
	};
	minimized: boolean;
};

const initialWindows: Window[] = [];

const windows = writable(initialWindows);

const windowStore = {
	subscribe: windows.subscribe,
	readAll: (): Window[] => {
		let allWindows: Window[] = [];
		windows.update((items) => {
			allWindows = items;
			return items;
		});
		return allWindows;
	},
	read: (id: string): Window | undefined => {
		let selectedWindow: Window | undefined;
		windows.update((items) => {
			selectedWindow = items.find((item) => item.id === id);
			return items;
		});
		return selectedWindow;
	},
	create: (window: Window) => {
		windows.update((items) => {
			return [...items, window];
		});
	},
	update: (id: string, window: Partial<Window>) => {
		windows.update((items) => {
			const index = items.findIndex((item) => item.id === id);
			items[index] = {
				...items[index],
				...window
			};
			return items;
		});
	},
	delete: (id: string) => {
		windows.update((items) => {
			return items.filter((item) => item.id !== id);
		});
	}
};

export default windowStore;
