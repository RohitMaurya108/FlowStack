import React from 'react';
import { FileText, Clock, User as UserIcon, ArrowRight, Tag } from 'lucide-react';

export const BlogView: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: 'How High-Velocity Teams Use Gemini 3.6 Flash for Automated Sprint Planning',
      category: 'AI Engineering',
      readTime: '5 min read',
      date: 'July 18, 2026',
      excerpt: 'Learn how server-side AI sidekicks break down monolith task descriptions into structured subtasks, decreasing backlog review time by 60%.',
    },
    {
      id: 2,
      title: 'Building Real-time Collaborative Kanban Boards with Sockets and Local Persistence',
      category: 'Architecture',
      readTime: '8 min read',
      date: 'July 12, 2026',
      excerpt: 'An architectural deep dive into zero-latency drag and drop sync across multi-tab browser sessions with local offline fallback.',
    },
    {
      id: 3,
      title: 'Optimizing Sprint Burndown Velocity with Gantt Critical Path Analysis',
      category: 'Productivity',
      readTime: '6 min read',
      date: 'July 5, 2026',
      excerpt: 'Discover why identifying task dependencies early prevents late-sprint blockers and stabilizes team throughput.',
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-8 text-slate-100 max-w-5xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white flex items-center space-x-3">
          <FileText className="w-7 h-7 text-indigo-400" />
          <span>FlowStack Engineering & Product Blog</span>
        </h1>
        <p className="text-xs text-slate-400">
          Insights on agile Kanban workflows, AI task management, and SaaS engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <div
            key={art.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                  {art.category}
                </span>
                <span className="text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime}</span>
                </span>
              </div>
              <h3 className="font-bold text-sm text-white leading-snug hover:text-indigo-300 transition-colors">
                {art.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-3">{art.excerpt}</p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{art.date}</span>
              <span className="text-indigo-400 font-bold flex items-center space-x-1 hover:underline cursor-pointer">
                <span>Read</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
