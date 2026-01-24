import fs from 'fs';
import path from 'path';
import { ConfigSchema, ExamSchema, AIConfigSchema, BlogIndexSchema } from './schemas';
import { AIConfig, Config, Question, BlogIndex } from './types';

const CONFIG_PATH = path.join(__dirname, '../config.json');
const AI_CONFIG_PATH = path.join(__dirname, '../ai_generated/config.json');
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
    // 1. Validate Main Config
    // =========================================
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error('❌ CRITICAL: config.json not found!');
        process.exit(1);
    }

    let config: Config = [];
    try {
        const rawConfig = fs.readFileSync(CONFIG_PATH, 'utf-8');
        const parsed = JSON.parse(rawConfig);
        const result = ConfigSchema.safeParse(parsed);
        if (!result.success) {
            console.error('❌ config.json Schema Error:', JSON.stringify(result.error.format(), null, 2));
            hasError = true;
        } else {
            config = result.data;
            console.log(`✅ config.json passed (${config.length} exams).`);
        }
    } catch (e) {
        console.error('❌ config.json Syntax Error:', e);
        hasError = true;
    }

    // =========================================
    // 2. Validate AI Config
    // =========================================
    let aiConfig: AIConfig = [];
    if (fs.existsSync(AI_CONFIG_PATH)) {
        try {
            const rawAI = fs.readFileSync(AI_CONFIG_PATH, 'utf-8');
            const parsed = JSON.parse(rawAI);
            const result = AIConfigSchema.safeParse(parsed);
            if (!result.success) {
                console.error('❌ ai_generated/config.json Schema Error');
                // console.error(result.error); // Uncomment for details
                hasError = true;
            } else {
                aiConfig = result.data;
                console.log(`✅ ai_generated/config.json passed (${aiConfig.length} exams).`);
            }
        } catch (e) {
            console.error('❌ ai_generated/config.json Syntax Error');
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
    const combinedConfigs = [...config.map(c => ({...c, isAI: false})), ...aiConfig.map(c => ({...c, isAI: true}))];
    
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
        const basePath = entry.isAI ? path.join(__dirname, '../ai_generated') : path.join(__dirname, '..');
        const examPath = path.join(basePath, entry.path);

        // Check File Existence & Case Sensitivity
        if (!fs.existsSync(examPath) || !fileExistsCaseSensitive(examPath)) {
            console.error(`❌ FILE ERROR: "${entry.path}" not found or casing mismatch for ID ${entry.id}`);
            hasError = true;
            continue;
        }

        try {
            const rawExam = fs.readFileSync(examPath, 'utf-8');
            const examData = JSON.parse(rawExam);
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