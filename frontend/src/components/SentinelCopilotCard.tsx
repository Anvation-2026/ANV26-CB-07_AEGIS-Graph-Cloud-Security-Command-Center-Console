import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle2,
  Info,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Analysis, AskResponse } from '../types';
import { api } from '../api';

interface SentinelCopilotCardProps {
  analysis: Analysis;
}

export const SentinelCopilotCard: React.FC<SentinelCopilotCardProps> = ({ analysis }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const chokeName = analysis.choke_point?.label || 'choke point';

  const handleAsk = async (promptText: string) => {
    if (!promptText.trim()) return;
    setQuestion(promptText);
    setLoading(true);

    try {
      const res = await api.askSentinel(promptText);
      setAnswer(res);
    } catch {
      setAnswer({
        answer: 'Failed to contact Sentinel AI reasoning engine.',
        grounded: false,
        cited: [],
        mode: 'template',
        model: 'gemini-2.5-flash-lite',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Sentinel AI Security Copilot
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Grounded in mathematical graph proofs and IAM policies (Gemini 2.5 Flash Lite)
            </p>
          </div>
        </div>

        {/* Right Badges & Link to Full AI Dashboard */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/ai"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open AI Analytics Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Grounded in graph</span>
            <Info className="w-3 h-3 text-emerald-600 opacity-70" />
          </span>

          <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
            Read-only · Cannot apply fixes
          </span>
        </div>
      </div>

      {/* Answer Output if Available */}
      {answer && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 mb-3.5 text-xs text-slate-800 leading-relaxed shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium whitespace-pre-line">{answer.answer}</p>
            <span className="text-[10px] font-mono uppercase bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded shrink-0">
              {answer.model}
            </span>
          </div>

          {answer.cited?.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-semibold">Cited Resources:</span>
              {answer.cited.map((token) => (
                <span
                  key={token}
                  className="text-[10px] font-mono bg-white border border-slate-200 px-2 py-0.5 rounded text-blue-700 font-semibold shadow-2xs"
                >
                  {token}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suggestion Prompt Section */}
      <div className="space-y-2">
        <div className="text-xs text-slate-600 font-medium">
          Ask questions about attack paths, choke points, or remediations:
        </div>

        {/* Dynamic Chips based on real choke point */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleAsk('Is now my system safe?')}
            className="text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            Is now my system safe?
          </button>
          <button
            type="button"
            onClick={() => handleAsk('Give me 2 to 3 different kind of remediations')}
            className="text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
          >
            Give me 2 to 3 different remediations
          </button>
          <button
            type="button"
            onClick={() => handleAsk('Explain the attack paths and kill-chain')}
            className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Explain the attack paths
          </button>
          <button
            type="button"
            onClick={() => handleAsk(`Why is ${chokeName} a choke point?`)}
            className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Why is {chokeName} a choke point?
          </button>
          <button
            type="button"
            onClick={() => handleAsk('Show blast radius impact')}
            className="text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            Show blast radius impact
          </button>
        </div>

        {/* Integrated AI Query Bar with Unmissable Send Button */}
        <form onSubmit={handleSubmit} className="pt-1.5">
          <div className="relative flex items-center bg-white border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-xl shadow-2xs transition-all">
            <input
              id="sentinel-question-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Sentinel AI about graph topology, attack paths, or remediations..."
              className="w-full bg-transparent pl-4 pr-28 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
            />
            <button
              id="sentinel-send-btn"
              type="submit"
              disabled={loading || !question.trim()}
              style={{ backgroundColor: loading ? '#60A5FA' : '#2563EB', color: '#FFFFFF' }}
              className="absolute right-1.5 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send question to Sentinel AI"
            >
              {loading ? (
                <RefreshCw className="w-3.5 h-3.5 text-white animate-spin shrink-0" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white shrink-0" />
              )}
              <span className="font-semibold text-xs text-white">
                {loading ? 'Thinking...' : 'Send'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
