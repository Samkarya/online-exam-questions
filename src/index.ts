import fs from 'fs';
import path from 'path';
import { Config, Exam, AIConfig, BlogIndex } from './types';
import { ConfigSchema, ExamSchema, AIConfigSchema, BlogIndexSchema } from './schemas';

const CONFIG_PATH = path.join(__dirname, '../config.json');

// Cache config in memory
let cachedConfig: Config | null = null;

export function getAllExams(): Config {
    if (cachedConfig) return cachedConfig;

    if (!fs.existsSync(CONFIG_PATH)) {
        throw new Error('config.json not found');
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const data = JSON.parse(raw);
    // We assume valid data at runtime if validation passed, but we can double check or just cast
    // For safety in a real API, we might want to parse, but for performance we might trust the file if validated.
    // Let's parse to be safe.
    const result = ConfigSchema.safeParse(data);
    if (!result.success) {
        console.error("Config validation failed", result.error);
        return [];
    }
    cachedConfig = result.data;
    return cachedConfig;
}

export function getAIExams(): AIConfig {
    const AI_CONFIG_PATH = path.join(__dirname, '../ai_generated/config.json');
    if (!fs.existsSync(AI_CONFIG_PATH)) return [];

    const raw = fs.readFileSync(AI_CONFIG_PATH, 'utf-8');
    const data = JSON.parse(raw);
    const result = AIConfigSchema.safeParse(data);
    if (!result.success) {
        console.error("AI Config validation failed", result.error);
        return [];
    }
    return result.data;
}

export function getBlogPosts(): BlogIndex {
    const BLOG_INDEX_PATH = path.join(__dirname, '../blog/blog-index.json');
    if (!fs.existsSync(BLOG_INDEX_PATH)) return [];

    const raw = fs.readFileSync(BLOG_INDEX_PATH, 'utf-8');
    const data = JSON.parse(raw);
    const result = BlogIndexSchema.safeParse(data);
    if (!result.success) {
        console.error("Blog Index validation failed", result.error);
        return [];
    }
    return result.data;
}

export function getExamById(id: string): Promise<Exam | null> {
    const config = getAllExams();
    const aiConfig = getAIExams();
    const allExams = [...config, ...aiConfig];

    const entry = allExams.find(e => e.id === id);
    if (!entry) return Promise.resolve(null);

    const examPath = path.join(__dirname, '..', entry.path);
    if (!fs.existsSync(examPath)) return Promise.resolve(null);

    return fs.promises.readFile(examPath, 'utf-8')
        .then((raw: string) => JSON.parse(raw))
        .then((data: unknown) => {
            const result = ExamSchema.safeParse(data);
            if (result.success) return result.data;
            console.error(`Exam ${id} validation failed`, result.error);
            return null;
        })
        .catch((err: unknown) => {
            console.error(`Failed to load exam ${id}`, err);
            return null;
        });
}

export function getExamsByCategory(category: string): Config {
    return getAllExams().filter(e => e.category === category);
}
