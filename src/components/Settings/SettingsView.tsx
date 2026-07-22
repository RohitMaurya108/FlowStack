import React, { useState } from 'react';
import {
  Settings,
  Users,
  CreditCard,
  Plus,
  Check,
  Zap,
  Sparkles,
  Shield,
  Trash2,
  Mail,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PlanType, Role } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    workspaces,
    activeWorkspaceId,
    user,
    setUser,
    setIsUpgradeModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'billing'>('general');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('member');
  const [isAnnual, setIsAnnual] = useState(true);

  const activeWs = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole.toUpperCase()}!`);
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const plans: { type: PlanType; name: string; monthlyPrice: number; annualPrice: number; features: string[] }[] = [
    {
      type: 'free',
      name: 'Free Starter',
      monthlyPrice: 0,
      annualPrice: 0,
      features: ['Up to 3 boards', '10 cards per board', 'Basic list view', 'Community support'],
    },
    {
      type: 'pro',
      name: 'FlowStack Pro',
      monthlyPrice: 12,
      annualPrice: 10,
      features: [
        'Unlimited boards & cards',
        'Gemini 3.6 Flash AI Sidekick',
        'Gantt Timeline & Calendar view',
        'Sprint Burndown Analytics',
        '100 No-code automations/mo',
      ],
    },
    {
      type: 'business',
      name: 'Business Scale',
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        'Everything in Pro',
        'Unlimited AI Subtask generation',
        'SaaS Admin Panel access',
        'Custom fields & WebSockets',
        'Priority 24/7 SLA support',
      ],
    },
    {
      type: 'enterprise',
      name: 'Enterprise Ultra',
      monthlyPrice: 79,
      annualPrice: 65,
      features: [
        'Dedicated Cloud Run container',
        'Custom SSO / SAML & Okta',
        'HIPAA / SOC2 compliance',
        'Unlimited API rate limits',
        'Dedicated CSM manager',
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-6 overflow-y-auto text-slate-100">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'general'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'members'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Members ({activeWs.members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'billing'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>Plans & Stripe Billing</span>
        </button>
      </div>

      {/* Tab Content: General Settings */}
      {activeTab === 'general' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="font-bold text-sm text-white">Workspace Details</h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Workspace Name</label>
              <input
                type="text"
                defaultValue={activeWs.name}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Workspace Slug</label>
              <input
                type="text"
                defaultValue={activeWs.slug}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Description</label>
              <textarea
                rows={3}
                defaultValue={activeWs.description}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Team Members */}
      {activeTab === 'members' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">Workspace Members</h3>
              <p className="text-xs text-slate-400">Manage roles and send team invitations.</p>
            </div>
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>

          <div className="space-y-2">
            {activeWs.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <img src={m.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-white">{m.userName}</div>
                    <div className="text-[11px] text-slate-400">{m.userEmail}</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Plans & Billing */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Annual vs Monthly Toggle */}
          <div className="flex items-center justify-center space-x-3 text-xs font-bold">
            <span className={!isAnnual ? 'text-white' : 'text-slate-400'}>Monthly Billing</span>
            <button
              onClick={() => setIsAnnual((prev) => !prev)}
              className="w-12 h-6 rounded-full bg-indigo-600 p-1 flex items-center transition-colors"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={isAnnual ? 'text-indigo-400' : 'text-slate-400'}>
              Annual Billing <span className="text-amber-400 text-[10px] uppercase font-extrabold">(Save 20%)</span>
            </span>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((p) => {
              const isCurrent = user.plan === p.type;
              const price = isAnnual ? p.annualPrice : p.monthlyPrice;

              return (
                <div
                  key={p.type}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                    isCurrent
                      ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/40 shadow-2xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{p.name}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500 text-white">
                          Active Plan
                        </span>
                      )}
                    </div>

                    <div className="text-3xl font-black text-white">
                      ${price}
                      <span className="text-xs text-slate-400 font-normal"> / mo / user</span>
                    </div>

                    <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                      {p.features.map((f, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setUser((prev) => ({ ...prev, plan: p.type }));
                      setIsUpgradeModalOpen(true);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    {isCurrent ? 'Manage Subscription' : `Upgrade to ${p.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleInviteSubmit}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span>Invite Team Member</span>
              </h3>
              <button type="button" onClick={() => setIsInviteModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Role Permission</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="member">Member (Can edit cards & boards)</option>
                <option value="admin">Admin (Can manage workspace & settings)</option>
                <option value="guest">Guest (Read-only access)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors"
            >
              Send Workspace Invite
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
