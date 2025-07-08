import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://algomaster.dev";
  const lastModified = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Main subject pages
  const subjectPages = [
    {
      url: `${baseUrl}/auto`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/daa`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/os`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cn`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // Algorithm-specific pages
  const algorithmPages = [
    // Automata Theory
    {
      url: `${baseUrl}/auto/finite-automata/dfa`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auto/finite-automata/nfa`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auto/pushdown-automata/pda`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auto/turing-machines/tm`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auto/regular-expressions/regex`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auto/context-free-grammar/cfg`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },

    // Design and Analysis of Algorithms
    {
      url: `${baseUrl}/daa/divide-conquer/merge-sort`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daa/divide-conquer/quick-sort`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daa/dynamic/knapsack`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daa/dynamic/lcs`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/daa/dynamic/floyd-warshall`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/daa/greedy/dijkstra`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daa/greedy/kruskal`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daa/greedy/prim`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/daa/backtracking/n-queens`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/daa/backtracking/graph-coloring`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },

    // Operating Systems
    {
      url: `${baseUrl}/os/cpu-scheduling`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/os/memory-allocation`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/os/page-replacement`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/os/deadlock`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/os/disk`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/os/synchronization`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },

    // Computer Networks
    {
      url: `${baseUrl}/cn/routing`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cn/protocols`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cn/security`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  return [...staticPages, ...subjectPages, ...algorithmPages];
}
