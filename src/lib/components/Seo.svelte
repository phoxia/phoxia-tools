<script lang="ts">
  let {
    title,
    description,
    path,
    type = "website",
  }: {
    title: string;
    description: string;
    path: string;
    type?: "website" | "article";
  } = $props();

  const url = $derived(`https://tools.phoxia.org${path}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content={type} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <link rel="canonical" href={url} />
</svelte:head>
