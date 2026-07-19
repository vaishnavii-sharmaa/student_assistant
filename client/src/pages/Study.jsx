import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Search, Sparkles, BookOpen, Video, Code2, CheckCircle2, Loader2, Brain, Tv2, FileCode2, Highlighter, PenTool, Undo2, Plus } from 'lucide-react';
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
  saveMarkedLine,
  getSession,
} from '../api/study';

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function Study() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('activeStudySessionData');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [topic, setTopic] = useState(() => {
    if (location.state?.topic) return location.state.topic;
    try {
      const saved = localStorage.getItem('activeStudySessionData');
      return saved ? JSON.parse(saved).topic : '';
    } catch { return ''; }
  });
  const [difficulty, setDifficulty] = useState(() => {
    try {
      const saved = localStorage.getItem('activeStudySessionData');
      return saved ? JSON.parse(saved).difficulty : 'intermediate';
    } catch { return 'intermediate'; }
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [changingDifficulty, setChangingDifficulty] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubTab = searchParams.get('tab') || 'notes';
  const [genStep, setGenStep] = useState(0);

  useEffect(() => {
    if (location.state?.reset) {
      setSession(null);
      setTopic('');
      setDifficulty('intermediate');
      navigate('/study', { replace: true, state: {} });
    }
  }, [location.state, navigate]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const stepTimerRef = useRef(null);
  const drawRef = useRef(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem('activeStudySessionId', session._id);
      localStorage.setItem('activeStudySessionData', JSON.stringify(session));
    }
  }, [session]);

  useEffect(() => {
    if (session || loading) return;
    const savedSessionId = localStorage.getItem('activeStudySessionId');
    if (savedSessionId) {
      setLoading(true);
      getSession(savedSessionId)
        .then(({ data }) => {
          setSession(data);
          setTopic(data.topic);
          setDifficulty(data.difficulty);
        })
        .catch((err) => {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('activeStudySessionId');
          localStorage.removeItem('activeStudySessionData');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const GEN_STEPS = [
    { icon: Brain, label: 'Analysing topic...', color: 'text-indigo-500' },
    { icon: BookOpen, label: 'Generating study notes...', color: 'text-purple-500' },
    { icon: Tv2, label: 'Finding YouTube videos...', color: 'text-red-500' },
    { icon: FileCode2, label: 'Fetching LeetCode problems...', color: 'text-emerald-500' },
    { icon: Sparkles, label: 'Finalising your session...', color: 'text-amber-500' },
  ];

  const handleStart = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setGenStep(0);
    // Cycle through UI steps to simulate progress
    let step = 0;
    stepTimerRef.current = setInterval(() => {
      step = Math.min(step + 1, GEN_STEPS.length - 1);
      setGenStep(step);
    }, 2200);

    try {
      const { data: newSession } = await createSession({ topic: topic.trim(), difficulty });
      setSession(newSession);
      setGenerating(true);

      const { data: fullSession } = await generateContent(newSession._id);
      clearInterval(stepTimerRef.current);
      setGenStep(GEN_STEPS.length - 1);
      setSession(fullSession);
      setSearchParams({ tab: 'notes' });
      toast.success('Notes generated!');
    } catch (err) {
      clearInterval(stepTimerRef.current);
      toast.error(err.response?.data?.message || 'Failed to generate content');
    } finally {
      setLoading(false);
      setGenerating(false);
      setGenStep(0);
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

  const handleMark = async (text) => {
    try {
      const { data } = await saveMarkedLine(session._id, text);
      setSession(prev => ({ ...prev, markedLines: data.markedLines }));
      toast.success('Line marked successfully');
    } catch (err) {
      toast.error('Failed to save marked line');
    }
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Study Session</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Enter a topic to generate AI-powered study materials
        </p>

        {/* Search & Difficulty Form */}
        <form
          onSubmit={handleStart}
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search, Photosynthesis, French Revolution..."
                className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent dark:text-slate-100"
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
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${difficulty === d.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {!session && (
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate'}
              </button>
            )}
          </div>
        </form>

        {/* Mobile-only resource navigation (since desktop uses Sidebar) */}
        {session && (
          <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
            {[
              { id: 'notes', label: 'Notes', icon: BookOpen },
              { id: 'videos', label: 'Videos', icon: Video },
              { id: 'leetcode', label: 'LeetCode', icon: Code2 },
              { id: 'quiz', label: 'Quiz', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm ${
                  activeSubTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Rich animated loading state while generating */}
        <AnimatePresence>
          {(generating || changingDifficulty) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 mb-8 shadow-sm"
            >
              <div className="flex flex-col items-center text-center max-w-md mx-auto">
                {/* Animated spinner */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-100 dark:border-slate-800" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => { const S = GEN_STEPS[genStep]?.icon || Sparkles; return <S className={`w-6 h-6 ${GEN_STEPS[genStep]?.color || 'text-indigo-500'}`} />; })()}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Preparing your session</h3>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={genStep}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-slate-500 dark:text-slate-400 mb-6"
                  >
                    {GEN_STEPS[genStep]?.label}
                  </motion.p>
                </AnimatePresence>

                {/* Steps progress */}
                <div className="w-full space-y-2">
                  {GEN_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isDone = i < genStep;
                    const isCurrent = i === genStep;
                    return (
                      <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                        isCurrent ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/40' :
                        isDone ? 'opacity-60' : 'opacity-30'
                      }`}>
                        {isDone
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          : isCurrent
                            ? <Loader2 className={`w-4 h-4 ${step.color} animate-spin flex-shrink-0`} />
                            : <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        }
                        <span className={`text-sm font-medium ${
                          isCurrent ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                        }`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">
                  AI is working hard — this usually takes 10–20 seconds.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Contents */}
        {session && !generating && !changingDifficulty && (
          <div className="mt-4">
            {activeSubTab === 'notes' && (
              <div className="space-y-6">
                <PomodoroTimer />
                
                <div className={`grid grid-cols-1 ${session.markedLines?.length > 0 ? 'lg:grid-cols-3' : ''} gap-6 items-start`}>
                  {/* Notes Section */}
                  <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm ${session.markedLines?.length > 0 ? 'lg:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
                        {session.topic}
                      </h2>
                      <div className="flex items-center gap-3">
                        {isDrawingMode && (
                          <button
                            onClick={() => drawRef.current?.undo()}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            title="Undo"
                          >
                            <Undo2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Undo</span>
                          </button>
                        )}
                        <button
                          onClick={() => setIsDrawingMode(!isDrawingMode)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            isDrawingMode 
                              ? 'bg-indigo-600 text-white border-indigo-600' 
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <PenTool className="w-4 h-4" />
                          {isDrawingMode ? 'Done Drawing' : 'Draw'}
                        </button>
                      </div>
                    </div>
                    <MarkdownRenderer ref={drawRef} content={session.notes} onMark={handleMark} isDrawingMode={isDrawingMode} />
                  </div>
                  
                  {/* Highlights Section (Right Side) */}
                  {session.markedLines?.length > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/50 p-6 shadow-sm sticky top-6 lg:col-span-1 max-h-[80vh] overflow-y-auto scrollbar-hide">
                      <div className="flex items-center gap-2 mb-4 sticky top-0 bg-indigo-50 dark:bg-slate-900/10 pb-2 z-10">
                        <Highlighter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                          Saved Highlights
                        </h2>
                      </div>
                      <ul className="space-y-3">
                        {session.markedLines.map((line, idx) => (
                          <li key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 italic border-l-4 border-l-indigo-500 text-sm shadow-sm">
                            "{line}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSubTab === 'videos' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  Recommended Videos
                </h2>
                {session.videos?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {session.videos.map((video) => (
                      <VideoCard key={video.videoId} video={video} onClick={setSelectedVideo} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500">
                    No video recommendations available for this topic.
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'leetcode' && (
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                  LeetCode Practice
                </h2>
                {session.leetcodeQuestions?.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {session.leetcodeQuestions.map((q) => (
                      <LeetCodeCard key={q.titleSlug} question={q} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500">
                    No LeetCode practice problems recommended for this topic.
                  </div>
                )}
              </div>
            )}

            {activeSubTab === 'chat' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Q&A Chatbot</h2>
                <ChatBox
                  chatHistory={session.chatHistory || []}
                  onSend={handleChat}
                  loading={chatLoading}
                />
              </div>
            )}

            {activeSubTab === 'quiz' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Practice Quiz</h2>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center">
                  <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Test your knowledge on <span className="font-semibold capitalize">{session.topic}</span> with an AI-generated quiz.
                  </p>
                  <button
                    type="button"
                    onClick={handleTakeQuiz}
                    disabled={quizLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    {quizLoading ? 'Generating Quiz...' : 'Start Quiz'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}


        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </motion.div>
    </Layout>
  );
}
