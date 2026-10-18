export const pageHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} · GAXIS-Lumen` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · GAXIS-Lumen` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
