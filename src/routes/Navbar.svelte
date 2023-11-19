<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { page } from '$app/stores';
	import windowStore from '$lib/store/windowStore';
	import { goto } from '$app/navigation';

	function handleClick(id: string) {
		const window = $windowStore.find((window) => window.id === id);
		if (!window) return;

		if (window.minimized) {
			windowStore.update(id, { minimized: false });
			goto(`/${id}`);
			return;
		}

		windowStore.update(id, { minimized: true });
		goto(`/`);
	}
</script>

<!-- <nav
 class="fixed bottom-3 left-3 right-3 flex flex-row justify-between p-3 bg-neutral-300/20 backdrop-blur-sm border border-neutral-300/40 rounded-xl" -->
<nav class="fixed bottom-3 left-3 right-3 flex flex-row justify-between">
	<div
		class="p-3 bg-neutral-100/30 backdrop-blur-sm border border-neutral-100/40 rounded-xl shadow-md mx-auto"
	>
		<ul class="grid grid-flow-row grid-cols-4 gap-3">
			<li
				class={cn(
					'transition-all duration-300 min-w-16 relative bg-white rounded-xl p-2 aspect-square shadow-md hover:scale-95 after:opacity-0 after:transition-all after:duration-300',
					{
						'font-bold after:!bg-neutral-800': $page.url.pathname === '/home'
					},
					{
						'after:bg-neutral-400 after:absolute after:-bottom-2 after:-translate-x-1/2 after:left-1/2 after:opacity-100 after:h-1 after:w-1 after:rounded-full':
							$windowStore.map((window) => window.id).includes('home')
					}
				)}
				aria-current={$page.url.pathname === '/home' ? 'page' : undefined}
			>
				<a
					on:click={() => handleClick('home')}
					class="text-2xs h-full flex flex-col justify-between items-center gap-1"
					href="/home"
				>
					<!-- <img class="h-2/3" src="" alt="home" /> -->
					<span class="text-2xl">🏡</span>
					$ ~/home
				</a>
			</li>
			<li
				class={cn(
					'transition-all duration-300 min-w-16 relative bg-white rounded-xl p-2 aspect-square shadow-md hover:scale-95 after:transition-all after:duration-300',
					{
						'font-bold after:!bg-neutral-800': $page.url.pathname === '/work'
					},
					{
						'after:bg-neutral-400 after:absolute after:-bottom-2 after:-translate-x-1/2 after:left-1/2 after:opacity-100 after:h-1 after:w-1 after:rounded-full':
							$windowStore.map((window) => window.id).includes('work')
					}
				)}
				aria-current={$page.url.pathname === '/work' ? 'page' : undefined}
			>
				<a
					on:click={() => handleClick('work')}
					class="text-2xs h-full flex flex-col justify-between items-center gap-1"
					href="/work"
				>
					<!-- <img class="h-2/3" src="" alt="work" /> -->
					<span class="text-2xl">💼</span>
					$ ~/work
				</a>
			</li>
			<li
				class={cn(
					'transition-all duration-300 min-w-16 relative bg-white rounded-xl p-2 aspect-square shadow-md hover:scale-95 after:transition-all after:duration-300',
					{
						'font-bold after:!bg-neutral-800': $page.url.pathname === '/skills'
					},
					{
						'after:bg-neutral-400 after:absolute after:-bottom-2 after:-translate-x-1/2 after:left-1/2 after:opacity-100 after:h-1 after:w-1 after:rounded-full':
							$windowStore.map((window) => window.id).includes('skills')
					}
				)}
				aria-current={$page.url.pathname === '/skills' ? 'page' : undefined}
			>
				<a
					on:click={() => handleClick('skills')}
					class="text-2xs h-full flex flex-col justify-between items-center gap-1"
					href="/skills"
				>
					<!-- <img class="h-2/3" src="" alt="skills" /> -->
					<span class="text-2xl">🕹️</span>
					$ ~/skills
				</a>
			</li>
			<li
				class={cn(
					'transition-all duration-300 min-w-16 relative bg-white rounded-xl p-2 aspect-square shadow-md hover:scale-95 after:transition-all after:duration-300',
					{
						'font-bold after:!bg-neutral-800': $page.url.pathname === '/about'
					},
					{
						'after:bg-neutral-400 after:absolute after:-bottom-2 after:-translate-x-1/2 after:left-1/2 after:opacity-100 after:h-1 after:w-1 after:rounded-full':
							$windowStore.map((window) => window.id).includes('about')
					}
				)}
				aria-current={$page.url.pathname === '/about' ? 'page' : undefined}
			>
				<a
					on:click={() => handleClick('about')}
					class="text-2xs h-full flex flex-col justify-between items-center gap-1"
					href="/about"
				>
					<!-- <img class="h-2/3" src="" alt="about" /> -->
					<span class="text-2xl">📋</span>
					$ ~/about
				</a>
			</li>
		</ul>
	</div>
</nav>
