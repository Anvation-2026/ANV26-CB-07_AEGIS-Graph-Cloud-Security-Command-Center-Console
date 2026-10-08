import React from 'react';
import { Share2 } from 'lucide-react';
import { Analysis } from '../types';

interface RiskOverviewCardProps {
  analysis: Analysis;
}

export const RiskOverviewCard: React.FC<RiskOverviewCardProps> = ({ analysis }) => {
  const isApplied = analysis.applied;
  const riskScore = isApplied ? analysis.after.risk : analysis.before.risk;
  const blastCount = isApplied ? analysis.after.blast_count : analysis.before.blast_count;
  const blastWeighted = isApplied ? analysis.after.blast_weighted : analysis.before.blast_weighted;

  const severity =
    isApplied || riskScore === 0
      ? 'SAFE'
      : riskScore >= 85
      ? 'CRITICAL'
      : riskScore >= 70
      ? 'HIGH'
      : riskScore >= 40
      ? 'MEDIUM'
      : 'LOW';

  const severityBadgeClass = {
    SAFE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  }[severity];

  const progressBarColor = {
    SAFE: 'bg-emerald-500',
    CRITICAL: 'bg-rose-500',
    HIGH: 'bg-amber-500',
    MEDIUM: 'bg-blue-500',
    LOW: 'bg-slate-400',
  }[severity];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Risk Overview
        </h3>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${severityBadgeClass}`}
        >
          {severity}
        </span>
      </div>

      {/* Side-by-Side Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: Risk Metric */}
        <div className="pr-3 border-r border-slate-100 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Risk Metric
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {riskScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                style={{ width: `${Math.min(100, Math.max(0, riskScore))}%` }}
              />
            </div>
          </div>

          <div
            className={`text-[11px] font-medium mt-3 ${
              isApplied
                ? 'text-emerald-600'
                : riskScore >= 70
                ? 'text-rose-600'
                : 'text-amber-600'
            }`}
          >
            {isApplied
              ? 'Zero active threat paths'
              : riskScore >= 85
              ? 'Critical risk detected'
              : riskScore >= 70
              ? 'High risk detected'
              : 'Moderate risk'}
          </div>
        </div>

        {/* Right: Blast Radius */}
        <div className="pl-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Blast Radius
              </div>
              <Share2 className="w-3.5 h-3.5 text-blue-500 opacity-80" />
            </div>

            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-blue-600 tracking-tight">
                {blastCount}
              </span>
              <span className="text-xs font-semibold text-slate-700">nodes</span>
            </div>

            <div className="text-[11px] text-slate-400 mt-1">
              {blastWeighted} weighted
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium mt-3">
            Potentially affected
          </div>
        </div>
      </div>
    </div>
  );
};
