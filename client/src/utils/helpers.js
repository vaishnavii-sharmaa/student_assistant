export function getRemarkColor(remark) {
  switch (remark) {
    case 'Excellent': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-amber-100 text-amber-700 border-amber-200';
  }
}

export function getDifficultyColor(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-emerald-100 text-emerald-700';
    case 'medium': return 'bg-amber-100 text-amber-700';
    case 'hard': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
