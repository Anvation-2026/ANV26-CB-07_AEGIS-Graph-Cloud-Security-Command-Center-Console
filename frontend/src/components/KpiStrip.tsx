import React from 'react';
import { Globe, ShieldCheck, Database, Network } from 'lucide-react';
import { Analysis } from '../types';

interface KpiStripProps {
  analysis: Analysis;
}

export const KpiStrip: React.FC<KpiStripProps> = ({ analysis }) => {
  const isApplied = analysis.applied;
  const activePaths = isApplied ? [] : (analysis.paths || []);
  const openPathsCount = activePaths.length;

  // 1. Entry Point resolution
  const entryNode = analysis.nodes.find((n) => n.entry) || analysis.nodes[0];
  const entryTitle = entryNode?.label || entryNode?.id || 'Internet';
  const entrySubtitle = `${openPathsCount} attack path${openPathsCount === 1 ? '' : 's'}`;

  // 2. Choke Point resolution
  const chokeNode =
    analysis.nodes.find((n) => n.choke) ||
    (analysis.choke_point ? analysis.nodes.find((n) => n.id === analysis.choke_point?.id) : null);
  const chokeTitle =
    analysis.choke_point?.label ||
    chokeNode?.label ||
    (isApplied ? 'Severed Choke Point' : 'None');
  const chokeSubtitle =
    chokeNode?.name_ref ||
    chokeNode?.id ||
    (isApplied ? 'Zero active vectors' : 'role_overpriv');

  // 3. Crown Jewel resolution
  const crownJewelNode = analysis.nodes.find((n) => n.crown_jewel);
  const formatCrownJewelTitle = (n?: typeof crownJewelNode) => {
    if (!n) return 'Protected Asset';
    if (n.id && n.id.startsWith('db_')) {
      return `DB: ${n.id.replace(/^db_/, '')}`;
    }
    return n.label || n.id;
  };
  const crownTitle = formatCrownJewelTitle(crownJewelNode);
  const crownSubtitle = crownJewelNode?.sensitivity
    ? crownJewelNode.sensitivity === 'children_pii'
      ? "Children's data"
      : crownJewelNode.sensitivity.replace(/[_-]/g, ' ')
    : crownJewelNode?.name_ref || 'Crown jewel asset';

  // 4. Open Paths resolution
  const pathsCount = openPathsCount;
  const pathsSubtitle = 'To crown jewel';

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-slate-100">
      {/* 1. Entry Point Card */}
      <div className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Globe className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-slate-500">
            Entry Point
          </div>
          <div className="text-sm font-bold text-blue-700 truncate" title={entryTitle}>
            {entryTitle}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={entrySubtitle}>
            {entrySubtitle}
          </div>
        </div>
      </div>

      {/* 2. Choke Point Card */}
      <div className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-slate-500">
            Choke Point
          </div>
          <div className="text-sm font-bold text-blue-700 truncate" title={chokeTitle}>
            {chokeTitle}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={chokeSubtitle}>
            {chokeSubtitle}
          </div>
        </div>
      </div>

      {/* 3. Crown Jewel Card */}
      <div className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-slate-500">
            Crown Jewel
          </div>
          <div className="text-sm font-bold text-blue-700 truncate" title={crownTitle}>
            {crownTitle}
          </div>
          <div className="text-[11px] text-slate-500 truncate" title={crownSubtitle}>
            {crownSubtitle}
          </div>
        </div>
      </div>

      {/* 4. Open Paths Card */}
      <div className="p-3.5 sm:p-4 flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
          <Network className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-slate-500">
            Open Paths
          </div>
          <div className="text-sm sm:text-base font-bold text-blue-700">
            {pathsCount}
          </div>
          <div className="text-[11px] text-slate-500">
            {pathsSubtitle}
          </div>
        </div>
      </div>
    </div>
  );
};
