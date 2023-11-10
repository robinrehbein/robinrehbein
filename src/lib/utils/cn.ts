import clsx from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges class names using clsx and tailwind-merge.
 * @param inputs - An array of class names to be merged.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
