import { Play, Clock } from 'lucide-react';

export default function VideoCard({ video, onClick }) {
  return (
    <button
      onClick={() => onClick(video)}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all text-left group"
    >
      <div className="relative aspect-video bg-slate-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-12 h-12 text-white fill-white" />
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-2 text-slate-800">{video.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{video.channel}</p>
      </div>
    </button>
  );
}
