import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    videoId: String,
    title: String,
    channel: String,
    thumbnail: String,
    duration: String,
  },
  { _id: false }
);

const leetcodeSchema = new mongoose.Schema(
  {
    titleSlug: String,
    title: String,
    difficulty: String,
    url: String,
  },
  { _id: false }
);

const quizQuestionSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    correctIndex: Number,
    explanation: String,
  },
  { _id: false }
);

const chatMessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
  },
  { _id: false }
);

const flashcardSchema = new mongoose.Schema(
  {
    front: String,
    back: String,
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
    notes: { type: String, default: '' },
    isCodingTopic: { type: Boolean, default: false },
    videos: [videoSchema],
    leetcodeQuestions: [leetcodeSchema],
    quizQuestions: [quizQuestionSchema],
    quizAnswers: [Number],
    quizScore: { type: Number, default: null },
    quizTimeTaken: { type: Number, default: null },
    quizCompletedAt: { type: Date, default: null },
    analysis: {
      scorePercentage: Number,
      remark: String,
      feedback: String,
      weakAreas: [String],
    },
    roadmap: [String],
    chatHistory: [chatMessageSchema],
    flashcards: [flashcardSchema],
    status: { type: String, enum: ['notes', 'quiz', 'completed'], default: 'notes' },
  },
  { timestamps: true }
);

const Session = mongoose.model('Session', sessionSchema);
export default Session;
