import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { ConfigSchema, ExamSchema, AIConfigSchema, BlogIndexSchema } from './schemas';
import { AIConfig, Config, Question, BlogIndex } from './types';

const CONFIG_PATH = path.join(__dirname, '../config.json');
const BLOG_INDEX_PATH = path.join(__dirname, '../blog/blog-index.json');

// Helper: Check file existence with case sensitivity (Critical for GitHub Pages/Linux)
function fileExistsCaseSensitive(filepath: string): boolean {
    const dir = path.dirname(filepath);
    const basename = path.basename(filepath);
    try {
        const files = fs.readdirSync(dir);
        return files.includes(basename);
    } catch (e) {
        return false;
    }
}

async function validate() {
    console.log('🛡️  Starting System Integrity Check...');
    let hasError = false;
    const allExamIds = new Set<string>();

    // =========================================
    // 1. Validate Main Config (Index)
    // =========================================
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error('❌ CRITICAL: config.json not found!');
        process.exit(1);
    }

    let configFiles: string[] = [];
    let combinedConfigs: Config = [];

    try {
        const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(rawConfig);

        // Validation: Expect config.json to be string[]
        const indexSchema = z.array(z.string());
        const result = indexSchema.safeParse(parsed);

        if (!result.success) {
            console.error('❌ config.json Schema Error: Expected Array of Strings (File Paths)');
            hasError = true;
        } else {
            configFiles = result.data;
            console.log(`✅ config.json index passed (${configFiles.length} files referenced).`);
        }
    } catch (e) {
        console.error('❌ config.json Syntax Error:', e);
        hasError = true;
    }

    // =========================================
    // 2. Load & Validate Referenced Configs
    // =========================================
    for (const relativePath of configFiles) {
        const fullPath = path.join(__dirname, '..', relativePath);

        if (!fs.existsSync(fullPath)) {
            console.error(`❌ MISSING CONFIG: "${relativePath}" referenced in config.json not found.`);
            hasError = true;
            continue;
        }

        try {
            const rawSubConfig = fs.readFileSync(fullPath, 'utf-8');
            const parsedSub = JSON.parse(rawSubConfig);

            // Validate against ConfigSchema (Array of ConfigEntry)
            // We use ConfigSchema which is generic enough. 
            // If specific AI fields are needed, we can check them later or use a union schema.
            // For now, let's treat everything as ConfigEntrySchema but check for extra fields if needed.
            const result = ConfigSchema.safeParse(parsedSub);

            if (!result.success) {
                console.error(`❌ CONFIG SCHEMA ERROR in "${relativePath}":`);
                console.error(JSON.stringify(result.error.format(), null, 2));
                hasError = true;
            } else {
                console.log(`   - Verified ${relativePath} (${result.data.length} exams)`);
                combinedConfigs.push(...result.data);
            }
        } catch (e) {
            console.error(`❌ JSON ERROR in "${relativePath}":`, e);
            hasError = true;
        }
    }


    // =========================================
    // 3. Validate Blog Index
    // =========================================
    if (fs.existsSync(BLOG_INDEX_PATH)) {
        try {
            const rawBlog = fs.readFileSync(BLOG_INDEX_PATH, 'utf-8');
            const parsed = JSON.parse(rawBlog);
            const result = BlogIndexSchema.safeParse(parsed);

            if (!result.success) {
                console.error('❌ blog-index.json Schema Error');
                hasError = true;
            } else {
                const blogIndex: BlogIndex = result.data;
                console.log(`✅ blog-index.json passed (${blogIndex.length} posts).`);

                // Check if linked Markdown files actually exist
                for (const post of blogIndex) {
                    // Resolve path relative to root
                    const mdPath = path.join(__dirname, '..', post.mdFilePath);
                    if (!fs.existsSync(mdPath) || !fileExistsCaseSensitive(mdPath)) {
                        console.error(`❌ MISSING BLOG FILE: "${post.mdFilePath}" listed in index but not found.`);
                        hasError = true;
                    }
                }
            }
        } catch (e) {
            console.error('❌ blog-index.json Syntax Error', e);
            hasError = true;
        }
    }

    // =========================================
    // 4. Validate IDs & Exam Files
    // =========================================
    // combinedConfigs now contains all exams from all files

    // 4.1 Check Duplicate IDs
    for (const entry of combinedConfigs) {
        if (allExamIds.has(entry.id)) {
            console.error(`❌ DUPLICATE ID FOUND: "${entry.id}" is used more than once.`);
            hasError = true;
        }
        allExamIds.add(entry.id);
    }

    // 4.2 Deep Exam Content Validation
    for (const entry of combinedConfigs) {
        // Path resolution: logic remains similar, but we rely on entry.path
        // If "isOfficial" is explicitly false or missing, we might assume specific paths, 
        // but generally entry.path should be relative to root (or handled consistently).
        // The original code handled ai_generated separately. 
        // Check if path exists in 'ai_generated/' or root.

        let examPath = path.join(__dirname, '..', entry.path);
        let exists = fs.existsSync(examPath) && fileExistsCaseSensitive(examPath);

        // Fallback or specific check for AI paths if they were relative to ai_generated
        // The previous logic was: const basePath = entry.isAI ? ... : ...
        // Now we merged them. We need to ensure entry.path is correct in the json files.
        // Assuming I preserved the paths in the JSONs. 
        // Wait, for AI files, the original path in config might have been "IELTS/..." while file was in "ai_generated/IELTS/...".
        // Let's check if the file exists at the joined path. If not, try inside `ai_generated/`.
        if (!exists) {
            const aiPath = path.join(__dirname, '../ai_generated', entry.path);
            if (fs.existsSync(aiPath) && fileExistsCaseSensitive(aiPath)) {
                examPath = aiPath;
                exists = true;
            }
        }

        if (!exists) {
            console.error(`❌ FILE ERROR: "${entry.path}" not found (checked root and ai_generated) for ID ${entry.id}`);
            hasError = true;
            continue;
        }

        try {
            const rawExam = fs.readFileSync(examPath, 'utf-8');
            const examData = JSON.parse(rawExam);
            // Relaxed check: Basic ExamSchema (Question[])
            const result = ExamSchema.safeParse(examData);

            if (!result.success) {
                console.error(`❌ SCHEMA ERROR in ${entry.path}:`);
                console.error(JSON.stringify(result.error.issues.slice(0, 2), null, 2));
                hasError = true;
                continue;
            }

            // Explicitly use the Question type here
            const questions: Question[] = result.data;

            // Check Question Number Sequencing
            const qNumbers = questions.map(q => q.question_number).sort((a, b) => a - b);
            const isSequential = qNumbers.every((num, index) => num === index + 1);
            if (!isSequential) {
                console.error(`❌ SEQUENCE ERROR: Question numbers in ${entry.path} are not sequential 1..N`);
                hasError = true;
            }

            // Check Logic & Assets
            for (const q of questions) {
                // Answer Key Logic
                // Normalize keys to lowercase for comparison
                const validOptions = Object.keys(q.options).map(k => k.toLowerCase());
                if (!validOptions.includes(q.correct_answer.toLowerCase())) {
                    console.error(`❌ LOGIC ERROR (${entry.path}): Q${q.question_number} answer "${q.correct_answer}" not in options [${Object.keys(q.options).join(', ')}]`);
                    hasError = true;
                }

                // Image Asset Validation (Regex to find markdown images)
                const markdownImageRegex = /!\[.*?\]\((.*?)\)/g;
                const textFields = [q.question_text, q.explanation, ...Object.values(q.options)];

                textFields.forEach(text => {
                    if (!text) return;
                    let match;
                    while ((match = markdownImageRegex.exec(text)) !== null) {
                        const imagePath = match[1];
                        if (imagePath.startsWith('http')) continue; // Skip external URLs

                        const absoluteImagePath = path.join(__dirname, '..', imagePath);
                        if (!fs.existsSync(absoluteImagePath)) {
                            console.error(`❌ MISSING ASSET (${entry.path}): Q${q.question_number} references "${imagePath}" which does not exist.`);
                            hasError = true;
                        }
                    }
                });
            }

        } catch (e) {
            console.error(`❌ JSON PARSE ERROR in ${entry.path}:`, e);
            hasError = true;
        }
    }

    if (hasError) {
        console.error('\n💥 VALIDATION FAILED. Fix errors before pushing.');
        process.exit(1);
    } else {
        console.log('\n✨ All Systems Operational. Ready for Deployment.');
    }
}

validate();