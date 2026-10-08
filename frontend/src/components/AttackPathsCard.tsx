import React, { useState } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { Analysis, AnalysisPath } from '../types';
import { SeverityBadge } from './SeverityBadge';

interface AttackPathsCardProps {
  analysis: Analysis;
}

export const AttackPathsCard: React.FC<AttackPathsCardProps> = ({ analysis }) => {
  const activePaths = analysis.paths || [];
  const isApplied = analysis.applied;
  const [showAll, setShowAll] = useState(false);

  // If showAll is false, show first 4 paths; if true, show all
  const displayedPaths = showAll ? activePaths : activePaths.slice(0, 4);

  // Distinct, high-contrast colors matching the graph topology paths:
  // Path 1 (Red), Path 2 (Blue), Path 3 (Amber/Orange), Path 4 (Violet), Path 5 (Cyan)
  const PATH_BADGE_STYLES: Record<number, { bg: string; text: string }> = {
    1: { bg: '#EF4444', text: '#FFFFFF' }, // Path 1: Red
    2: { bg: '#2563EB', text: '#FFFFFF' }, // Path 2: Blue
    3: { bg: '#F59E0B', text: '#FFFFFF' }, // Path 3: Amber / Orange
    4: { bg: '#7C3AED', text: '#FFFFFF' }, // Path 4: Violet
    5: { bg: '#0891B2', text: '#FFFFFF' }, // Path 5: Cyan
  };

  const getBadgeStyle = (pathId: number, idx: number) => {
    return (
      PATH_BADGE_STYLES[pathId] ||
      PATH_BADGE_STYLES[(idx % 5) + 1] || { bg: '#64748B', text: '#FFFFFF' }
    );
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Discovered Attack Paths ({activePaths.length})
          </h3>
          {isApplied && (
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Severed
            </span>
          )}
        </div>

        {activePaths.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors cursor-pointer"
          >
            <span>{showAll ? 'Collapse' : 'View All Paths'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Path List */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {displayedPaths.length === 0 ? (
          <div className="text-xs text-slate-400 py-4 text-center">
            No attack paths discovered.
          </div>
        ) : (
          displayedPaths.map((p: AnalysisPath, idx: number) => {
            const badgeStyle = getBadgeStyle(p.id, idx);

            return (
              <div
                key={p.id}
                className={`p-3 rounded-lg border text-xs transition-all ${
                  isApplied
                    ? 'border-slate-200 bg-slate-50/60 opacity-60'
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }}
                    >
                      {p.id}
                    </span>
                    <span className="font-bold text-slate-900">Path #{p.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">
                      diff {p.difficulty} · {p.hops} hops
                    </span>
                    <SeverityBadge severity={p.severity} />
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>

                {/* Monospace Path Breadcrumbs */}
                <div className="font-mono text-[11px] text-slate-600 break-words flex items-center flex-wrap gap-1 leading-snug pl-7">
                  {p.nodes.map((nodeId: string, nIdx: number) => {
                    const isChoke = nodeId === analysis.choke_point?.id;
                    const nodeObj = analysis.nodes.find((n) => n.id === nodeId);
                    const isCrown = nodeObj?.crown_jewel;

                    return (
                      <React.Fragment key={nIdx}>
                        <span
                          className={
                            isChoke
                              ? 'text-amber-800 font-bold bg-amber-50 px-1 py-0.5 rounded border border-amber-200/60'
                              : isCrown
                              ? 'text-rose-700 font-bold bg-rose-50 px-1 py-0.5 rounded border border-rose-200/60'
                              : 'text-slate-700'
                          }
                        >
                          {nodeId}
                        </span>
                        {nIdx < p.nodes.length - 1 && (
                          <span className="text-slate-400 select-none">{'->'}</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
