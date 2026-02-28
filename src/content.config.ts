import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const skills = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
  schema: z.object({
    name: z.string(),
    version: z.union([z.string(), z.number()]).optional(),
    last_updated: z.string().optional(),
    status: z.enum(['active', 'draft', 'deprecated', 'not-built']).optional().default('active'),
    description: z.string().optional(),
    // Extra fields we add for the website
    skillId: z.string().optional(),
    series: z.string().optional(),
    audience: z.string().optional(),
    oneLiner: z.string().optional(),
    // Goal recommendations and Claude integration
    recommendedFor: z.array(z.string()).optional().default([]),
    githubPath: z.string().optional(),
  }),
});

export const collections = { skills };
