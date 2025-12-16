import fs from 'fs';
import path from 'path';
import { ConfigSchema, ExamSchema, AIConfigSchema, BlogIndexSchema } from './schemas';
import { AIConfig } from './types';

const CONFIG_PATH = path.join(__dirname, '../config.json');

async function validate() {
    console.log('🔍 Starting validation...');

    // 1. Validate config.json
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error('❌ config.json not found!');
        process.exit(1);
    }

    let configData;
    try {
        const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf-8');
        configData = JSON.parse(rawConfig);
    } catch (error) {
        console.error('❌ Failed to parse config.json:', error);
        process.exit(1);
    }

    const configResult = ConfigSchema.safeParse(configData);
    if (!configResult.success) {
        console.error('❌ config.json validation failed:');
        console.error(JSON.stringify(configResult.error.format(), null, 2));
        process.exit(1);
    }

    console.log('✅ config.json is valid.');
    const config = configResult.data;

    let hasError = false;

    // 2. Validate ai_generated/config.json
    const AI_CONFIG_PATH = path.join(__dirname, '../ai_generated/config.json');
    let aiConfig: AIConfig = [];
    if (fs.existsSync(AI_CONFIG_PATH)) {
        try {
            const rawAIConfig = fs.readFileSync(AI_CONFIG_PATH, 'utf-8');
            const aiConfigData = JSON.parse(rawAIConfig);
            const aiConfigResult = AIConfigSchema.safeParse(aiConfigData);
            if (!aiConfigResult.success) {
                console.error('❌ ai_generated/config.json validation failed:');
                console.error(JSON.stringify(aiConfigResult.error.format(), null, 2));
                hasError = true;
            } else {
                console.log('✅ ai_generated/config.json is valid.');
                aiConfig = aiConfigResult.data;
            }
        } catch (error) {
            console.error('❌ Failed to parse ai_generated/config.json:', error);
            hasError = true;
        }
    }

    // 3. Validate blog/blog-index.json
    const BLOG_INDEX_PATH = path.join(__dirname, '../blog/blog-index.json');
    if (fs.existsSync(BLOG_INDEX_PATH)) {
        try {
            const rawBlogIndex = fs.readFileSync(BLOG_INDEX_PATH, 'utf-8');
            const blogIndexData = JSON.parse(rawBlogIndex);
            const blogIndexResult = BlogIndexSchema.safeParse(blogIndexData);
            if (!blogIndexResult.success) {
                console.error('❌ blog/blog-index.json validation failed:');
                console.error(JSON.stringify(blogIndexResult.error.format(), null, 2));
                hasError = true;
            } else {
                console.log('✅ blog/blog-index.json is valid.');
                const blogIndex = blogIndexResult.data;
                for (const post of blogIndex) {
                    const mdPath = path.join(__dirname, '..', post.mdFilePath);
                    if (!fs.existsSync(mdPath)) {
                        console.error(`❌ Blog post markdown not found: ${post.mdFilePath}`);
                        hasError = true;
                    }
                }
            }
        } catch (error) {
            console.error('❌ Failed to parse blog/blog-index.json:', error);
            hasError = true;
        }
    }

    // 4. Validate all exam files (Main + AI)
    const allExams = [...config, ...aiConfig];

    for (const entry of allExams) {
        const examPath = path.join(__dirname, '..', entry.path);

        if (!fs.existsSync(examPath)) {
            console.error(`❌ Exam file not found for ID ${entry.id}: ${entry.path}`);
            hasError = true;
            continue;
        }

        try {
            const rawExam = fs.readFileSync(examPath, 'utf-8');
            const examData = JSON.parse(rawExam);

            const examResult = ExamSchema.safeParse(examData);
            if (!examResult.success) {
                console.error(`❌ Validation failed for ${entry.path}:`);
                // Log first 3 errors to avoid spam
                console.error(JSON.stringify(examResult.error.issues.slice(0, 3), null, 2));
                hasError = true;
            } else {
                // Additional Logic: Check if correct_answer exists in options
                const exam = examResult.data;
                for (const q of exam) {
                    if (!q.options[q.correct_answer.toLowerCase()] && !q.options[q.correct_answer.toUpperCase()] && !q.options[q.correct_answer]) {
                        console.error(`❌ Logic Error in ${entry.path}, Q${q.question_number}: correct_answer "${q.correct_answer}" not found in options keys [${Object.keys(q.options).join(', ')}]`);
                        hasError = true;
                    }
                }
                if (!hasError) {
                    console.log(`✅ ${entry.path} is valid.`);
                }
            }
        } catch (error) {
            console.error(`❌ Failed to parse/read ${entry.path}:`, error);
            hasError = true;
        }
    }

    if (hasError) {
        console.error('🚨 Validation failed with errors.');
        process.exit(1);
    } else {
        console.log('🎉 All validations passed!');
    }
}

validate();
