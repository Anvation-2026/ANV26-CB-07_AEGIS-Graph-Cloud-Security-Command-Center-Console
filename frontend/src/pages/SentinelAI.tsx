import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Bot,
  User,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Trash2,
  Info,
  Layers,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import { AskResponse } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  cited?: string[];
  model?: string;
  grounded?: boolean;
}

export const SentinelAI: React.FC = () => {
  const { analysis, status, selectedScenario } = useApp();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const chokeName = analysis?.choke_point?.label || 'Over-privileged Role';
  const chokeId = analysis?.choke_point?.id || 'role_overpriv';
  const pathCount = analysis?.before?.path_count ?? (analysis?.paths?.length ?? 0);
  const isSafe = analysis?.applied || status?.state === 'safe';
  const jewelNode = analysis?.nodes?.find((n) => n.crown_jewel);
  const jewelName = jewelNode?.label || 'Parent-Portal DB';

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'ai',
          text: `Hello! I am Sentinel AI, your live defensive security copilot grounded in real mathematical graph proofs and IAM policies for **${analysis?.display_name || selectedScenario}**.\n\nYou can ask me anything about your cloud architecture, for example:\n• "Is now my system safe?"\n• "Give me 2 to 3 different kind of remediations"\n• "Explain the attack paths and kill-chain"\n• "Why is ${chokeName} a choke point?"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cited: chokeId ? [chokeId] : [],
          model: 'gemini-2.5-flash',
          grounded: true,
        },
      ]);
    }
  }, [analysis?.display_name, chokeName, chokeId, selectedScenario]);

  const handleAsk = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res: AskResponse = await api.askSentinel(promptText);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cited: res.cited || [],
        model: res.model || 'gemini-2.5-flash',
        grounded: res.grounded,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Failed to contact the Sentinel AI reasoning engine. Please ensure the backend server is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `cleared-${Date.now()}`,
        sender: 'ai',
        text: 'Conversation history reset. Ask me anything about the attack graph or remediation options!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'gemini-2.5-flash',
      },
    ]);
  };

  const quickPrompts = [
    'Is now my system safe?',
    'Give me 2 to 3 different kind of remediations',
    'Explain the attack paths and kill-chain',
    `Why is ${chokeName} a choke point?`,
    'Show blast radius reduction',
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5 font-sans">
      {/* Sleek, Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              AEGIS Security Command
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Sentinel AI Copilot
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Sentinel AI Defense Copilot</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live conversational defense intelligence powered by Google Gemini 2.5 & graph proofs
          </p>
        </div>

        {/* Right Status Pills */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gemini 2.5 Flash Live</span>
          </span>

          {isSafe ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>SYSTEM SAFE</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full border border-rose-200 shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>{pathCount} ATTACK PATHS EXPOSED</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            title="Clear chat history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Chat Section (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-col h-[700px] overflow-hidden">
          {/* Chat Stream Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-xs rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  {/* Metadata Footer for AI */}
                  {msg.sender === 'ai' && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {msg.cited && msg.cited.length > 0 && (
                          <>
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Cited:
                            </span>
                            {msg.cited.map((token) => (
                              <span
                                key={token}
                                className="text-[10px] font-mono bg-white border border-slate-200 text-blue-700 px-1.5 py-0.5 rounded font-semibold shadow-2xs"
                              >
                                {token}
                              </span>
                            ))}
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        {msg.model && (
                          <span className="font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                            {msg.model}
                          </span>
                        )}
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <div className="mt-1 text-right text-[10px] text-blue-100">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 rounded-tl-none flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span className="font-medium">
                    Sentinel AI is querying graph tools and reasoning...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Prompt Chips Bar */}
          <div className="px-5 pt-3 pb-2 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Prompts:
              </span>
              {quickPrompts.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleAsk(chip)}
                  disabled={loading}
                  className="shrink-0 text-xs font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-slate-200">
            <div className="relative flex items-center">
              <input
                id="ai-prompt-input"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask Sentinel AI about remediations, attack kill-chain, or system safety..."
                disabled={loading}
                className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl pl-4 pr-24 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
              />
              <button
                id="ai-submit-btn"
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute right-1.5 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{loading ? 'Thinking...' : 'Send'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Insights Sidebar (4 cols) - Clean, Informative, Not Overcomplicated */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target & Threat Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Live Graph Context</span>
              </h3>
              <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {selectedScenario}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Target Stack:</span>
                <span className="font-bold text-slate-800 text-right truncate max-w-[180px]">
                  {analysis?.display_name || selectedScenario}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Crown Jewel:</span>
                <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {jewelName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Choke Point:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 truncate max-w-[180px]">
                  {chokeName}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Risk Score:</span>
                <span className="font-black text-rose-600">
                  {isSafe ? '4 / 100 (Safe)' : `${analysis?.before?.risk ?? 88} / 100 (Critical)`}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Blast Reduction:</span>
                <span className="font-black text-emerald-600">
                  {analysis?.blast_reduction_pct ?? 82}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAsk('Is now my system safe?')}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verify System Safety Status</span>
            </button>
          </div>

          {/* Defense Strategies Card with 1-Click Trigger */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Defense-in-Depth Strategies</span>
              </h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                3 TIERS
              </span>
            </div>

            <div className="space-y-2.5">
              <div
                onClick={() => handleAsk('Explain Tier 1 IAM choke point remediation')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                    Tier 1: Choke Point Cut
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    OPTIMAL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Scope down IAM wildcard permissions on {chokeName} to sever all attack paths.
                </p>
              </div>

              <div
                onClick={() => handleAsk('Explain Tier 2 network perimeter hardening')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                    Tier 2: Perimeter Hardening
                  </span>
                  <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    FRONTLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Tighten Security Group ingress rules & deploy AWS WAF payload inspection.
                </p>
              </div>

              <div
                onClick={() => handleAsk('Explain Tier 3 zero-trust hardware MFA enforcement')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                    Tier 3: Zero-Trust Hardware MFA
                  </span>
                  <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                    IDENTITY
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Require physical contactless RFID badge approval & 15-minute token expiry.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAsk('Give me 2 to 3 different kind of remediations')}
              className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs py-2 px-3 rounded-xl border border-blue-200 transition-colors cursor-pointer"
            >
              <span>Compare All 3 Remediations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
