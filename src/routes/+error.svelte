<script lang="ts">
  import { page } from "$app/state";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<Nav />

<main
  style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; padding: 2rem; text-align: center;"
>
  <h1
    style="font-family: var(--font-heading); font-size: 3rem; margin: 0 0 0.5rem; color: var(--color-text);"
  >
    {page.status}
  </h1>
  <p style="color: var(--color-text-muted); margin: 0 0 1.5rem; font-size: 1.1rem;">
    {page.status === 404 ? "Page not found" : "Something went wrong"}
  </p>
  <a
    href="/"
    style="
			display: inline-block; padding: 0.625rem 1.5rem;
			background: var(--color-accent); color: #050508;
			border-radius: var(--radius); text-decoration: none;
			font-weight: 600; font-size: 0.9rem;
		"
  >
    Back to tools
  </a>
</main>

<Footer />
