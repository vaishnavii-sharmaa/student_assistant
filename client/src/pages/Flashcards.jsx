import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowLeft } from 'lucide-react';
import Layout from '../components/Layout';
import { getFlashcards } from '../api/study';

export default function Flashcards() {
  const { sessionId } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [topic, setTopic] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFlashcards(sessionId)
      .then(({ data }) => {
        setFlashcards(data.flashcards || []);
        setTopic(data.topic);
      })
      .catch(() => toast.error('Failed to load flashcards'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const card = flashcards[currentIndex];

  const next = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % flashcards.length);
  };

  const prev = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i - 1 + flashcards.length) % flashcards.length);
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

  if (!flashcards.length) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-slate-500">No flashcards available. Complete a quiz first.</p>
          <Link to="/study" className="text-indigo-600 hover:underline mt-4 inline-block">
            Go to Study
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to={`/results/${sessionId}`} className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Link>
          <span className="text-sm text-slate-500 capitalize">{topic}</span>
        </div>

        <p className="text-center text-sm text-slate-500 mb-4">
          Card {currentIndex + 1} of {flashcards.length}
        </p>

        <motion.div
          key={`${currentIndex}-${flipped}`}
          initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer min-h-64 bg-white rounded-2xl border-2 border-indigo-200 shadow-lg p-8 flex items-center justify-center text-center hover:border-indigo-400 transition-colors"
        >
          <div>
            <p className="text-xs text-indigo-500 font-medium mb-3 uppercase tracking-wide">
              {flipped ? 'Answer' : 'Question'}
            </p>
            <p className="text-xl font-medium text-slate-800 leading-relaxed">
              {flipped ? card.back : card.front}
            </p>
            <p className="text-xs text-slate-400 mt-6">Click to flip</p>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button onClick={prev} className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setFlipped(!flipped)}
            className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RotateCcw className="w-4 h-4" />
            Flip
          </button>
          <button onClick={next} className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </Layout>
  );
}
