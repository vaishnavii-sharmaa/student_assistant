import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import NotesSkeleton from '../components/NotesSkeleton';
import MarkdownRenderer from '../components/MarkdownRenderer';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import LeetCodeCard from '../components/LeetCodeCard';
import PomodoroTimer from '../components/PomodoroTimer';
import ChatBox from '../components/ChatBox';
import {
  createSession,
  generateContent,
  updateDifficulty,
  sendChat,
  generateQuiz,
} from '../api/study';

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function Study() {
  const navigate = useNavigate();
  const location = useLocation();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [changingDifficulty, setChangingDifficulty] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const { data: newSession } = await createSession({ topic: topic.trim(), difficulty });
      setSession(newSession);
      setGenerating(true);

      const { data: fullSession } = await generateContent(newSession._id);
      setSession(fullSession);
      toast.success('Notes generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate content');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  const handleDifficultyChange = async (newDifficulty) => {
    if (!session || newDifficulty === difficulty) return;
    setDifficulty(newDifficulty);
    setChangingDifficulty(true);
    try {
      const { data } = await updateDifficulty(session._id, newDifficulty);
      setSession(data);
      toast.success('Notes updated for new difficulty');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update difficulty');
      setDifficulty(session.difficulty);
    } finally {
      setChangingDifficulty(false);
    }
  };

  const handleChat = async (message) => {
    setChatLoading(true);
    try {
      const { data } = await sendChat(session._id, message);
      setSession((prev) => ({ ...prev, chatHistory: data.chatHistory }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Chat failed');
    } finally {
      setChatLoading(false);
    }
  };

  const handleTakeQuiz = async () => {
    setQuizLoading(true);
    try {
      await generateQuiz(session._id);
      navigate(`/quiz/${session._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Study Session</h1>
        <p className="text-slate-500 mb-8">Enter a topic to generate AI-powered study materials</p>

        <form onSubmit={handleStart} className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search, Photosynthesis, French Revolution..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => {
                    setDifficulty(d.value);
                    if (session) handleDifficultyChange(d.value);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    difficulty === d.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Generating...' : session ? 'New Topic' : 'Generate'}
            </button>
          </div>
        </form>

        {(generating || changingDifficulty) && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 mb-8">
            <NotesSkeleton />
          </div>
        )}

        {session?.notes && !generating && !changingDifficulty && (
          <div className="space-y-8">
            <PomodoroTimer />

            <div className="bg-white rounded-xl border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 capitalize">{session.topic}</h2>
              <MarkdownRenderer content={session.notes} />
            </div>

            {session.videos?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Recommended Videos</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {session.videos.map((video) => (
                    <VideoCard key={video.videoId} video={video} onClick={setSelectedVideo} />
                  ))}
                </div>
              </div>
            )}

            {session.isCodingTopic && session.leetcodeQuestions?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">LeetCode Practice</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {session.leetcodeQuestions.map((q) => (
                    <LeetCodeCard key={q.titleSlug} question={q} />
                  ))}
                </div>
              </div>
            )}

            <ChatBox
              chatHistory={session.chatHistory || []}
              onSend={handleChat}
              loading={chatLoading}
            />

            <div className="flex justify-center pb-8">
              <button
                onClick={handleTakeQuiz}
                disabled={quizLoading}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200"
              >
                {quizLoading ? 'Preparing Quiz...' : 'Take Quiz'}
              </button>
            </div>
          </div>
        )}

        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </motion.div>
    </Layout>
  );
}
