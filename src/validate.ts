import fs from 'fs';
import path from 'path';
import { ConfigSchema, ExamSchema, BlogIndexSchema, RootConfigSchema } from './schemas';
import { Config, Question, BlogIndex } from './types';

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

        const result = RootConfigSchema.safeParse(parsed);

        if (!result.success) {
            console.error('❌ config.json Schema Error: Expected Registry Object (ZodRecord)');
            console.error(JSON.stringify(result.error.format(), null, 2));
            hasError = true;
        } else {
            // Extract paths from the registry
            const registry = result.data;
            configFiles = Object.values(registry).map(entry => entry.path);
            console.log(`✅ config.json registry passed (${configFiles.length} category configs referenced).`);
        }
    } catch (e) {
        console.error('❌ config.json Syntax Error:', e);
        hasError = true;
    }

    // =========================================
    // 2. Load & Validate Referenced Configs
    // =========================================
    const examToSuiteMap: Record<string, string> = {};
    const searchIndex: any[] = [];

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

            const result = ConfigSchema.safeParse(parsedSub);

            if (!result.success) {
                console.error(`❌ CONFIG SCHEMA ERROR in "${relativePath}":`);
                console.error(JSON.stringify(result.error.format(), null, 2));
                hasError = true;
            } else {
                console.log(`   - Verified ${relativePath} (${result.data.length} exams)`);
                combinedConfigs.push(...result.data);

                // Add to index map and search index
                for (const exam of result.data) {
                    examToSuiteMap[exam.id] = relativePath;
                    searchIndex.push({
                        id: exam.id,
                        title: exam.title,
                        description: exam.description,
                        short_description: exam.short_description,
                        path: exam.path,
                        suitePath: relativePath,
                        category: exam.category,
                        year: exam.year,
                        tags: exam.tags
                    });
                }
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

        let examPath = path.join(__dirname, '..', entry.path);
        let exists = fs.existsSync(examPath) && fileExistsCaseSensitive(examPath);

        if (!exists) {
            console.error(`❌ FILE ERROR: "${entry.path}" not found for ID ${entry.id}`);
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
        // Generate exam-index.json
        const globalDir = path.join(__dirname, '../global');
        if (!fs.existsSync(globalDir)) {
            fs.mkdirSync(globalDir, { recursive: true });
        }

        const indexPath = path.join(globalDir, 'exam-index.json');
        fs.writeFileSync(indexPath, JSON.stringify(examToSuiteMap, null, 2));
        console.log(`✅ Generated exam index at global/exam-index.json (${Object.keys(examToSuiteMap).length} exams).`);

        const searchIndexPath = path.join(globalDir, 'search-index.json');
        fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex, null, 2));
        console.log(`✅ Generated search index at global/search-index.json (${searchIndex.length} entries).`);

        console.log('\n✨ All Systems Operational. Ready for Deployment.');
    }
}

validate();