import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.string(),
    readTime: z.string().optional(),
    featured: z.boolean().optional(),
    heroImage: z.string().optional(),
  }),
});

export const collections = {
  articles,
};
