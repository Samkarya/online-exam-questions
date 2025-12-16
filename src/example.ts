import { getAllExams, getExamById, getAIExams, getBlogPosts, getExamsByCategory } from './index';

async function main() {
    console.log('--- 1. Fetching All Main Exams ---');
    const allExams = getAllExams();
    console.log(`Found ${allExams.length} exams.`);
    if (allExams.length > 0) {
        console.log('First exam:', allExams[0].title);
    }

    console.log('\n--- 2. Fetching a Specific Exam ---');
    // Use an ID from your config.json, e.g., 'nimcet_2023'
    const examId = 'nimcet_2023';
    const examData = await getExamById(examId);
    if (examData) {
        console.log(`Loaded exam: ${examId}`);
        console.log(`Number of questions: ${examData.length}`);
        console.log('First Question:', examData[0].question_text);
    } else {
        console.log(`Exam ${examId} not found.`);
    }

    console.log('\n--- 3. Fetching AI Exams ---');
    const aiExams = getAIExams();
    console.log(`Found ${aiExams.length} AI exams.`);
    if (aiExams.length > 0) {
        console.log('First AI exam model:', aiExams[0].model);
    }

    console.log('\n--- 4. Fetching Blog Posts ---');
    const blogPosts = getBlogPosts();
    console.log(`Found ${blogPosts.length} blog posts.`);
    if (blogPosts.length > 0) {
        console.log('First blog post title:', blogPosts[0].title);
    }

    console.log('\n--- 5. Filtering by Category ---');
    const nimcetExams = getExamsByCategory('NIMCET');
    console.log(`Found ${nimcetExams.length} NIMCET exams.`);
}

main().catch(console.error);
