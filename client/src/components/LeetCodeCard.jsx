import { ExternalLink } from 'lucide-react';
import { getDifficultyColor } from '../utils/helpers';

export default function LeetCodeCard({ question }) {
  return (
    <a
      href={question.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all group"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-800 dark:text-slate-200 truncate">{question.title}</h3>
        <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)}`}>
          {question.difficulty}
        </span>
      </div>
      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 ml-3" />
    </a>
  );
}
