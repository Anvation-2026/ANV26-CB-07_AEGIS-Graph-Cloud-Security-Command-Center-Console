import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Terminal,
  Activity,
  Lock,
  Award
} from 'lucide-react';
import { RfidApprovalModalData } from '../types';
import { useApp } from '../context/AppContext';
import { ComplianceCertificateModal } from './ComplianceCertificateModal';

interface RfidApprovalSuccessModalProps {
  data: RfidApprovalModalData | null;
  onClose: () => void;
}

export const RfidApprovalSuccessModal: React.FC<RfidApprovalSuccessModalProps> = ({
  data,
  onClose,
}) => {
  const navigate = useNavigate();
  const { analysis } = useApp();
  const [showCert, setShowCert] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Deep Obsidian Frosted Glass Backdrop with Cyber Ambient Glow */}
      <div
        className="fixed inset-0 bg-[#040812]/85 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Main Cybersecurity Dark SOC Dialog Box */}
      <div className="relative w-full max-w-3xl bg-[#090E1A] border-2 border-emerald-500/50 rounded-2xl shadow-[0_0_90px_rgba(16,185,129,0.35)] overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-slate-100 font-sans">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Top Glowing Laser Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-300 to-emerald-500 shadow-[0_0_20px_#10b981]" />

        {/* Cyber Header Telemetry & Close Button */}
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 relative z-20">
          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AEGIS // SOC COMMAND // DEFCON: ALL CLEAR</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-slate-400 hover:text-emerald-400 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs"
            title="Close briefing"
          >
            <span className="text-[10px] text-slate-500">[ESC]</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 sm:p-8 pt-3 relative z-10">
          {/* Centerpiece Hero Icon & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              {/* Outer pulsing cyber rings */}
              <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-ping scale-110" />
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-25 blur-md" />

              {/* Central Glowing Shield Hologram Box */}
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-[#0B1528] to-teal-950/60 border border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                <ShieldCheck className="w-11 h-11" />
              </div>

              {/* Hardware RFID Contactless Chip Badge */}
              <div className="absolute -bottom-1.5 -right-1.5 bg-[#090E1A] p-1 rounded-lg shadow-md border border-emerald-500/70">
                <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-slate-950">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Verification Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>PHYSICAL RFID HARDWARE AUTHORIZATION VERIFIED</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-wider uppercase font-mono mt-0.5">
              SYSTEM IS SAFE
            </h2>
            <p className="text-xs sm:text-sm text-emerald-300/80 font-mono mt-1 max-w-lg">
              [ CHOKE POINT SEVERED // 0 ACTIVE THREAT VECTORS // ASSETS SECURED ]
            </p>
          </div>

          {/* Primary SAFE STATE Cyber HUD Banner */}
          <div className="mb-6 rounded-xl bg-[#0B1424]/90 border border-emerald-500/40 p-4 sm:p-5 relative overflow-hidden shadow-inner">
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                      DEFENSE STATUS
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-emerald-500 text-slate-950 tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.5)]">
                      STATUS: SAFE
                    </span>
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-white font-mono mt-0.5">
                    All Attack Vectors Terminated at Choke Point
                  </div>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <div className="mt-3.5 pt-3 border-t border-emerald-500/25 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-400 font-semibold block text-[10px] uppercase">Choke Point Node:</span>
                <span className="font-bold text-white truncate block">Over-privileged Role</span>
              </div>
              <div className="text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-400 font-semibold block text-[10px] uppercase">Crown Jewel Assets:</span>
                <span className="font-bold text-emerald-400 block">100% Isolated & Safe</span>
              </div>
              <div className="text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-400 font-semibold block text-[10px] uppercase">Zero-Trust Rules:</span>
                <span className="font-bold text-white block">Applied to IAM Policy</span>
              </div>
            </div>
          </div>

          {/* Before & After Cyber HUD Metrics Cards */}
          <div className="grid grid-cols-2 gap-3.5 mb-6">
            {/* Metric 1: Attack Paths */}
            <div className="bg-[#070B14] border border-emerald-500/30 rounded-xl p-3.5 sm:p-4 text-center relative overflow-hidden">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Attack Paths</span>
              </div>
              <div className="flex items-center justify-center gap-3 my-1">
                <span className="text-lg sm:text-xl font-mono font-bold text-rose-500/80 line-through">
                  {pathsBefore}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-500/70" />
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]">
                  {pathsAfter}
                </span>
              </div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 py-0.5 px-2 rounded-full inline-block mt-1">
                ALL PATHS SEVERED
              </div>
            </div>

            {/* Metric 2: Risk Score */}
            <div className="bg-[#070B14] border border-emerald-500/30 rounded-xl p-3.5 sm:p-4 text-center relative overflow-hidden">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Architecture Risk</span>
              </div>
              <div className="flex items-center justify-center gap-3 my-1">
                <span className="text-lg sm:text-xl font-mono font-bold text-rose-500/80 line-through">
                  {riskBefore}
                </span>
                <ArrowRight className="w-4 h-4 text-emerald-500/70" />
                <span className="text-2xl sm:text-3xl font-mono font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.7)]">
                  {riskAfter}
                </span>
              </div>
              <div className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 py-0.5 px-2 rounded-full inline-block mt-1">
                RISK CLEARED TO SAFE
              </div>
            </div>
          </div>

          {/* Dark Terminal Console: Hardware RFID & Audit Telemetry */}
          <div className="bg-[#050913] border border-slate-800 rounded-xl p-3.5 sm:p-4 font-mono text-xs text-slate-300 mb-6 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-emerald-400 font-bold">
                  aegis-rfid-daemon // hardware-mfa.telemetry
                </span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:inline">TERMINAL LINK: ACTIVE</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[APPROVER-ID]:</span>
                </div>
                <span className="font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {data.approver || 'Dr. Aisha Rao (Security Lead)'}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>[RFID-UID]:</span>
                </div>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px]">
                  {data.card_id}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>[HW-CONSOLE]:</span>
                </div>
                <span className="font-semibold text-slate-300">
                  {data.device_id || 'ESP32-S3 Physical TFT Console'}
                </span>
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span>[AUDIT-CHAIN]:</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[240px]" title={data.hash || 'SHA-256 Validated'}>
                  {data.hash ? `${data.hash.slice(0, 20)}...` : 'SHA-256 Validated & Immutable'}
                </span>
              </div>
            </div>
          </div>

          {/* Cyber Action Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-extrabold text-xs py-3 px-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Explore Topology</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/remediation');
              }}
              className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/70 font-mono font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>View Policy & Diff</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowCert(true)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/40 hover:border-amber-500/70 font-mono font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              title="Generate printable Cryptographic Audit Certificate"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Audit Proof</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Cryptographic Certificate Modal */}
      <ComplianceCertificateModal
        isOpen={showCert}
        onClose={() => setShowCert(false)}
        analysis={analysis}
        approver={data.approver}
        cardId={data.card_id}
        deviceId={data.device_id}
        hash={data.hash}
      />
    </div>
  );
};
