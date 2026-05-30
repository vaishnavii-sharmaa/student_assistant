import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Layers,
} from 'lucide-react';
import Layout from '../components/Layout';
import CircularProgress from '../components/CircularProgress';
import { getSession, generateQuiz } from '../api/study';
import { getRemarkColor, formatDuration } from '../utils/helpers';

export default function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    getSession(sessionId)
      .then(({ data }) => setSession(data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleRegenerateQuiz = async () => {
    setRegenerating(true);
    try {
      await generateQuiz(sessionId);
      navigate(`/quiz/${sessionId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to regenerate quiz');
    } finally {
      setRegenerating(false);
    }
  };

  const startWeakArea = (area) => {
    navigate('/study', { state: { topic: area } });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!session?.analysis) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-slate-500">No results found. Complete a quiz first.</p>
          <Link to="/study" className="text-indigo-600 hover:underline mt-4 inline-block">
            Go to Study
          </Link>
        </div>
      </Layout>
    );
  }

  const { analysis, quizQuestions, quizAnswers, quizScore, quizTimeTaken, roadmap } = session;
  const total = quizQuestions?.length || 0;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Quiz Results</h1>
          <p className="text-slate-500 capitalize">{session.topic}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <CircularProgress percentage={analysis.scorePercentage} />
            <div className="flex-1 text-center md:text-left">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${getRemarkColor(analysis.remark)}`}>
                {analysis.remark}
              </span>
              <p className="text-2xl font-bold text-slate-800 mt-3">
                {quizScore} / {total} correct
              </p>
              <p className="text-slate-500 mt-1">
                Time taken: {formatDuration(quizTimeTaken || 0)}
              </p>
              <p className="text-slate-600 mt-4 leading-relaxed">{analysis.feedback}</p>
            </div>
          </div>

          {analysis.weakAreas?.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-3">Weak Areas to Focus On</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.weakAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => startWeakArea(area)}
                    className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm hover:bg-amber-100 transition-colors"
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Answer Review</h2>
          <div className="space-y-4">
            {quizQuestions.map((q, i) => {
              const isCorrect = quizAnswers[i] === q.correctIndex;
              return (
                <div key={i} className="p-4 rounded-lg bg-slate-50">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-slate-800">{q.question}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Your answer: {quizAnswers[i] >= 0 ? q.options[quizAnswers[i]] : 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-emerald-600 mt-0.5">
                          Correct: {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-sm text-slate-600 mt-2">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {roadmap?.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-indigo-500" />
              What to Learn Next
            </h2>
            <div className="space-y-2">
              {roadmap.map((item, i) => (
                <button
                  key={item}
                  onClick={() => navigate('/study', { state: { topic: item } })}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 text-left transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 group-hover:text-indigo-700 font-medium">{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center pb-8">
          <button
            onClick={handleRegenerateQuiz}
            disabled={regenerating}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            {regenerating ? 'Generating...' : 'Retake Quiz'}
          </button>
          <Link
            to={`/flashcards/${sessionId}`}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
          >
            <Layers className="w-4 h-4" />
            Review Flashcards
          </Link>
          <Link
            to="/study"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50"
          >
            <BookOpen className="w-4 h-4" />
            New Topic
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
}
