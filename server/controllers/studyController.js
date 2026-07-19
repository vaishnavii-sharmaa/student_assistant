import Session from '../models/Session.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import axios from 'axios';
import {
  generateNotes,
  detectCodingTopic,
  generateQuiz,
  generateAnalysis,
  generateRoadmap,
  generateFlashcards,
  chatAboutTopic,
  summarizeContent,
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

    const isCodingTopicFlag = await detectCodingTopic(session.topic);

    const [notes, videos, leetcodeQuestions] = await Promise.all([
      generateNotes(session.topic, session.difficulty),
      searchVideos(session.topic),
      isCodingTopicFlag ? searchProblems(session.topic) : Promise.resolve([]),
    ]);

    session.notes = notes;
    session.isCodingTopic = isCodingTopicFlag;
    session.videos = videos;
    session.leetcodeQuestions = leetcodeQuestions;
    await session.save();

    try {
      await Notification.create({
        user: req.user._id,
        title: `📝 Notes Generated: ${session.topic}`,
        message: `Your AI study notes for "${session.topic}" have been generated with ${session.difficulty} level difficulty.`,
        type: 'quiz',
      });
    } catch (err) {
      console.error('Failed to create session notification:', err);
    }

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

    const [analysis, flashcards] = await Promise.all([
      generateAnalysis(session.topic, session.notes, questions, answers, score, timeTaken || 0),
      generateFlashcards(session.notes, session.topic),
    ]);
    const roadmap = await generateRoadmap(session.topic, session.notes, analysis.weakAreas);

    session.quizAnswers = answers;
    session.quizScore = score;
    session.quizTimeTaken = timeTaken;
    session.quizCompletedAt = new Date();
    session.analysis = analysis;
    session.roadmap = roadmap;
    session.flashcards = flashcards;
    session.status = 'completed';
    await session.save();

    try {
      await Notification.create({
        user: req.user._id,
        title: `🏆 Quiz Completed: ${session.topic}`,
        message: `You completed the quiz for "${session.topic}" scoring ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%).`,
        type: 'quiz',
      });
    } catch (err) {
      console.error('Failed to create quiz completion notification:', err);
    }

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

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('topic difficulty notes isCodingTopic status createdAt');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function extractTextFromHtml(html) {
  // Remove script and style tags, comments
  let text = html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<!--([\s\S]*?)-->/g, '');
  
  // Extract text content from tags
  text = text.replace(/<\/?[^>]+(>|$)/g, ' ');
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  // Normalize spaces
  return text.replace(/\s+/g, ' ').trim();
}

export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSessionNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (notes === undefined) {
      return res.status(400).json({ message: 'Notes field is required' });
    }
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.notes = notes;
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const summarizeCustomContent = async (req, res) => {
  try {
    const { text, url, style = 'detailed' } = req.body;
    let contentToSummarize = '';

    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return res.status(400).json({ message: 'Invalid URL format. Must start with http:// or https://' });
      }
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
          },
          timeout: 8000,
        });
        contentToSummarize = extractTextFromHtml(response.data);
        if (!contentToSummarize) {
          return res.status(400).json({ message: 'Could not extract text from the provided URL' });
        }
      } catch (err) {
        console.error('Failed to fetch URL:', err);
        return res.status(400).json({ message: `Failed to fetch website content: ${err.message}` });
      }
    } else if (text) {
      contentToSummarize = text.trim();
    }

    if (!contentToSummarize) {
      return res.status(400).json({ message: 'No content provided to summarize' });
    }

    const summary = await summarizeContent(contentToSummarize, style);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveCustomSummary = async (req, res) => {
  try {
    const { topic, notes } = req.body;
    if (!topic?.trim() || !notes?.trim()) {
      return res.status(400).json({ message: 'Topic and notes are required' });
    }

    // Generate flashcards from notes using aiService
    let flashcards = [];
    try {
      flashcards = await generateFlashcards(notes, topic);
    } catch (err) {
      console.warn('Failed to auto-generate flashcards for custom summary:', err.message);
    }

    const session = await Session.create({
      user: req.user._id,
      topic: topic.trim(),
      notes: notes.trim(),
      flashcards,
      status: 'completed',
    });

    try {
      await Notification.create({
        user: req.user._id,
        title: `📌 Summary Saved: ${topic}`,
        message: `A custom summary for "${topic}" has been saved in your Summary Hub.`,
        type: 'exam',
      });
    } catch (err) {
      console.error('Failed to create custom summary notification:', err);
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveMarkedLine = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ message: 'Marked text is required' });
    }

    const session = await Session.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.markedLines.push(text.trim());
    await session.save();

    res.json({ markedLines: session.markedLines });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
