import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { getAllExams, getExamById, getAIExams, getBlogPosts, getExamsByCategory } from './index';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

// API Endpoints
app.get('/api/exams', (req: Request, res: Response) => {
    const exams = getAllExams();
    res.json(exams);
});

app.get('/api/exams/:id', async (req: Request, res: Response) => {
    const exam = await getExamById(req.params.id);
    if (exam) {
        res.json(exam);
    } else {
        res.status(404).json({ error: 'Exam not found' });
    }
});

app.get('/api/ai-exams', (req: Request, res: Response) => {
    const aiExams = getAIExams();
    res.json(aiExams);
});

app.get('/api/blog-posts', (req: Request, res: Response) => {
    const blogs = getBlogPosts();
    res.json(blogs);
});

app.get('/api/exams/category/:category', (req: Request, res: Response) => {
    const exams = getExamsByCategory(req.params.category);
    res.json(exams);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser to test.`);
});
