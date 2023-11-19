import { writable } from 'svelte/store';

export type BackgroundEntry = {
	id: number;
	title: string;
	from: Date;
	to: Date | string;
	company: string;
	location: {
		city: string;
		lat: number;
		lng: number;
	};
	type: 'professional' | 'academic';
	description: string;
};

const initialEntries: BackgroundEntry[] = [
	{
		id: 0,
		title: 'Full-Stack Developer',
		from: new Date('2022-11-01'),
		to: 'Present',
		company: 'neosfer GmbH',
		location: {
			city: 'Frankfurt am Main',
			lat: 0,
			lng: 0
		},
		type: 'professional',
		description:
			'I started a new journey at neosfer in late 2022. neosfer is a subsidiary of Commerzbank AG and deals with innovative technologies of the future.'
	}
];

const entries = writable(initialEntries);

const backgroundStore = {
	subscribe: entries.subscribe,
	readAll: () => {
		let allEntries;
		entries.update((items) => {
			allEntries = items;
			return items;
		});
		return allEntries;
	},
	read: (id: number) => {
		let selectedEntry;
		entries.update((items) => {
			selectedEntry = items.find((item) => item.id === id);
			return items;
		});
		return selectedEntry;
	},
	create: (entry: BackgroundEntry) => {
		entries.update((items) => {
			return [...items, entry];
		});
	},
	update: (id: number, updatedEntry: Partial<BackgroundEntry>) => {
		entries.update((items) => {
			return items.map((item) => (item.id === id ? { ...item, ...updatedEntry } : item));
		});
	},
	delete: (id: number) => {
		entries.update((items) => {
			return items.filter((item) => item.id !== id);
		});
	}
};

export default backgroundStore;
