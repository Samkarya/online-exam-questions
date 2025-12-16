import { z } from 'zod';
import { QuestionSchema, ExamSchema, ConfigEntrySchema, ConfigSchema, AIConfigEntrySchema, AIConfigSchema, BlogEntrySchema, BlogIndexSchema } from './schemas';

export type Question = z.infer<typeof QuestionSchema>;
export type Exam = z.infer<typeof ExamSchema>;
export type ConfigEntry = z.infer<typeof ConfigEntrySchema>;
export type Config = z.infer<typeof ConfigSchema>;

export type AIConfigEntry = z.infer<typeof AIConfigEntrySchema>;
export type AIConfig = z.infer<typeof AIConfigSchema>;

export type BlogEntry = z.infer<typeof BlogEntrySchema>;
export type BlogIndex = z.infer<typeof BlogIndexSchema>;
