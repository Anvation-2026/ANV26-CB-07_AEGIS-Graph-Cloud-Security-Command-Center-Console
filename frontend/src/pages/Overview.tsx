import React, { useEffect, useState, useCallback } from 'react';
import { ShieldAlert, CheckCircle2, Zap, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api';
import { EmptyState } from '../components/EmptyState';
import { KpiStrip } from '../components/KpiStrip';
import { AttackGraphCard } from '../components/AttackGraphCard';
import { RiskOverviewCard } from '../components/RiskOverviewCard';
import { RemediationCard } from '../components/RemediationCard';
import { AttackPathsCard } from '../components/AttackPathsCard';
import { SentinelCopilotCard } from '../components/SentinelCopilotCard';

export const Overview: React.FC = () => {
  const { analysis, status, devices, runAnalysis } = useApp();

  // Approval audit metadata for status line
  const [approvalInfo, setApprovalInfo] = useState<{
    approver: string;
    time: string;
    secondsAfterAnalysis?: number;
  } | null>(null);

  // Check if console is online
  const consoleDevice = devices.find((d) => d.device_id === 'esp32-console-01');
  const consoleOnline = consoleDevice?.online ?? false;

  // Fetch audit when analysis is applied to find approver & timestamp
  const fetchApprovalMetadata = useCallback(async () => {
    try {
      const auditRes = await api.getAudit();
      const entries = auditRes.entries;
      const fixEntry = entries.find((e) => e.event === 'fix_applied');
      const analysisEntry = entries.find((e) => e.event === 'analysis_run');

      if (fixEntry) {
        const d = new Date(fixEntry.ts * 1000);
        const timeStr = d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const delta = analysisEntry ? Math.max(1, fixEntry.ts - analysisEntry.ts) : 4;
        setApprovalInfo({
          approver: fixEntry.entry?.approver || 'Security Lead',
          time: timeStr,
          secondsAfterAnalysis: delta,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (analysis?.applied) {
      fetchApprovalMetadata();
    } else {
      setApprovalInfo(null);
    }
  }, [analysis?.applied, fetchApprovalMetadata]);

  if (!analysis) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <EmptyState onAction={() => runAnalysis()} />
      </main>
    );
  }

  const chokeName = analysis.choke_point ? analysis.choke_point.label : 'None';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header (Matching Screenshot 2 Section C) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Security Command Center
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-blue-600">
              Attack Graph Intelligence
            </span>
          </div>

          {/* Title with Status Pill */}
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 flex-wrap">
            <span>{analysis.display_name}</span>
            {analysis.applied ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SYSTEM SAFE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> OPEN ATTACK VECTORS
              </span>
            )}
          </h1>

          {/* Description */}
          <p className="text-xs text-slate-500 mt-1">
            Directed acyclic graph representation showing entry-to-crown-jewel threat vectors and minimum-cut choke point
          </p>
        </div>

        {/* Top-Right: Choke Point Chip & Last Analysis */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500" />
            <span>Choke Point:</span>
            <span className="font-bold underline decoration-slate-400 text-slate-900">
              {chokeName}
            </span>
          </div>

          <div className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Last analysis: just now</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip (Section D) */}
      <KpiStrip analysis={analysis} />

      {/* Main Grid: Attack Topology (Left) & Right Column Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Attack Topology Card (Section E) */}
        <div className="lg:col-span-8">
          <AttackGraphCard analysis={analysis} />
        </div>

        {/* Right: Stacked Cards (Section F) */}
        <div className="lg:col-span-4 space-y-4">
          <RiskOverviewCard analysis={analysis} />
          <RemediationCard
            analysis={analysis}
            status={status}
            consoleOnline={consoleOnline}
            approvalInfo={approvalInfo}
          />
          <AttackPathsCard analysis={analysis} />
        </div>
      </div>

      {/* Bottom: Sentinel AI Copilot Panel (Section G) */}
      <SentinelCopilotCard analysis={analysis} />
    </div>
  );
};
