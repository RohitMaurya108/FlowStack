import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  Bot,
  AlertTriangle,
  Loader2,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { cards, boards, activeBoardId, allUsers } = useApp();

  const [isRiskLoading, setIsRiskLoading] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const boardCards = cards.filter((c) => c.boardId === activeBoardId);

  const completedCount = boardCards.filter((c) => c.status === 'done').length;
  const inProgressCount = boardCards.filter((c) => c.status === 'in_progress').length;
  const reviewCount = boardCards.filter((c) => c.status === 'review').length;
  const totalCount = boardCards.length;

  const totalEstimate = boardCards.reduce((acc, c) => acc + (c.timeEstimateHours || 0), 0);
  const totalSpent = boardCards.reduce((acc, c) => acc + (c.timeSpentHours || 0), 0);

  // Burndown chart data
  const burndownData = [
    { day: 'Mon', ideal: 40, actual: 40 },
    { day: 'Tue', ideal: 32, actual: 35 },
    { day: 'Wed', ideal: 24, actual: 26 },
    { day: 'Thu', ideal: 16, actual: 18 },
    { day: 'Fri', ideal: 8, actual: 10 },
    { day: 'Sat', ideal: 0, actual: 2 },
  ];

  // Workload per user
  const workloadData = allUsers.map((user) => {
    const userCards = boardCards.filter((c) => c.assigneeIds.includes(user.id));
    return {
      name: user.name.split(' ')[0],
      assigned: userCards.length,
      completed: userCards.filter((c) => c.status === 'done').length,
    };
  });

  // Handle AI Risk Prediction
  const handleRunRiskPrediction = async () => {
    setIsRiskLoading(true);
    try {
      const res = await fetch('/api/ai/risk-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cards: boardCards.map((c) => ({
            title: c.title,
            priority: c.priority,
            status: c.status,
            dueDate: c.dueDate,
            timeEstimateHours: c.timeEstimateHours,
            timeSpentHours: c.timeSpentHours,
          })),
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setRiskAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRiskLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto text-slate-100">
      {/* Top Banner */}
      <div className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Sprint Analytics & Velocity Dashboard</h2>
            <p className="text-xs text-slate-400">
              Real-time delivery throughput, burndown velocity, and team workload metrics.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunRiskPrediction}
          disabled={isRiskLoading}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center space-x-2 transition-all"
        >
          {isRiskLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          )}
          <span>Run AI Risk Audit</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {completedCount} / {totalCount}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% Completion Rate
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active In Progress</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{inProgressCount}</div>
          <p className="text-[11px] text-amber-400 font-medium">{reviewCount} awaiting review</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Hours Invested</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalSpent} hrs</div>
          <p className="text-[11px] text-slate-400 font-medium">{totalEstimate} hrs total estimate</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Productivity Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">94 / 100</div>
          <p className="text-[11px] text-indigo-300 font-medium">Top 5% delivery efficiency</p>
        </div>
      </div>

      {/* AI Risk Prediction Output Box (if generated) */}
      {riskAnalysis && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border border-indigo-500/40 space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>AI Project Risk & Bottleneck Analysis</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Risk Score: {riskAnalysis.riskScore} / 100 ({riskAnalysis.level})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-300 mb-1.5 flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Identified Bottlenecks</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {riskAnalysis.bottlenecks?.map((b: string, idx: number) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>AI Mitigation Recommendations</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {riskAnalysis.recommendations?.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sprint Burndown Area Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Sprint Burndown (Ideal vs Actual Scope)</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={burndownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend />
                <Area type="monotone" dataKey="ideal" stroke="#818cf8" fill="#818cf8" fillOpacity={0.1} />
                <Area type="monotone" dataKey="actual" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Workload Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Team Workload & Completion Rate</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Legend />
                <Bar dataKey="assigned" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
