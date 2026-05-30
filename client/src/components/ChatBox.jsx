import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function ChatBox({ chatHistory, onSend, loading }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    onSend(message.trim());
    setMessage('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-slate-800">Ask a Follow-up Question</h3>
      </div>

      {chatHistory.length > 0 && (
        <div className="max-h-80 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <MarkdownRenderer content={msg.content} />
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">
                Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything about this topic..."
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
