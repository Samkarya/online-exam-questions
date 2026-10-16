import fs from 'fs';
import path from 'path';
import { ConfigSchema, ExamSchema, BlogIndexSchema, RootConfigSchema } from './schemas';
import { Config, Question, BlogIndex } from './types';
import { processExamText, snippetAt, describeWhere, extractImageRefs } from './examCore';

// CLI flags:  --warnings  list every content warning   |   --strict  treat warnings as errors
const SHOW_WARNINGS = process.argv.includes('--warnings');
const STRICT = process.argv.includes('--strict');
const ROOT_DIR = path.join(__dirname, '..');

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

// Case-sensitive existence for EVERY path segment (an image that works on Windows/macOS but 404s on Linux/GitHub Pages),
// and refuses paths that escape the repository.
const dirCache = new Map<string, string[]>();
function existsCaseSensitive(abs: string): boolean {
    const rel = path.relative(ROOT_DIR, abs);
    if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) return false;
    let cur = ROOT_DIR;
    for (const seg of rel.split(path.sep)) {
        let list = dirCache.get(cur);
        if (!list) {
            try { list = fs.readdirSync(cur); } catch (e) { return false; }
            dirCache.set(cur, list);
        }
        if (!list.includes(seg)) return false;
        cur = path.join(cur, seg);
    }
    return true;
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
            console.warn(`⚠️ MISSING CONFIG (Skipped): "${relativePath}" referenced in config.json not found.`);
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
                        short_description: exam.short_description,
                        path: exam.path,
                        suitePath: relativePath,
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
    // The shared core (src/examCore.ts) checks syntax, structure, answers, numbering and renderer-aware content.
    // Errors fail the build. Warnings are summarised (use --warnings to list them, --strict to fail on them).
    const warnTotals = new Map<string, { title: string; count: number; files: Set<string>; example: string }>();
    for (const entry of combinedConfigs) {

        const examPath = path.join(__dirname, '..', entry.path);
        const exists = fs.existsSync(examPath) && fileExistsCaseSensitive(examPath);

        if (!exists) {
            console.error(`❌ FILE ERROR: "${entry.path}" not found for ID ${entry.id}`);
            hasError = true;
            continue;
        }

        try {
            const rawExam = fs.readFileSync(examPath, 'utf-8');
            const report = processExamText(rawExam, { mode: 'check' });

            if (report.fatal) {
                console.error(`❌ CANNOT READ ${entry.path}: ${report.fatal.message}`);
                if (report.fatal.offset !== undefined) console.error(snippetAt(rawExam, report.fatal.offset));
                if (report.fatal.suggestion) console.error(`   Hint: ${report.fatal.suggestion}`);
                hasError = true;
                continue;
            }

            const errorGroups = report.groups.filter(g => g.severity === 'error');
            if (errorGroups.length > 0) {
                console.error(`❌ ${report.issues.filter(i => i.severity === 'error').length} problem(s) in ${entry.path}:`);
                for (const g of errorGroups) {
                    console.error(`   • ${describeWhere(g)}${g.example}${g.count > 1 ? `  (+${g.count - 1} more like this)` : ''}`);
                }
                hasError = true;
                continue;
            }

            for (const g of report.groups) {
                if (g.severity === 'error') continue;
                const t = warnTotals.get(g.code) || { title: g.title, count: 0, files: new Set<string>(), example: '' };
                t.count += g.count;
                t.files.add(entry.path);
                if (!t.example) t.example = `${entry.path}  ${describeWhere(g)}${g.example}`;
                warnTotals.set(g.code, t);
                if (SHOW_WARNINGS) console.warn(`⚠️  ${entry.path}: ${describeWhere(g)}${g.example}`);
            }

            // Structural safety net (zod). The core already rejects everything below, so this should never fire.
            const result = ExamSchema.safeParse(JSON.parse(rawExam));
            if (!result.success) {
                console.error(`❌ SCHEMA ERROR in ${entry.path}:`);
                console.error(JSON.stringify(result.error.issues.slice(0, 2), null, 2));
                hasError = true;
                continue;
            }

            // Explicitly use the Question type here
            const questions: Question[] = result.data;

            // Image Asset Validation: real markdown parsing (titles, parentheses, <img src>), code blocks ignored.
            for (const q of questions) {
                const textFields = [q.question_text, q.explanation, ...Object.values(q.options)];
                for (const text of textFields) {
                    if (!text) continue;
                    for (const ref of extractImageRefs(text)) {
                        const src = ref.src.trim();
                        if (!src || /^(https?:)?\/\//i.test(src) || /^(data|mailto|blob):/i.test(src)) continue; // external / inline
                        let clean = src.split('#')[0].split('?')[0];
                        try { clean = decodeURI(clean); } catch (e) { /* keep as written */ }
                        const absoluteImagePath = path.join(__dirname, '..', clean);
                        if (!fs.existsSync(absoluteImagePath)) {
                            console.error(`❌ MISSING ASSET (${entry.path}): Q${q.question_number} references "${src}" which does not exist.`);
                            hasError = true;
                        } else if (!existsCaseSensitive(absoluteImagePath)) {
                            console.error(`❌ ASSET CASE MISMATCH (${entry.path}): Q${q.question_number} references "${src}" but the file name differs in upper/lower case (works locally, breaks on GitHub Pages).`);
                            hasError = true;
                        }
                    }
                }
            }

        } catch (e) {
            console.error(`❌ UNEXPECTED ERROR while checking ${entry.path}:`, e);
            hasError = true;
        }
    }

    if (warnTotals.size > 0) {
        let total = 0;
        warnTotals.forEach(t => { total += t.count; });
        console.warn(`\n⚠️  ${total} content warning(s) — they do not fail the build${STRICT ? ' (but --strict is on)' : ''}. Run "npm run validate -- --warnings" to list them.`);
        warnTotals.forEach(t => console.warn(`   • ${String(t.count).padStart(3)} × ${t.title}  [${t.files.size} file(s)]  e.g. ${t.example.slice(0, 150)}`));
        if (STRICT) hasError = true;
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