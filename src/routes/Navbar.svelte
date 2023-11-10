<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/images/robinrehbein-logo.svg';
</script>

<!-- <nav
 class="fixed bottom-3 left-3 right-3 flex flex-row justify-between p-3 bg-neutral-300/20 backdrop-blur-sm border border-neutral-300/40 rounded-xl lg:top-3 lg:bottom-auto" -->
<nav
	class="fixed bottom-3 left-3 right-3 flex flex-row justify-between p-3 bg-neutral-300/20 backdrop-blur-sm border border-neutral-300/40 rounded-xl"
>
	<ul class="hidden lg:flex lg:flex-row lg:justify-evenly lg:gap-8">
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="/"
			>
				<!-- <a class="text-xs h-full flex flex-col justify-center items-center gap-1 lg:flex-row lg:gap-3" href="/"> -->
				<img class="h-12" src={logo} alt="home" />
				$ ~/robinrehbein
			</a>
		</li>
	</ul>

	<ul class="flex flex-row flex-grow justify-evenly gap-8 lg:flex-grow-0 lg:gap-8">
		<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="/"
			>
				<!-- <img class="h-2/3" src="" alt="home" /> -->
				<span class="text-3xl">🏡</span>
				$ ~/home
			</a>
		</li>
		<li aria-current={$page.url.pathname === '/work' ? 'page' : undefined}>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="/work"
			>
				<!-- <img class="h-2/3" src="" alt="work" /> -->
				<span class="text-3xl">💼</span>
				$ ~/work
			</a>
		</li>
		<li aria-current={$page.url.pathname === '/skills' ? 'page' : undefined}>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="/skills"
			>
				<!-- <img class="h-2/3" src="" alt="skills" /> -->
				<span class="text-3xl">🕹️</span>
				$ ~/skills
			</a>
		</li>
		<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="/about"
			>
				<!-- <img class="h-2/3" src="" alt="about" /> -->
				<span class="text-3xl">📋</span>
				$ ~/about
			</a>
		</li>
	</ul>

	<ul class="hidden lg:visible lg:flex lg:flex-row lg:justify-end lg:gap-8">
		<li>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="https://github.com/robinrehbein"
			>
				<!-- <img class="h-2/3" src={github} alt="GitHub" /> -->
				<span class="text-3xl">🛠️</span>
				#github
			</a>
		</li>
		<li>
			<a
				class="text-xs h-full flex flex-col justify-between items-center gap-1 lg:flex-row lg:gap-3"
				href="https://www.linkedin.com/in/robin-rehbein-923503181/"
			>
				<!-- <img class="h-2/3" src={linkedIn} alt="LinkedIn" /> -->
				<span class="text-3xl">🤝</span>
				#linkedin
			</a>
		</li>
	</ul>
</nav>
