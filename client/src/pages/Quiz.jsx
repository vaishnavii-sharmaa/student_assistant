import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Clock, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout';
import { getQuiz, submitQuiz } from '../api/study';

const QUESTION_TIME = 30;

export default function Quiz() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [topic, setTopic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const totalTimeRef = useRef(0);
  const submittingRef = useRef(false);

  useEffect(() => {
    getQuiz(sessionId)
      .then(({ data }) => {
        setQuestions(data.questions || []);
        setTopic(data.topic);
        if (data.status === 'completed') {
          navigate(`/results/${sessionId}`, { replace: true });
        }
      })
      .catch(() => toast.error('Failed to load quiz'))
      .finally(() => setPageLoading(false));
  }, [sessionId, navigate]);

  const finishQuiz = async (finalAnswers) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await submitQuiz(sessionId, { answers: finalAnswers, timeTaken: totalTimeRef.current });
      navigate(`/results/${sessionId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit quiz');
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const goNext = (currentSelected = selected) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = currentSelected ?? -1;
    setAnswers(newAnswers);

    if (currentIndex + 1 >= questions.length) {
      finishQuiz(newAnswers);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(newAnswers[currentIndex + 1] ?? null);
      setTimeLeft(QUESTION_TIME);
    }
  };

  useEffect(() => {
    if (pageLoading || !questions.length || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          goNext(selected);
          return QUESTION_TIME;
        }
        return t - 1;
      });
      totalTimeRef.current += 1;
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, pageLoading, questions.length, submitting, selected]);

  if (pageLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!questions.length) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-slate-500">No quiz found for this session.</p>
        </div>
      </Layout>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1 capitalize">{topic}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-indigo-600">
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-600 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-xl border border-slate-200 p-8"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                    selected === i
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={() => goNext()}
              disabled={selected === null || submitting}
              className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting
                ? 'Submitting...'
                : currentIndex + 1 >= questions.length
                  ? 'Submit Quiz'
                  : 'Next Question'}
              {!submitting && <ChevronRight className="w-4 h-4" />}
            </button>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}
