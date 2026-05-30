import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createSession,
  generateSessionContent,
  getSession,
  updateDifficulty,
  chat,
  generateQuizForSession,
  submitQuiz,
  getFlashcards,
} from '../controllers/studyController.js';

const router = Router();

router.use(protect);

router.post('/sessions', createSession);
router.post('/sessions/:id/generate', generateSessionContent);
router.get('/sessions/:id', getSession);
router.patch('/sessions/:id/difficulty', updateDifficulty);
router.post('/sessions/:id/chat', chat);
router.post('/sessions/:id/quiz/generate', generateQuizForSession);
router.post('/sessions/:id/quiz/submit', submitQuiz);
router.get('/sessions/:id/flashcards', getFlashcards);

export default router;
