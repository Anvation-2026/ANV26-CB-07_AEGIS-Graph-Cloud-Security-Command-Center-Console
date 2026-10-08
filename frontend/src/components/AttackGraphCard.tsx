import React, { useEffect, useRef, useState, useCallback } from 'react';
import cytoscape, { Core } from 'cytoscape';
import dagre from 'cytoscape-dagre';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronDown,
} from 'lucide-react';
import { Analysis, AnalysisNode, AnalysisEdge, AnalysisPath } from '../types';

// Register dagre layout plugin
cytoscape.use(dagre);

interface AttackGraphCardProps {
  analysis: Analysis;
}

// Generate SVG data URIs for crisp node icons
function getSvgIcon(type: string, color: string): string {
  let svgPath = '';
  if (type === 'internet') {
    svgPath = `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`;
  } else if (type === 'compute_code') {
    svgPath = `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>`;
  } else if (type === 'compute') {
    svgPath = `<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><circle cx="6" cy="7" r="1"/><circle cx="10" cy="7" r="1"/>`;
  } else if (type === 'credential') {
    svgPath = `<path d="m21 2-2 2m-1.5 1.5L16 7l-1.5-1.5M19 5l-2.5 2.5M9.5 14.5a5.5 5.5 0 1 0-7-7 5.5 5.5 0 0 0 7 7Zm0 0L14 19l2-2-1.5-1.5L17 13"/>`;
  } else if (type === 'role') {
    svgPath = `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`;
  } else if (type === 'database') {
    svgPath = `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>`;
  } else {
    svgPath = `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svgPath}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface Packet {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
  color: string;
  pathId: number;
  isChoke: boolean;
}

export const AttackGraphCard: React.FC<AttackGraphCardProps> = ({ analysis }) => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<Core | null>(null);
  const packetCanvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // States
  const [packetsEnabled, setPacketsEnabled] = useState(true);
  const [layoutName, setLayoutName] = useState<'dagre' | 'breadthfirst' | 'concentric'>('dagre');
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Edge hover tooltip
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: any;
  }>({ visible: false, x: 0, y: 0, content: null });

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!cardContainerRef.current) return;
    if (!document.fullscreenElement) {
      cardContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => {
        if (cyInstance.current) {
          cyInstance.current.resize();
          cyInstance.current.fit(undefined, 40);
        }
      }, 100);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Zoom controls
  const handleZoomIn = () => {
    if (!cyInstance.current) return;
    cyInstance.current.zoom({
      level: cyInstance.current.zoom() * 1.25,
      renderedPosition: {
        x: cyRef.current ? cyRef.current.clientWidth / 2 : 300,
        y: cyRef.current ? cyRef.current.clientHeight / 2 : 250,
      },
    });
  };

  const handleZoomOut = () => {
    if (!cyInstance.current) return;
    cyInstance.current.zoom({
      level: cyInstance.current.zoom() * 0.8,
      renderedPosition: {
        x: cyRef.current ? cyRef.current.clientWidth / 2 : 300,
        y: cyRef.current ? cyRef.current.clientHeight / 2 : 250,
      },
    });
  };

  const handleFit = () => {
    if (!cyInstance.current) return;
    cyInstance.current.fit(undefined, 40);
  };

  // Build Graph
  useEffect(() => {
    if (!cyRef.current || !analysis) return;

    const elements: cytoscape.ElementDefinition[] = [];

    // Map nodes to active path IDs
    const nodePathsMap: Record<string, number[]> = {};
    (analysis.paths || []).forEach((path: AnalysisPath) => {
      path.nodes.forEach((nId: string) => {
        if (!nodePathsMap[nId]) nodePathsMap[nId] = [];
        if (!nodePathsMap[nId].includes(path.id)) {
          nodePathsMap[nId].push(path.id);
        }
      });
    });

    // Add Nodes
    analysis.nodes.forEach((node: AnalysisNode) => {
      const paths = nodePathsMap[node.id] || [];

      let shape: cytoscape.Css.NodeShape = 'round-rectangle';
      let bgColor = '#FFFFFF';
      let borderColor = '#CBD5E1';
      let borderWidth = 2;
      let borderStyle: cytoscape.Css.LineStyle = 'solid';
      let textColor = '#0F172A';
      let iconType = 'generic';
      let iconColor = '#64748B';

      let displayTitle = node.label || node.id;
      let displaySub = node.name_ref || node.id;
      let badgeTag = '';
      let subDetail = '';

      // Clean Terraform / verbose labels
      if (displayTitle.startsWith('Role: privesc') || displayTitle.startsWith('privesc')) {
        const shortMatch = displayTitle.match(/privesc\d+/i);
        const prefix = shortMatch ? shortMatch[0].toUpperCase() : 'IAM';
        displayTitle = node.choke ? 'Over-privileged Role' : `${prefix} Role`;
        displaySub = node.name_ref || node.id.replace(/^privesc\d+[-_]?/i, '');
        if (displaySub.length > 22) {
          displaySub = displaySub.slice(0, 20) + '...';
        }
      } else if (displayTitle.length > 24) {
        displayTitle = displayTitle.slice(0, 22) + '...';
      }

      if (node.entry) {
        shape = 'ellipse';
        borderColor = '#EF4444';
        borderWidth = 2.5;
        bgColor = '#FFF1F2';
        textColor = '#DC2626';
        iconType = 'internet';
        iconColor = '#DC2626';
        displayTitle = 'Internet';
        displaySub = 'ENTRY POINT';
      } else if (node.crown_jewel) {
        shape = 'round-rectangle';
        borderColor = '#EF4444';
        borderWidth = 2.5;
        bgColor = '#FEF2F2';
        textColor = '#991B1B';
        iconType = 'database';
        iconColor = '#DC2626';
        badgeTag = 'CROWN JEWEL';
        if (node.sensitivity) {
          subDetail = node.sensitivity.replace(/[_-]/g, ' ');
        }
      } else if (node.choke) {
        shape = 'round-rectangle';
        borderColor = '#F59E0B';
        borderWidth = 2.5;
        bgColor = '#FFFBEB';
        textColor = '#92400E';
        iconType = 'role';
        iconColor = '#D97706';
        badgeTag = 'CHOKE POINT';
        if (node.privilege === 'admin' || (node.misconfig && node.misconfig.includes('overprivileged_policy'))) {
          subDetail = 'AdministratorAccess';
        }
      } else {
        // Intermediate node styling
        if (node.type === 'compute' && node.id.includes('code')) {
          iconType = 'compute_code';
          iconColor = '#2563EB';
          borderColor = '#3B82F6';
        } else if (node.type === 'compute') {
          iconType = 'compute';
          iconColor = '#2563EB';
          borderColor = '#EF4444'; // Top primary path
        } else if (node.type === 'credential' || node.id.includes('key')) {
          iconType = 'credential';
          iconColor = '#D97706';
          borderColor = '#F59E0B';
        } else if (node.type === 'role') {
          iconType = 'role';
          iconColor = '#475569';
          borderColor = '#64748B';
        } else if (node.type === 'data') {
          iconType = 'database';
          iconColor = '#64748B';
          borderColor = '#CBD5E1';
          borderStyle = 'dashed';
        } else {
          iconType = 'generic';
          iconColor = '#64748B';
          borderColor = '#CBD5E1';
        }

        if (paths.length === 0) {
          borderStyle = 'dashed';
          borderColor = '#CBD5E1';
          bgColor = '#F8FAFC';
          textColor = '#64748B';
        }
      }

      // Format lines cleanly
      const labelLines: string[] = [];
      if (node.entry) {
        labelLines.push(displayTitle);
        labelLines.push(displaySub);
      } else {
        labelLines.push(displayTitle);
        if (displaySub && displaySub !== displayTitle) {
          labelLines.push(displaySub);
        }
        if (badgeTag) {
          labelLines.push(`[ ${badgeTag} ]`);
        }
        if (subDetail) {
          labelLines.push(subDetail);
        }
      }

      const fullLabel = labelLines.join('\n');
      const bgIcon = getSvgIcon(iconType, iconColor);

      let width = 195;
      let height = 70;

      if (node.entry) {
        width = 90;
        height = 90;
      } else {
        width = node.choke ? 215 : node.crown_jewel ? 210 : 195;
        height = badgeTag ? 82 : 70;
        if (subDetail) height += 12;
      }

      const opacity = analysis.applied && !node.reachable ? 0.35 : 1.0;

      elements.push({
        data: {
          id: node.id,
          label: fullLabel,
          type: node.type,
          nodeData: node,
          shape,
          width,
          height,
          bgColor,
          borderColor,
          borderWidth,
          borderStyle,
          textColor,
          bgIcon,
          opacity,
        },
        style: {
          shape,
          width,
          height,
          label: fullLabel,
          'background-color': bgColor,
          'border-color': borderColor,
          'border-width': borderWidth,
          'border-style': borderStyle,
          'color': textColor,
          'opacity': opacity,
          'background-image': bgIcon,
          'background-width': node.entry ? '26px' : '18px',
          'background-height': node.entry ? '26px' : '18px',
          'background-position-x': node.entry ? '50%' : '14px',
          'background-position-y': node.entry ? '24%' : '50%',
          'text-margin-x': node.entry ? 0 : 22,
          'text-margin-y': node.entry ? 14 : 0,
          'text-max-width': node.entry ? '80px' : '125px',
        },
      });
    });

    // Add Edges
    analysis.edges.forEach((edge: AnalysisEdge) => {
      let lineColor = '#94A3B8';
      let width = 2;
      let lineStyle: cytoscape.Css.LineStyle = 'solid';
      let label = '';

      if (edge.removed) {
        lineStyle = 'dashed';
        lineColor = '#94A3B8';
        label = 'fixed';
      } else if (edge.paths.length >= 2) {
        lineColor = '#EF4444'; // Converging critical
        width = 3;
      } else if (edge.paths.includes(1)) {
        lineColor = '#EF4444'; // Red attack path 1
        width = 2.5;
      } else if (edge.paths.includes(2)) {
        lineColor = '#3B82F6'; // Blue attack path 2
        width = 2.5;
      } else if (edge.paths.includes(3)) {
        lineColor = '#F59E0B'; // Amber attack path 3
        width = 2.5;
      } else {
        lineStyle = 'dashed';
        lineColor = '#CBD5E1';
        width = 1.5;
      }

      elements.push({
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: label,
          edgeData: edge,
        },
        style: {
          'line-color': lineColor,
          'target-arrow-color': lineColor,
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'width': width,
          'line-style': lineStyle,
          'label': label,
          'font-size': 10,
          'text-background-color': '#FFFFFF',
          'text-background-opacity': 0.85,
          'text-background-padding': 2,
        },
      });
    });

    if (cyInstance.current) {
      cyInstance.current.destroy();
    }

    const layoutOptions: any = {
      dagre: {
        name: 'dagre',
        rankDir: 'LR',
        nodeSep: 44,
        rankSep: 100,
        padding: 30,
      },
      breadthfirst: {
        name: 'breadthfirst',
        directed: true,
        padding: 30,
        spacingFactor: 1.15,
      },
      concentric: {
        name: 'concentric',
        padding: 30,
        minNodeSpacing: 50,
      },
    }[layoutName];

    const cy = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-family': 'Inter, system-ui, -apple-system, sans-serif',
            'font-size': '11px',
            'font-weight': 600,
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '125px',
            'line-height': 1.35,
            'text-justification': 'center',
            'shape': 'data(shape)' as any,
            'width': 'data(width)' as any,
            'height': 'data(height)' as any,
            'background-color': 'data(bgColor)',
            'border-color': 'data(borderColor)',
            'border-width': 'data(borderWidth)' as any,
            'border-style': 'data(borderStyle)' as any,
            'color': 'data(textColor)',
            'opacity': 'data(opacity)' as any,
            'background-image': 'data(bgIcon)',
            'background-fit': 'none',
            'transition-property': 'background-color, border-color, opacity',
            'transition-duration': 300,
          },
        },
        {
          selector: 'edge',
          style: {
            'arrow-scale': 1.2,
          },
        },
      ],
      layout: layoutOptions,
      wheelSensitivity: 0.25,
      maxZoom: 2.2,
      minZoom: 0.35,
    });

    cy.on('layoutstop', () => {
      cy.fit(undefined, 32);
    });

    cy.ready(() => {
      cy.fit(undefined, 32);
    });

    // Auto fit on window resize
    const handleResize = () => {
      cy.resize();
      cy.fit(undefined, 32);
    };
    window.addEventListener('resize', handleResize);

    // Edge hover tooltips
    cy.on('mouseover', 'edge', (e) => {
      const edge = e.target;
      const data = edge.data('edgeData');
      const pos = e.renderedPosition;
      setTooltip({
        visible: true,
        x: pos.x,
        y: pos.y,
        content: data,
      });
    });

    cy.on('mouseout', 'edge', () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    });

    cyInstance.current = cy;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (cyInstance.current) {
        cyInstance.current.destroy();
        cyInstance.current = null;
      }
    };
  }, [analysis, layoutName]);

  // Telemetry & Attack Packets Loop with Node Occlusion to Prevent Dots Covering Text
  useEffect(() => {
    if (!analysis || !packetCanvasRef.current) return;
    const canvas = packetCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const packets: Packet[] = [];
    const activePaths = analysis.paths || [];

    if (activePaths.length > 0) {
      activePaths.forEach((p: AnalysisPath) => {
        for (let i = 0; i < p.nodes.length - 1; i++) {
          const u = p.nodes[i];
          const v = p.nodes[i + 1];
          const isChoke = analysis.choke_point?.id === u || analysis.choke_point?.id === v;
          const color = analysis.applied
            ? '#10B981' // Green
            : isChoke
            ? '#F59E0B' // Amber
            : p.id === 1
            ? '#EF4444' // Red
            : p.id === 2
            ? '#3B82F6' // Blue
            : '#F59E0B'; // Amber

          // 2 packets per active edge, staggered
          packets.push({
            sourceId: u,
            targetId: v,
            progress: (i * 0.25) % 1.0,
            speed: 0.009 + (p.id * 0.002),
            color,
            pathId: p.id,
            isChoke,
          });
          packets.push({
            sourceId: u,
            targetId: v,
            progress: ((i * 0.25) + 0.5) % 1.0,
            speed: 0.009 + (p.id * 0.002),
            color,
            pathId: p.id,
            isChoke,
          });
        }
      });
    }

    let isRunning = true;

    const renderPackets = () => {
      if (!isRunning) return;

      const cy = cyInstance.current;
      if (!cy || !packetsEnabled) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animFrameRef.current = requestAnimationFrame(renderPackets);
        return;
      }

      // Ensure canvas matches container dimensions
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1.0) pkt.progress = 0;

        const nodeU = cy.getElementById(pkt.sourceId);
        const nodeV = cy.getElementById(pkt.targetId);

        if (!nodeU || !nodeV || nodeU.length === 0 || nodeV.length === 0) return;

        const posU = nodeU.renderedPosition();
        const posV = nodeV.renderedPosition();

        const x = posU.x + (posV.x - posU.x) * pkt.progress;
        const y = posU.y + (posV.y - posU.y) * pkt.progress;

        // CRITICAL BUG FIX: Ensure packet dots NEVER sit on top of node labels
        // Check if (x, y) is inside the rendered bounding box of either node
        const bbU = nodeU.renderedBoundingBox();
        const bbV = nodeV.renderedBoundingBox();
        const inNodeU = x >= bbU.x1 && x <= bbU.x2 && y >= bbU.y1 && y <= bbU.y2;
        const inNodeV = x >= bbV.x1 && x <= bbV.x2 && y >= bbV.y1 && y <= bbV.y2;
        if (inNodeU || inNodeV) return; // Skip drawing on node face!

        // Draw glowing packet
        ctx.save();
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 7;

        // Core dot
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Glowing outer pulse ring
        ctx.strokeStyle = pkt.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.stroke();

        // Subtle trail
        const trailX = x - (posV.x - posU.x) * 0.04;
        const trailY = y - (posV.y - posU.y) * 0.04;
        ctx.fillStyle = pkt.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(trailX, trailY, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(renderPackets);
    };

    animFrameRef.current = requestAnimationFrame(renderPackets);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [analysis, packetsEnabled]);

  return (
    <div
      ref={cardContainerRef}
      className={`bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col relative transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'h-[640px]'
      }`}
    >
      {/* Topology Toolbar */}
      <div className="px-4 py-2.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Attack Topology
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            {layoutName === 'dagre'
              ? 'Dagre Directed Flow'
              : layoutName === 'breadthfirst'
              ? 'Hierarchical Tree'
              : 'Concentric Flow'}
          </span>
        </div>

        {/* Controls: Packets, Legend, Layout, Fullscreen */}
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 flex-wrap">
          {/* Animated Packets Toggle */}
          <button
            type="button"
            onClick={() => setPacketsEnabled(!packetsEnabled)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
              packetsEnabled
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title="Toggle live attack packet visualization"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                packetsEnabled ? 'bg-blue-600 animate-ping' : 'bg-slate-400'
              }`}
            />
            <span>Packets: {packetsEnabled ? 'Streaming' : 'Paused'}</span>
          </button>

          {/* Legend */}
          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-rose-500 bg-rose-500" /> Entry
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Choke
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Crown Jewel
            </span>
          </div>

          {/* Layout Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLayoutDropdownOpen(!layoutDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-md text-[11px] font-semibold shadow-2xs cursor-pointer"
            >
              <span>Layout</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {layoutDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setLayoutName('dagre');
                    setLayoutDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                    layoutName === 'dagre' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  Directed Flow
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLayoutName('breadthfirst');
                    setLayoutDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                    layoutName === 'breadthfirst' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  Hierarchical
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLayoutName('concentric');
                    setLayoutDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium ${
                    layoutName === 'concentric' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  Radial Concentric
                </button>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Graph Canvas Container */}
      <div className="w-full flex-1 bg-[#FAFAFC] relative overflow-hidden">
        <div ref={cyRef} className="w-full h-full absolute inset-0" />
        <canvas
          ref={packetCanvasRef}
          className="w-full h-full absolute inset-0 pointer-events-none z-10"
        />

        {/* Floating Zoom Controls (Top-Right inside Canvas) */}
        <div className="absolute top-3 right-3 z-20 flex items-center bg-white/90 backdrop-blur border border-slate-200/90 rounded-lg shadow-2xs divide-x divide-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={handleFit}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Fit graph to canvas"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Edge Tooltip */}
      {tooltip.visible && tooltip.content && (
        <div
          className="absolute z-30 pointer-events-none bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs w-64 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
            <span>{tooltip.content.type || 'Connection'}</span>
            <span className="text-blue-600 font-mono">{tooltip.content.technique || 'T1000'}</span>
          </div>
          <div className="text-slate-600 text-[11px] space-y-0.5">
            <div>
              Difficulty: <b className="text-slate-900">{tooltip.content.difficulty}</b>
            </div>
            {tooltip.content.fix && (
              <div>
                Fix available: <b className="text-emerald-600">{tooltip.content.fix}</b>
              </div>
            )}
            {tooltip.content.paths?.length > 0 && (
              <div>
                Traversed by: <b className="text-slate-900">Path #{tooltip.content.paths.join(', #')}</b>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
