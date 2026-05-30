import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Session from '../models/Session.js';

const router = Router();

router.use(protect);

router.get('/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    });

    if (!session) return res.status(404).json({ message: 'Session not found' });

    res.json({
      sessionId: session._id,
      topic: session.topic,
      questions: session.quizQuestions,
      status: session.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
