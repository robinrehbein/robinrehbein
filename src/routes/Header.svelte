<script lang="ts">
	import logo from '../lib/images/robinrehbein-logo.svg';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';

	let dateTime: string;

	$: settings = false;
	$: menu = false;

	function handleSettings() {
		settings = !settings;
	}

	function handleMenu() {
		menu = !menu;
	}

	onMount(() => {
		const now = new Date();
		const date = now.toLocaleDateString('de', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit'
		});
		const time = now.toLocaleTimeString('de', { hour: '2-digit', minute: '2-digit' });
		dateTime = `${date}, ${time}`;
	});
</script>

<header
	class="relative flex flex-row justify-between items-center h-7 p-1 bg-neutral-100/30 backdrop-blur-sm border border-b-neutral-100/40"
>
	<ul class="flex flex-row gap-2 items-center justify-start">
		<li class="h-5">
			<Button handleClick={handleMenu}>
				<img class="h-5" src={logo} alt="Logo Robin Rehbein" />
			</Button>
		</li>
		<li>
			<p class="text-xs font-bold">{$page.url.pathname}</p>
		</li>
		<li />
	</ul>
	<ul class="flex flex-row gap-2 items-center justify-end">
		<li on:click={handleSettings}>⚙️</li>
		<li>🔐</li>
		<!-- if logged in 🔑 -->
		<li class="text-xs">{dateTime}</li>
	</ul>

	{#if settings}
		<div
			transition:fly={{ x: 100, duration: 300 }}
			class="absolute w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/5 right-3 top-[calc(100%+0.75rem)] h-[calc(100vh-9.375rem)] bg-neutral-100/30 backdrop-blur-sm border border-neutral-100/40 p-3 rounded-lg"
		>
			a
		</div>
	{/if}
</header>
