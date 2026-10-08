import React, { useState } from 'react';
import { Wrench, Copy, Check, WifiOff, CheckCircle2 } from 'lucide-react';
import { Analysis } from '../types';
import { useApp } from '../context/AppContext';

interface RemediationCardProps {
  analysis: Analysis;
  status: any;
  consoleOnline: boolean;
  approvalInfo: { approver: string; time: string } | null;
}

export const RemediationCard: React.FC<RemediationCardProps> = ({
  analysis,
  status,
  consoleOnline,
  approvalInfo,
}) => {
  const { showRfidApprovalModal } = useApp();
  const [copied, setCopied] = useState(false);
  const pfix = analysis.recommended_fixes?.[0];
  const totalPaths = analysis.before.path_count || (analysis.paths ? analysis.paths.length : 1);

  const severedEdgesText = pfix
    ? pfix.removes_edges.map(([u, v]: [string, string]) => `${u} -> ${v}`).join(', ')
    : 'None';

  const handleCopy = () => {
    navigator.clipboard.writeText(severedEdgesText).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-start gap-2.5 mb-3 pb-2.5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
          <Wrench className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Recommended Remediation
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Breaks all {totalPaths} attack path(s) at choke point
          </p>
        </div>
      </div>

      {/* Fix Details */}
      {pfix ? (
        <div className="space-y-2">
          <div className="font-bold text-xs text-slate-900">
            {pfix.title}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {pfix.detail}
          </p>

          {/* Code-style Severed box with copy button */}
          <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200/90 rounded-lg flex items-center justify-between gap-2 font-mono text-[11px]">
            <div className="truncate">
              <span className="text-slate-400 select-none mr-1.5">Severed:</span>
              <span className="text-slate-800 font-semibold">{severedEdgesText}</span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200/70 transition-colors shrink-0 cursor-pointer"
              title="Copy severed connection"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 py-2">
          No automated remediation required.
        </div>
      )}

      {/* Inline Hardware Status Banner */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-100">
        {analysis.applied ? (
          <div className="flex items-center justify-between gap-2 text-emerald-700 text-xs font-medium bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Approved by {approvalInfo?.approver || 'Security Lead'}
                {approvalInfo?.time ? ` at ${approvalInfo.time}` : ''}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                showRfidApprovalModal({
                  approver: approvalInfo?.approver || 'Security Lead',
                  card_id: '04:A1:B2:C3',
                  fix_id: pfix?.fix_id || 'choke-point-severed',
                  device_id: 'ESP32-S3 Hardware Console',
                  paths_before: totalPaths,
                  paths_after: analysis.after.path_count,
                  risk_before: analysis.before.risk,
                  risk_after: analysis.after.risk,
                  timestamp: Date.now(),
                });
              }}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-white hover:bg-emerald-100/60 border border-emerald-200 px-2 py-0.5 rounded shadow-2xs transition-colors cursor-pointer shrink-0"
              title="View attractive RFID Hardware Authorization Proof"
            >
              RFID Proof &rarr;
            </button>
          </div>
        ) : status?.pending_fix ? (
          consoleOnline ? (
            <div className="flex items-center gap-2 text-amber-700 text-xs font-medium bg-amber-50/80 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>Waiting for badge tap on physical console</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-700 text-xs font-medium bg-rose-50/80 border border-rose-200/80 px-2.5 py-1.5 rounded-lg">
              <WifiOff className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Console offline - verify ESP32 Wi-Fi connection</span>
            </div>
          )
        ) : !consoleOnline ? (
          <div className="flex items-center gap-2 text-rose-700 text-xs font-medium bg-rose-50/80 border border-rose-200/80 px-2.5 py-1.5 rounded-lg">
            <WifiOff className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>Console offline - verify ESP32 Wi-Fi connection</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Console connected · Ready for approval commands</span>
          </div>
        )}
      </div>
    </div>
  );
};
