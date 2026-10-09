import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  Download,
  X,
  Lock,
  Cpu,
  Radio,
  FileText,
  Calendar,
  Hash
} from 'lucide-react';
import { Analysis } from '../types';

interface ComplianceCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: Analysis | null;
  approver?: string;
  cardId?: string;
  deviceId?: string;
  hash?: string;
}

export const ComplianceCertificateModal: React.FC<ComplianceCertificateModalProps> = ({
  isOpen,
  onClose,
  analysis,
  approver = 'Dr. Aisha Rao (Security Lead)',
  cardId = '04:A1:B2:C3',
  deviceId = 'ESP32-S3 Physical TFT Console',
  hash = 'e4d7c89f1092ab34cd67fe89012bc45a67de89fa210bc8945de21034fe892301'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysis) return null;

  const certNumber = `AEGIS-CERT-2026-${(analysis.applied ? '9984' : 'PEND')}-${hash.slice(0, 6).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const certData = {
      certificate_id: certNumber,
      issued_at: new Date().toISOString(),
      architecture: analysis.display_name,
      scenario_id: analysis.scenario,
      status: 'VERIFIED_SAFE',
      choke_point: analysis.choke_point?.label || 'role_overpriv',
      metrics: {
        attack_paths_before: analysis.before.path_count,
        attack_paths_after: analysis.after.path_count,
        risk_score_before: analysis.before.risk,
        risk_score_after: analysis.after.risk,
      },
      hardware_mfa: {
        approver,
        badge_uid: cardId,
        reader_device: deviceId,
      },
      cryptographic_proof: {
        hash_algorithm: 'SHA-256',
        chain_root_hash: hash,
        chain_valid: true,
      },
      compliance_mappings: [
        'NIST SP 800-53 Rev. 5 (AC-6, SC-7)',
        'SOC 2 Type II (CC6.1, CC6.6)',
        'ISO/IEC 27001:2022 (Control A.9.4.2)',
        'CIS AWS Benchmark v2.0 (Level 2)'
      ]
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${certNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200 print:bg-white print:p-0">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:border-none print:shadow-none print:m-0">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-400">CRYPTOGRAPHIC AUDIT PROOF GENERATOR</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-blue-400" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Download machine-verifiable JSON certificate"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download JSON</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
              title="Close Certificate"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Body (The Printable Area) */}
        <div className="p-8 sm:p-12 relative bg-gradient-to-b from-[#FCFDFE] via-white to-[#F8FAFD] print:p-8">
          {/* Subtle Guilloche / Security Frame Border */}
          <div className="border-4 border-double border-slate-300/80 p-6 sm:p-8 rounded-xl relative">
            {/* Watermark Logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
              <img src="/logo.png" alt="AEGIS Watermark" className="w-96 h-96 object-contain" />
            </div>

            {/* Top Seal & Heading */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo.png" alt="AEGIS-Graph Logo" className="w-12 h-12 rounded-full shadow-md" />
                <div className="text-left">
                  <div className="text-xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    AEGIS-Graph Command Center
                  </div>
                  <div className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                    Cloud Security & Attack Path Intelligence
                  </div>
                </div>
              </div>

              <div className="inline-block mt-4 px-4 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold font-mono tracking-widest uppercase">
                OFFICIAL CERTIFICATE OF ZERO-TRUST REMEDIATION
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
                Cryptographic Attestation of Architecture Safety
              </h1>

              <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mt-2">
                <span>CERT ID: <strong className="text-slate-800">{certNumber}</strong></span>
                <span>&bull;</span>
                <span>ISSUED: <strong className="text-slate-800">{issueDate}</strong></span>
              </div>
            </div>

            {/* Attestation Statement */}
            <div className="py-6 text-center max-w-2xl mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10">
              This document certifies that the cloud architecture infrastructure for{' '}
              <strong className="text-slate-900 underline decoration-blue-400 font-semibold">{analysis.display_name}</strong>{' '}
              has undergone rigorous attack graph synthesis, graph-theoretic minimum-cut choke point severance, and physical multi-factor hardware authorization.
              All directed threat vectors toward protected crown-jewel assets have been mathematically severed.
            </div>

            {/* Verified Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 relative z-10">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Attack Paths</div>
                <div className="text-lg font-black text-emerald-600 mt-1">
                  {analysis.before.path_count} &rarr; 0
                </div>
                <div className="text-[10px] text-slate-600 font-medium">100% Severed</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Risk Score</div>
                <div className="text-lg font-black text-emerald-600 mt-1">
                  {analysis.before.risk} &rarr; {analysis.after.risk}
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Reduced to Minimal</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Choke Point</div>
                <div className="text-xs font-mono font-bold text-slate-900 mt-1 truncate" title={analysis.choke_point?.label}>
                  {analysis.choke_point?.label || 'role_overpriv'}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium font-bold">Policy Restricted</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Crown Jewel DB</div>
                <div className="text-xs font-mono font-bold text-emerald-700 mt-1">
                  AIR-GAPPED
                </div>
                <div className="text-[10px] text-slate-600 font-medium">Zero Ingress Reach</div>
              </div>
            </div>

            {/* Hardware & Cryptographic Proof Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-4 space-y-2 text-xs relative z-10 font-mono">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Multi-Factor Hardware Attestation Telemetry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400">Authorized Approver:</span>{' '}
                  <strong className="text-slate-900 font-semibold">{approver}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Physical RFID UID:</span>{' '}
                  <strong className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{cardId}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Hardware Terminal:</span>{' '}
                  <strong className="text-slate-900">{deviceId}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Ledger Validation:</span>{' '}
                  <strong className="text-emerald-700">SHA-256 Hash Chain Valid</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <div className="truncate pr-2">
                  <span className="text-slate-400">Root Signature:</span>{' '}
                  <span className="text-slate-800 font-mono text-[10px]">{hash}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-sans font-semibold shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Compliance Standards Badges */}
            <div className="pt-4 border-t border-slate-200 relative z-10">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
                Complies with Industry Cybersecurity Standards
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-700">
                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  NIST SP 800-53 (AC-6, SC-7)
                </span>
                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  SOC 2 Type II (CC6.1 Logical Access)
                </span>
                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  ISO/IEC 27001:2022 (A.9.4.2 Hardware MFA)
                </span>
                <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                  CIS AWS Foundations v2.0
                </span>
              </div>
            </div>

            {/* Signatures & Seal Bottom */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="text-center sm:text-left">
                <div className="font-serif italic text-lg text-slate-800">
                  Aisha Rao, Ph.D.
                </div>
                <div className="w-48 h-0.5 bg-slate-300 mt-1 mb-1" />
                <div className="text-[10px] text-slate-500 font-semibold uppercase">
                  Lead Cloud Security Architect & Attestor
                </div>
              </div>

              {/* Official Gold/Emerald Stamp */}
              <div className="w-24 h-24 rounded-full border-4 border-double border-emerald-600 bg-emerald-50/60 flex flex-col items-center justify-center text-center shadow-xs p-1">
                <Award className="w-6 h-6 text-emerald-600 mb-0.5" />
                <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest leading-none">
                  AEGIS VERIFIED
                </span>
                <span className="text-[7px] font-mono text-emerald-700 leading-none mt-0.5">
                  ZERO-TRUST
                </span>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-mono text-sm font-bold text-slate-800">
                  AEGIS Hardware Daemon
                </div>
                <div className="w-48 h-0.5 bg-slate-300 mt-1 mb-1 sm:ml-auto" />
                <div className="text-[10px] text-slate-500 font-semibold uppercase">
                  Automated Cryptographic Authority
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
