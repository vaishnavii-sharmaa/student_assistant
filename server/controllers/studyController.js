import Session from '../models/Session.js';
import User from '../models/User.js';
import {
  generateNotes,
  detectCodingTopic,
  generateQuiz,
  generateAnalysis,
  generateRoadmap,
  generateFlashcards,
  chatAboutTopic,
} from '../services/aiService.js';
import { searchVideos } from '../services/youtubeService.js';
import { searchProblems } from '../services/leetcodeService.js';

function recordStudyDate(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  User.findByIdAndUpdate(userId, {
    $addToSet: { studyDates: today },
  }).catch(console.error);
}

export const createSession = async (req, res) => {
  try {
    const { topic, difficulty = 'intermediate' } = req.body;

    if (!topic?.trim()) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const session = await Session.create({
      user: req.user._id,
      topic: topic.trim(),
      difficulty,
      status: 'notes',
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateSessionContent = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const [notes, isCoding, videos] = await Promise.all([
      generateNotes(session.topic, session.difficulty),
      detectCodingTopic(session.topic),
      searchVideos(session.topic),
    ]);

    let leetcodeQuestions = [];
    if (isCoding) {
      leetcodeQuestions = await searchProblems(session.topic);
    }

    session.notes = notes;
    session.isCodingTopic = isCoding;
    session.videos = videos;
    session.leetcodeQuestions = leetcodeQuestions;
    await session.save();

    recordStudyDate(req.user._id);

    res.json(session);
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate content' });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.body;
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.difficulty = difficulty;
    session.notes = await generateNotes(session.topic, difficulty);
    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    session.chatHistory.push({ role: 'user', content: message.trim() });

    const reply = await chatAboutTopic(
      session.topic,
      session.notes,
      session.chatHistory.slice(0, -1),
      message.trim()
    );

    session.chatHistory.push({ role: 'assistant', content: reply });
    await session.save();

    res.json({ reply, chatHistory: session.chatHistory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateQuizForSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (!session.notes) {
      return res.status(400).json({ message: 'Notes must be generated first' });
    }

    const questions = await generateQuiz(session.notes, session.topic);
    session.quizQuestions = questions;
    session.status = 'quiz';
    await session.save();

    res.json({ sessionId: session._id, questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const questions = session.quizQuestions;
    if (!questions?.length) {
      return res.status(400).json({ message: 'No quiz found for this session' });
    }

    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) score++;
    });

    const analysis = await generateAnalysis(
      session.topic,
      session.notes,
      questions,
      answers,
      score,
      timeTaken || 0
    );

    const roadmap = await generateRoadmap(session.topic, session.notes, analysis.weakAreas);
    const flashcards = await generateFlashcards(session.notes, session.topic);

    session.quizAnswers = answers;
    session.quizScore = score;
    session.quizTimeTaken = timeTaken;
    session.quizCompletedAt = new Date();
    session.analysis = analysis;
    session.roadmap = roadmap;
    session.flashcards = flashcards;
    session.status = 'completed';
    await session.save();

    recordStudyDate(req.user._id);

    res.json({
      sessionId: session._id,
      score,
      total: questions.length,
      analysis,
      roadmap,
      questions,
      answers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFlashcards = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ flashcards: session.flashcards || [], topic: session.topic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
