import React, { useState } from 'react';
import {
  Shield,
  Users,
  DollarSign,
  HardDrive,
  Activity,
  UserCheck,
  Ban,
  Trash2,
  Lock,
  Sparkles,
  ToggleRight,
  ToggleLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminPanel: React.FC = () => {
  const { allUsers, activities, user, setUser } = useApp();

  const [featureFlags, setFeatureFlags] = useState({
    aiSidekickEnabled: true,
    realtimeSocketsEnabled: true,
    stripeCheckoutEnabled: true,
    maintenanceMode: false,
  });

  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);

  const toggleBanUser = (id: string) => {
    setBannedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">FlowStack Commercial Admin Panel</h2>
            <p className="text-xs text-slate-400">
              System administration, user access management, MRR analytics, and global feature flags.
            </p>
          </div>
        </div>
      </div>

      {/* SaaS Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Recurring Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">$14,280 / mo</div>
          <p className="text-[11px] text-emerald-400 font-medium">+18.4% from last month</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{allUsers.length * 142}</div>
          <p className="text-[11px] text-indigo-300 font-medium">98.2% session retention</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cloud Storage Usage</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">42.8 GB</div>
          <p className="text-[11px] text-purple-300 font-medium">Supabase Storage Cluster</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>System Health</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">99.99%</div>
          <p className="text-[11px] text-slate-400 font-medium">Cloud Run Asia Container</p>
        </div>
      </div>

      {/* Feature Flags Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Global SaaS Feature Flags</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-white">Gemini 3.6 AI Sidekick Engine</div>
              <div className="text-[11px] text-slate-400">Enable AI subtasks & risk predictions</div>
            </div>
            <button
              onClick={() =>
                setFeatureFlags((prev) => ({ ...prev, aiSidekickEnabled: !prev.aiSidekickEnabled }))
              }
            >
              {featureFlags.aiSidekickEnabled ? (
                <ToggleRight className="w-6 h-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-white">WebSocket Presence & Cursor Tracking</div>
              <div className="text-[11px] text-slate-400">Real-time collaboration broadcast</div>
            </div>
            <button
              onClick={() =>
                setFeatureFlags((prev) => ({
                  ...prev,
                  realtimeSocketsEnabled: !prev.realtimeSocketsEnabled,
                }))
              }
            >
              {featureFlags.realtimeSocketsEnabled ? (
                <ToggleRight className="w-6 h-6 text-indigo-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center space-x-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>User Accounts & Tier Subscriptions ({allUsers.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Subscription</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {allUsers.map((u) => {
                const isBanned = bannedUserIds.includes(u.id);
                return (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-semibold text-white flex items-center space-x-2">
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-indigo-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {u.plan}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleBanUser(u.id)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                          isBanned
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                        }`}
                      >
                        {isBanned ? 'Unban User' : 'Ban User'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
