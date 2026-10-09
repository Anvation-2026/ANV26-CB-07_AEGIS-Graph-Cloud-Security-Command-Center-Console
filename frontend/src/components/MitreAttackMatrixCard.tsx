import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Crosshair,
  Lock,
  Layers,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { Analysis } from '../types';

interface MitreAttackMatrixCardProps {
  analysis: Analysis;
}

interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  node: string;
  description: string;
  mitigation: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export const MitreAttackMatrixCard: React.FC<MitreAttackMatrixCardProps> = ({ analysis }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<MitreTechnique | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'MITIGATED'>('ALL');

  const isApplied = analysis.applied ?? false;
  const chokeLabel = analysis.choke_point?.label || 'role_overpriv';

  // MITRE ATT&CK for Cloud (Enterprise Matrix v14) mapped to EduCloud / CloudGoat threat vectors
  const techniques: MitreTechnique[] = [
    {
      id: 'T1190',
      name: 'Exploit Public-Facing Application',
      tactic: 'Initial Access',
      node: 'EC2 Web App (Vulnerable)',
      description: 'Adversary leverages remote code execution (RCE) on publicly exposed web server to gain initial foothold inside VPC.',
      mitigation: 'Restricted security group ingress; automated patch management and WAF inspection rules.',
      criticality: 'CRITICAL',
    },
    {
      id: 'T1078.004',
      name: 'Cloud Accounts Compromise',
      tactic: 'Initial Access',
      node: 'IAM User: lara',
      description: 'Adversary discovers leaked or over-scoped API access keys granting access to cloud control plane.',
      mitigation: 'Hardware MFA enforced; short-lived session tokens; immediate access key revocation.',
      criticality: 'HIGH',
    },
    {
      id: 'T1548.005',
      name: 'Temporary Elevated Cloud Credentials',
      tactic: 'Privilege Escalation',
      node: chokeLabel,
      description: 'Adversary abuses wildcard sts:AssumeRole permissions on over-privileged IAM role to bridge into administrator clearance.',
      mitigation: 'Minimum-cut choke point severed: removed wildcard AssumeRole; restricted to specific worker role only.',
      criticality: 'CRITICAL',
    },
    {
      id: 'T1098.001',
      name: 'Additional Cloud Credentials',
      tactic: 'Persistence',
      node: 'IAM Role: role_db_access',
      description: 'Adversary persists privileges by creating cross-service assumption bridges to database maintenance roles.',
      mitigation: 'Strict IAM trust policies with external ID constraints and session condition tags.',
      criticality: 'HIGH',
    },
    {
      id: 'T1552.005',
      name: 'Cloud Instance Metadata Service (IMDS)',
      tactic: 'Credential Access',
      node: 'web_app_ec2 -> IMDS',
      description: 'Adversary queries 169.254.169.254 endpoint via SSRF to siphon temporary IAM instance profile tokens.',
      mitigation: 'Enforce IMDSv2 with hop-limit 1; token response required with PUT header.',
      criticality: 'HIGH',
    },
    {
      id: 'T1530',
      name: 'Data from Cloud Storage & Databases',
      tactic: 'Exfiltration',
      node: 'RDS Secret Database (Crown Jewel)',
      description: 'Adversary queries production database containing sensitive user secrets, student PII, and financial records.',
      mitigation: 'Zero-trust database isolation; TLS 1.3 encrypted connections; air-gapped subnet boundaries.',
      criticality: 'CRITICAL',
    },
  ];

  const filteredTechniques = techniques.filter((t) => {
    if (activeFilter === 'ACTIVE') return !isApplied;
    if (activeFilter === 'MITIGATED') return isApplied;
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0">
            <Crosshair className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                MITRE ATT&CK&reg; Cloud Threat Matrix
              </h2>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                v14.1 CLOUD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Mapped enterprise threat techniques across discovered attack path hops
            </p>
          </div>
        </div>

        {/* Status Pill & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({techniques.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ACTIVE')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeFilter === 'ACTIVE'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Active ({isApplied ? 0 : techniques.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('MITIGATED')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                activeFilter === 'MITIGATED'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Mitigated ({isApplied ? techniques.length : 0})
            </button>
          </div>
        </div>
      </div>

      {/* Techniques Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTechniques.map((tech) => {
          const isChokeTech = tech.node.includes(chokeLabel) || tech.id === 'T1548.005';

          return (
            <div
              key={tech.id}
              onClick={() => setSelectedTechnique(tech)}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative overflow-hidden group ${
                isApplied
                  ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300 hover:bg-emerald-50/70'
                  : isChokeTech
                  ? 'bg-amber-50/40 border-amber-300 hover:border-amber-400 hover:bg-amber-50/70'
                  : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {/* Top Row: MITRE ID & Tactic */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <span>{tech.id}</span>
                  {isChokeTech && (
                    <span className="text-[9px] font-sans font-bold bg-amber-500 text-slate-950 px-1 py-0.2 rounded tracking-wide uppercase">
                      CHOKE POINT
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {tech.tactic}
                </span>
              </div>

              {/* Technique Name */}
              <div className="text-xs font-bold text-slate-800 line-clamp-1 mb-1">
                {tech.name}
              </div>

              {/* Associated Graph Node */}
              <div className="text-[11px] text-slate-500 font-mono truncate mb-2">
                Node: <span className="font-semibold text-slate-700">{tech.node}</span>
              </div>

              {/* Status Badge Bottom */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px]">
                {isApplied ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>MITIGATED VIA MFA</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                    <ShieldAlert className="w-3 h-3 text-rose-500" />
                    <span>EXPOSED THREAT VECTOR</span>
                  </span>
                )}

                <span className="text-slate-400 group-hover:text-slate-700 transition-colors flex items-center">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            {isApplied
              ? 'All 6 mapped MITRE techniques have been mitigated through minimum-cut choke point severance.'
              : 'Discovered attack paths map directly to active Cloud Initial Access, Privilege Escalation, and Data Exfiltration vectors.'}
          </span>
        </div>
        <div className="font-mono font-semibold text-[11px] text-slate-500 shrink-0">
          CHOKE POINT CUT: <span className="text-emerald-700 font-bold">{isApplied ? 'ENFORCED' : 'PENDING APPROVAL'}</span>
        </div>
      </div>

      {/* Technique Modal Dialog Details */}
      {selectedTechnique && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedTechnique.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    {selectedTechnique.tactic}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedTechnique.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTechnique(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Targeted Architecture Node:
                </span>
                <span className="font-mono bg-slate-100 text-slate-800 px-2 py-1 rounded block">
                  {selectedTechnique.node}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Adversary Mechanism:
                </span>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {selectedTechnique.description}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  AEGIS-Graph Defensive Control:
                </span>
                <p className="text-slate-700 leading-relaxed bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 text-emerald-900 font-medium">
                  {selectedTechnique.mitigation}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-500">Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  isApplied ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {isApplied ? 'MITIGATED & SEVERED' : 'EXPOSED THREAT VECTOR'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedTechnique(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
