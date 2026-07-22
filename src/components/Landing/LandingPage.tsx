import React from 'react';
import {
  Zap,
  Sparkles,
  Bot,
  Kanban,
  Clock,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
  Users,
  Globe,
  Star,
  ChevronDown,
  Layers,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setMainTab, setViewMode, setIsUpgradeModalOpen } = useApp();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-24 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>Introducing FlowStack 2.0 with Gemini 3.6 Flash AI Sidekick</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
          Work Faster.{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Stay Organized.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          The Trello + Notion + ClickUp inspired Kanban platform built for high-velocity engineering and product teams. Real-time collaboration, Gantt timelines, and AI task generation.
        </p>

        <div className="flex items-center justify-center space-x-4 pt-2">
          <button
            onClick={() => setMainTab('app')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Launch Live App</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMainTab('docs')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-colors"
          >
            Read Documentation
          </button>
        </div>

        {/* Live Mock Banner */}
        <div className="pt-8">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-4xl mx-auto overflow-hidden">
            <div className="flex items-center space-x-2 px-3 py-2 border-b border-slate-800 text-xs text-slate-500">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-slate-400">app.flowstack.io / workspace / roadmap</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
              alt="FlowStack Interface Preview"
              className="w-full h-80 object-cover rounded-2xl opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 py-20 bg-slate-900/60 border-y border-slate-800/80 max-w-6xl mx-auto rounded-3xl my-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Engineered for Commercial SaaS Launches</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything your team needs to plan sprints, automate workflows, and track velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3 hover:border-indigo-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Kanban className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Interactive Kanban Boards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag and drop lists and cards, customize priority badges, assign labels, and track checklist progress seamlessly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3 hover:border-purple-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Gemini 3.6 AI Sidekick</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Server-side Gemini model auto-generates markdown specs, breaks complex tasks into subtasks, and predicts project risk.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-3 hover:border-pink-500/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Gantt Timelines & Calendar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize critical paths, drag due dates, align sprint milestones, and track time spent vs estimates.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-20 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Transparent Commercial Pricing</h2>
          <p className="text-xs sm:text-sm text-slate-400">Start free and scale as your engineering team grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white">Free Starter</h3>
            <div className="text-3xl font-black text-white">$0 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Up to 3 boards</span></li>
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Standard Kanban view</span></li>
            </ul>
            <button onClick={() => setMainTab('app')} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors">Get Started</button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-indigo-500 shadow-2xl space-y-4 relative">
            <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500 text-white">Most Popular</span>
            <h3 className="font-bold text-base text-white">FlowStack Pro</h3>
            <div className="text-3xl font-black text-white">$12 <span className="text-xs font-normal text-slate-400">/ mo / user</span></div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Unlimited boards & cards</span></li>
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Gemini 3.6 Flash AI Sidekick</span></li>
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Gantt Timeline & Analytics</span></li>
            </ul>
            <button onClick={() => { setMainTab('app'); setIsUpgradeModalOpen(true); }} className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors shadow-lg shadow-indigo-500/30">Upgrade Now</button>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white">Business Scale</h3>
            <div className="text-3xl font-black text-white">$29 <span className="text-xs font-normal text-slate-400">/ mo / user</span></div>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>Everything in Pro</span></li>
              <li className="flex items-center space-x-2"><Check className="w-3.5 h-3.5 text-indigo-400" /><span>SaaS Admin Panel & Logs</span></li>
            </ul>
            <button onClick={() => { setMainTab('app'); setIsUpgradeModalOpen(true); }} className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>© 2026 FlowStack Inc. Work Faster. Stay Organized.</p>
      </footer>
    </div>
  );
};
