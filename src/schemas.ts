import { z } from 'zod';

// --- Question Schema ---
export const QuestionSchema = z.object({
    question_number: z.number(),
    question_text: z.string(),
    options: z.record(z.string(), z.string()), // e.g., { "a": "Option A", "b": "Option B" }
    correct_answer: z.string(),
    subject: z.string().nullable().optional(),
    explanation: z.string().nullable().optional(),
    images: z.array(z.string()).nullable().optional(),
});

export const ExamSchema = z.array(QuestionSchema);

// --- Config Schema ---
export const ConfigEntrySchema = z.object({
    id: z.string(),
    category: z.string(),
    // Allow string for legacy support but prefer number. Null for "General".
    year: z.union([z.number(), z.string(), z.null()]),
    session: z.union([z.string(), z.number(), z.null()]),
    date: z.string().nullable(), // YYYY-MM-DD
    shift: z.union([z.number(), z.string(), z.null()]),
    paperType: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    short_description: z.string(),
    path: z.string(),
    tags: z.array(z.string()).optional(),
    isOfficial: z.boolean().default(false).optional(),
});

export const ConfigSchema = z.array(ConfigEntrySchema);

// --- AI Config Schema ---
export const AIConfigEntrySchema = ConfigEntrySchema.extend({
    model: z.string().optional(), // Made optional for compatibility if mixed
    defaultQuestionCount: z.number().optional(), // Made optional
    generationPrompt: z.string().optional(),
});

export const AIConfigSchema = z.array(AIConfigEntrySchema);

// --- Blog Schema ---
export const BlogEntrySchema = z.object({
    slug: z.string(),
    title: z.string(),
    date: z.string(),
    author: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    mdFilePath: z.string(),
});

export const BlogIndexSchema = z.array(BlogEntrySchema);

// --- Root config.json Schema (Registry) ---
export const RootConfigSchema = z.record(z.string(), z.object({
    meta: z.object({
        examId: z.string(),
        fullName: z.string(),
        shortName: z.string(),
        category: z.string(),
        conductingBody: z.string(),
        country: z.string(),
        examType: z.array(z.string()),
        description: z.string().nullable(),
        officialWebsite: z.string().nullable(),
        isOfficial: z.boolean(),
        lastUpdated: z.string().nullable()
    }),
    path: z.string()
}));
