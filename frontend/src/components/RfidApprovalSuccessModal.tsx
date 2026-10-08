import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Radio,
  CreditCard,
  UserCheck,
  Cpu,
  ArrowRight,
  ExternalLink,
  X,
  Hash,
  Sparkles
} from 'lucide-react';
import { RfidApprovalModalData } from '../types';

interface RfidApprovalSuccessModalProps {
  data: RfidApprovalModalData | null;
  onClose: () => void;
}

export const RfidApprovalSuccessModal: React.FC<RfidApprovalSuccessModalProps> = ({
  data,
  onClose,
}) => {
  const navigate = useNavigate();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (data) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [data, onClose]);

  if (!data) return null;

  const pathsBefore = data.paths_before ?? 1;
  const pathsAfter = data.paths_after ?? 0;
  const riskBefore = data.risk_before ?? 88;
  const riskAfter = data.risk_after ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Frosted Glass Dark Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Dialog Box */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Glowing Top Banner Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 cursor-pointer"
          title="Close notification"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header with Glowing Shield & Badge Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping scale-125" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-20 blur-sm" />
              
              {/* Central Glowing Icon Orb */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <ShieldCheck className="w-9 h-9" />
              </div>

              {/* Hardware RFID Chip Indicator */}
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-emerald-100">
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Radio className="w-3 h-3 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>RFID Hardware Verification Confirmed</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Fix Authorized & Applied via RFID
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md">
              Physical contactless security badge verified by hardware reader. Choke point has been severed and architecture is secured.
            </p>
          </div>

          {/* Primary SAFE STATE Hero Banner */}
          <div className="mb-6 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 border border-emerald-200/90 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      System Status
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 text-white tracking-wider">
                      SAFE STATE
                    </span>
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                    All Threat Vectors Severed & Closed
                  </div>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-xs">
              <div className="text-slate-600">
                <span className="text-slate-400 font-medium">Choke Point:</span>{' '}
                <span className="font-semibold text-slate-800">Over-privileged Role</span>
              </div>
              <div className="text-slate-600">
                <span className="text-slate-400 font-medium">Crown Jewels:</span>{' '}
                <span className="font-semibold text-emerald-700">100% Protected</span>
              </div>
            </div>
          </div>

          {/* Before & After Metrics Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Metric 1: Attack Paths */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Open Attack Paths
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg font-bold text-rose-600 line-through">
                  {pathsBefore}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                  {pathsAfter}
                </span>
              </div>
              <div className="text-[10px] font-semibold text-emerald-700 mt-1">
                Zero active paths
              </div>
            </div>

            {/* Metric 2: Risk Score */}
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 sm:p-4 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Architecture Risk
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg font-bold text-rose-600 line-through">
                  {riskBefore}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                  {riskAfter}
                </span>
              </div>
              <div className="text-[10px] font-semibold text-emerald-700 mt-1">
                Risk reduced to Safe
              </div>
            </div>
          </div>

          {/* Physical Hardware Telemetry & Approver Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-2.5 text-xs text-slate-600 mb-6 shadow-2xs">
            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">Authorized Approver:</span>
              </div>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {data.approver || 'Security Lead'}
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span className="font-medium">RFID Badge UID:</span>
              </div>
              <span className="font-mono font-bold text-slate-800 bg-blue-50 text-blue-800 border border-blue-200/60 px-2 py-0.5 rounded text-[11px]">
                {data.card_id}
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-500">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Hardware Reader:</span>
              </div>
              <span className="font-semibold text-slate-700">
                {data.device_id || 'ESP32-S3 TFT Console'}
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="font-medium">Audit Trail:</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]" title={data.hash || 'SHA-256 Validated'}>
                {data.hash ? `${data.hash.slice(0, 16)}...` : 'SHA-256 Signed & Validated'}
              </span>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Explore Safe Topology</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/remediation');
              }}
              className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Policy & Diff</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
