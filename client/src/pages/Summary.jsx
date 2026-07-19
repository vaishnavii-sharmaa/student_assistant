import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BookMarked, 
  Search, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  FileText, 
  Link as LinkIcon, 
  Calendar, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  X,
  FileDown
} from 'lucide-react';
import Layout from '../components/Layout';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { 
  getSessions, 
  deleteSession, 
  updateSessionNotes, 
  summarizeCustomContent, 
  saveCustomSummary,
  getFlashcards
} from '../api/study';
import { formatDate } from '../utils/helpers';

// Local difficulty color helper
const getDiffColor = (diff) => {
  switch (diff?.toLowerCase()) {
    case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400';
    case 'intermediate': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
    case 'advanced': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400';
    default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  }
};

// 3D Flippable Flashcard Component
function FlashcardComponent({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div 
      className="w-full h-48 cursor-pointer select-none" 
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-center shadow-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-2">Question</span>
          <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">{card.front}</p>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-4">Click to flip</span>
        </div>
        {/* Back Side */}
        <div 
          className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-200 dark:border-indigo-900/60 p-6 flex flex-col items-center justify-center text-center shadow-sm"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">Answer</span>
          <p className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">{card.back}</p>
          <span className="text-xs text-indigo-400 dark:text-indigo-500 mt-4">Click to flip</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Summary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'saved'; // 'saved' or 'quick'
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  
  // Selected session detail
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Flashcards state for active session
  const [flashcards, setFlashcards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Quick Summarizer inputs
  const [summarizeType, setSummarizeType] = useState('text'); // 'text' or 'url'
  const [title, setTitle] = useState('');
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [styleInput, setStyleInput] = useState('detailed'); // 'bullet', 'paragraph', 'detailed'
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [copiedGenerated, setCopiedGenerated] = useState(false);
  const [savedGenerated, setSavedGenerated] = useState(false);

  // Load study sessions on mount and tab change
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const { data } = await getSessions();
      // Filter out sessions that have no notes
      const withNotes = data.filter(s => s.notes && s.notes.trim() !== '');
      setSessions(withNotes);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load saved summaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSessions();
    }
  }, [activeTab]);

  // Load flashcards when selected session changes
  useEffect(() => {
    if (selectedSession) {
      setLoadingCards(true);
      setFlashcards([]);
      setActiveCardIndex(0);
      getFlashcards(selectedSession._id)
        .then(({ data }) => {
          setFlashcards(data.flashcards || []);
        })
        .catch(err => {
          console.warn('Could not load flashcards:', err);
        })
        .finally(() => {
          setLoadingCards(false);
        });
    }
  }, [selectedSession]);

  // Handle delete
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this summary? This will delete the session.')) return;

    try {
      await deleteSession(id);
      toast.success('Summary deleted');
      if (selectedSession?._id === id) {
        setSelectedSession(null);
      }
      setSessions(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      toast.error('Failed to delete summary');
    }
  };

  // Handle notes update
  const handleSaveNotes = async () => {
    if (!editedNotes.trim()) return;
    setSavingNotes(true);
    try {
      const { data } = await updateSessionNotes(selectedSession._id, editedNotes);
      setSelectedSession(data);
      setIsEditing(false);
      // Update in lists
      setSessions(prev => prev.map(s => s._id === data._id ? { ...s, notes: data.notes } : s));
      toast.success('Notes updated successfully');
    } catch (err) {
      toast.error('Failed to update notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Copy helper
  const copyToClipboard = (text, setCopiedState) => {
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Download MD helper
  const downloadMarkdown = (title, content) => {
    const filename = `${title.toLowerCase().replace(/\s+/g, '_')}_summary.md`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded ${filename}`);
  };

  // Generate Custom Summary
  const handleGenerate = async (e) => {
    e.preventDefault();
    const content = summarizeType === 'text' ? textInput : urlInput;
    if (!content.trim()) {
      toast.error(summarizeType === 'text' ? 'Please paste some text first' : 'Please enter a URL first');
      return;
    }

    setGeneratingSummary(true);
    setGeneratedSummary('');
    setSavedGenerated(false);
    try {
      const payload = summarizeType === 'text' ? { text: content, style: styleInput } : { url: content, style: styleInput };
      const { data } = await summarizeCustomContent(payload);
      setGeneratedSummary(data.summary);
      toast.success('Summary generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Save Generated Summary
  const handleSaveGenerated = async () => {
    if (!generatedSummary) return;
    const summaryTitle = title.trim() || (summarizeType === 'url' ? 'Web Summary' : 'Pasted Text Summary');
    try {
      await saveCustomSummary({ topic: summaryTitle, notes: generatedSummary });
      setSavedGenerated(true);
      toast.success('Saved to study history and summaries!');
    } catch (err) {
      toast.error('Failed to save summary');
    }
  };

  // Filter sessions
  const filteredSessions = sessions.filter(s => 
    s.topic.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset visible count when search changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setVisibleCount(12);
  };

  const visibleSessions = filteredSessions.slice(0, visibleCount);
  const hasMore = filteredSessions.length > visibleCount;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] text-slate-800 dark:text-slate-100">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-accent">
              <BookMarked className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              Summary Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Browse your study summaries, review flashcards, or use AI to summarize text and websites instantly.
            </p>
          </div>
          
          {/* Mobile-only Tab Toggles */}
          <div className="md:hidden flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl mt-4 md:mt-0 border border-slate-200 dark:border-slate-700/60 shadow-inner">
            <button
              onClick={() => { setSearchParams({ tab: 'saved' }); setSelectedSession(null); }}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Saved
            </button>
            <button
              onClick={() => { setSearchParams({ tab: 'quick' }); }}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex-1 ${
                activeTab === 'quick'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Summarizer
            </button>
          </div>
        </div>

        {/* Tab 1: Saved Summaries */}
        {activeTab === 'saved' && (
          <div className="h-full">
            {!selectedSession ? (
              // List View
              <div>
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search saved summaries by topic name or content keywords..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                  />
                </div>

                {loading ? (
                  // Skeleton list loader
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-4 skeleton">
                        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                        <div className="h-16 bg-slate-100 dark:bg-slate-800/60 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredSessions.length === 0 ? (
                  // Empty State
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-16 px-6 shadow-sm"
                  >
                    <BookMarked className="w-16 h-16 text-indigo-100 dark:text-slate-800 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No summaries found</h3>
                    <p className="text-slate-400 dark:text-slate-500 max-w-md mx-auto mt-2">
                      {searchQuery ? "We couldn't find any summaries matching your query." : "Generate study notes in the Study tab or paste custom text in the AI Summarizer to save notes here!"}
                    </p>
                  </motion.div>
                ) : (
                  // Grid View of Cards
                  <div>
                    <motion.div 
                      layout
                      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {visibleSessions.map((session) => {
                        const wordCount = session.notes.split(/\s+/).filter(Boolean).length;
                        return (
                          <motion.div
                            key={session._id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -4 }}
                            onClick={() => {
                              setSelectedSession(session);
                              setEditedNotes(session.notes);
                              setIsEditing(false);
                            }}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 cursor-pointer hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize line-clamp-1">
                                  {session.topic}
                                </h3>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${getDiffColor(session.difficulty)}`}>
                                  {session.difficulty || 'Custom'}
                                </span>
                              </div>

                              <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(session.createdAt)}
                              </p>

                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                                {session.notes.replace(/[#*`_-]/g, '').slice(0, 150)}...
                              </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                {wordCount} words
                              </span>
                              <button
                                onClick={(e) => handleDelete(session._id, e)}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                                title="Delete summary"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>

                    {/* Show More Button */}
                    {hasMore && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center gap-2 mt-8"
                      >
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Showing {visibleCount} of {filteredSessions.length} summaries
                        </p>
                        <button
                          onClick={() => setVisibleCount(prev => prev + 12)}
                          className="px-6 py-2.5 border border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all hover:shadow-sm flex items-center gap-2"
                        >
                          Show More
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // Split detail view / Reader view
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Detailed Title Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedSession(null)}
                      className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Back to list"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 capitalize flex items-center gap-3">
                        {selectedSession.topic}
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${getDiffColor(selectedSession.difficulty)}`}>
                          {selectedSession.difficulty || 'Custom'}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Created on {formatDate(selectedSession.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`p-2.5 rounded-lg border transition-colors flex items-center gap-1.5 text-sm font-semibold ${
                        isEditing 
                          ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300' 
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                      title="Edit Notes"
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
                    </button>

                    <button
                      onClick={() => copyToClipboard(selectedSession.notes, setCopiedId)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                      title="Copy notes"
                    >
                      {copiedId ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">Copy</span>
                    </button>

                    <button
                      onClick={() => downloadMarkdown(selectedSession.topic, selectedSession.notes)}
                      className="p-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-sm font-semibold"
                      title="Download as MD"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                      onClick={() => handleDelete(selectedSession._id)}
                      className="p-2.5 border border-red-200 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-semibold"
                      title="Delete summary"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-6 md:p-8">
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                        <span>Use Markdown syntax to format your notes.</span>
                        <span>{editedNotes.length} characters</span>
                      </div>
                      <textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        className="w-full h-[50vh] p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm leading-relaxed"
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => { setIsEditing(false); setEditedNotes(selectedSession.notes); }}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 font-semibold flex items-center gap-1.5"
                        >
                          <Save className="w-4 h-4" />
                          {savingNotes ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Read Mode
                    <div className="space-y-8">
                      {/* Markdown rendering */}
                      <div className="prose max-w-none bg-slate-50/50 dark:bg-slate-800/20 p-6 sm:p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                        <MarkdownRenderer content={selectedSession.notes} />
                      </div>

                      {/* Flashcards Section */}
                      {((!loadingCards && flashcards.length > 0) || loadingCards) && (
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                            <BookMarked className="w-5 h-5 text-indigo-500" />
                            Review Flashcards ({flashcards.length})
                          </h3>

                          {loadingCards ? (
                            <div className="w-full h-48 rounded-xl skeleton flex items-center justify-center">
                              <span className="text-slate-400 text-sm">Loading cards...</span>
                            </div>
                          ) : (
                            <div className="max-w-md mx-auto space-y-4">
                              <FlashcardComponent card={flashcards[activeCardIndex]} key={activeCardIndex} />
                              
                              {/* Pagination */}
                              <div className="flex items-center justify-between px-2">
                                <span className="text-xs text-slate-400 font-medium select-none">
                                  Card {activeCardIndex + 1} of {flashcards.length}
                                </span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setActiveCardIndex(prev => Math.max(0, prev - 1))}
                                    disabled={activeCardIndex === 0}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setActiveCardIndex(prev => Math.min(flashcards.length - 1, prev + 1))}
                                    disabled={activeCardIndex === flashcards.length - 1}
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Tab 2: Quick Summarizer */}
        {activeTab === 'quick' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Summarize Content
              </h2>

              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Summarize Source Toggles */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSummarizeType('text')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all ${
                      summarizeType === 'text'
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    <FileText className="w-6 h-6" />
                    <span className="text-sm">Raw Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSummarizeType('url')}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all ${
                      summarizeType === 'url'
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/10 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    <LinkIcon className="w-6 h-6" />
                    <span className="text-sm">Website Link</span>
                  </button>
                </div>

                {/* Optional Topic Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Topic / Title <span className="text-slate-400 font-normal">(optional, for saving)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DNA Replication, Machine Learning, World War I"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                  />
                </div>

                {/* Raw Text Input */}
                {summarizeType === 'text' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Paste Text to Summarize
                    </label>
                    <textarea
                      placeholder="Paste your article, document text, or notes here (minimum 50 characters)..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full h-44 p-4 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-sm leading-relaxed"
                    />
                  </div>
                )}

                {/* URL Web Link Input */}
                {summarizeType === 'url' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Webpage URL
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://en.wikipedia.org/wiki/Artificial_intelligence"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent"
                    />
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 block">
                      Note: URLs must be public and require no login to read.
                    </span>
                  </div>
                )}

                {/* Style Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                    Summary Length & Style
                  </label>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { value: 'bullet', title: 'Bullet Points', desc: 'Sleek key points & facts' },
                      { value: 'paragraph', title: 'Concise Summary', desc: 'A short single paragraph' },
                      { value: 'detailed', title: 'Study Notes', desc: 'Comprehensive study guide' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setStyleInput(opt.value)}
                        className={`text-left p-3 border rounded-xl transition-all flex flex-col gap-0.5 ${
                          styleInput === opt.value
                            ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/10'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{opt.title}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={generatingSummary}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-100 dark:shadow-none hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" />
                  {generatingSummary ? 'AI is summarizing...' : 'Generate Summary'}
                </button>
              </form>
            </div>

            {/* Results Panel */}
            <AnimatePresence>
              {generatedSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Generated Summary
                    </h3>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(generatedSummary, setCopiedGenerated)}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
                        title="Copy summary"
                      >
                        {copiedGenerated ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => downloadMarkdown(title || 'Custom', generatedSummary)}
                        className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors"
                        title="Download summary as MD"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="prose max-w-none bg-slate-50/50 dark:bg-slate-800/10 p-6 rounded-xl border border-slate-100 dark:border-slate-800/60 mb-6">
                      <MarkdownRenderer content={generatedSummary} />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveGenerated}
                        disabled={savedGenerated}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-all ${
                          savedGenerated
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-none cursor-default dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md'
                        }`}
                      >
                        {savedGenerated ? (
                          <>
                            <Check className="w-4 h-4" />
                            Saved to Sessions
                          </>
                        ) : (
                          <>
                            <FileDown className="w-4 h-4" />
                            Save to Study Sessions
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
}
