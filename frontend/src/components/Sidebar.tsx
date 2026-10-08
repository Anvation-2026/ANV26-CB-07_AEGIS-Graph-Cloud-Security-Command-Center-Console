import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Network,
  ShieldCheck,
  Cpu,
  CreditCard,
  History,
  ChevronLeft,
  ChevronRight,
  Activity,
  Radio
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { status, devices } = useApp();
  const location = useLocation();

  const isPathActive = (itemPath: string) => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  const esp32 = devices.find(
    (d) => d.device_id === 'esp32-console-01' || d.device_id?.toLowerCase().includes('esp32')
  );
  const unoq = devices.find(
    (d) =>
      d.device_id === 'unoq-status-01' ||
      d.device_id === 'uno-q-agent-01' ||
      d.device_id?.toLowerCase().includes('uno')
  );

  const navigationSections = [
    {
      title: 'SECURITY GRAPH',
      links: [
        {
          name: 'Attack Graph & Overview',
          shortName: 'Overview',
          path: '/',
          icon: Network,
          badge: status ? (status.path_count > 0 ? `${status.path_count} OPEN` : 'SAFE') : null,
          badgeColor: status?.path_count ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          name: 'Remediation & Diff',
          shortName: 'Remediation',
          path: '/remediation',
          icon: ShieldCheck,
          badge: status?.pending_fix ? 'PENDING' : 'SAFE',
          badgeColor: status?.pending_fix ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
      ],
    },
    {
      title: '', // HARDWARE & ACCESS heading removed as requested
      links: [
        {
          name: 'Hardware Console',
          shortName: 'Hardware',
          path: '/hardware',
          icon: Cpu,
          badge: esp32?.online ? 'ONLINE' : 'OFFLINE',
          badgeColor: esp32?.online ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200',
        },
        {
          name: 'Access Cards & RFID',
          shortName: 'Badges',
          path: '/cards',
          icon: CreditCard,
        },
        {
          name: 'Audit',
          shortName: 'Audit',
          path: '/audit',
          icon: History,
        },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 transition-all duration-300 ease-in-out select-none z-20 overflow-hidden ${
        isOpen
          ? 'w-64 opacity-100'
          : 'w-0 opacity-0 border-r-0 pointer-events-none'
      }`}
    >
      {/* Inner container with static width to prevent text wrapping during slide animation */}
      <div
        className={`w-64 h-full flex flex-col min-w-[16rem] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Link List (The 5 things) */}
        <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-1">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-4 pb-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase select-none">
                  {section.title}
                </div>
              )}
              {section.links.map((item) => {
                const IconComponent = item.icon;
                const active = isPathActive(item.path);

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={`group relative flex items-center gap-3 px-3 py-2 mx-2 text-xs rounded-md transition-colors select-none ${
                      active
                        ? 'bg-blue-50/80 text-blue-700 font-semibold border border-blue-200/60 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent font-medium'
                    }`}
                  >
                    <IconComponent
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span
                      className={`truncate flex-1 ${
                        active ? 'font-semibold text-blue-700' : 'font-medium text-slate-700 group-hover:text-slate-900'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-600 rounded-r" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Hardware Status & Controls */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/60 shrink-0">
          <div className="space-y-2">
            <NavLink
              to="/hardware"
              className="block bg-white hover:bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 shadow-2xs transition-all group"
              title="Open Hardware Console"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-700">Hardware Link</span>
                </span>
                <span className="text-[10px] text-blue-600 font-semibold group-hover:underline">
                  Console &rarr;
                </span>
              </div>

              {/* Device 1: ESP32 Console */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                      esp32?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <span className="truncate">ESP32 Console</span>
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                    esp32?.online
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {esp32?.online ? (esp32.ip || '172.16.11.2') : 'Offline'}
                </span>
              </div>

              {/* Device 2: Arduino UNO Q */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800 pt-1.5">
                <span className="flex items-center gap-1.5 truncate">
                  <span
                    className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                      unoq?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                    }`}
                  />
                  <span className="truncate">Arduino UNO Q</span>
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                    unoq?.online
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {unoq?.online ? (unoq.ip || 'Online') : 'Offline'}
                </span>
              </div>
            </NavLink>

            <div className="flex items-center justify-between pt-1">
              <NavLink
                to="/hardware"
                className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 hover:text-blue-600 transition-colors"
                title="Global state sequence counter"
              >
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span className="font-semibold">Seq #{status?.seq ?? 0}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </NavLink>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center cursor-pointer"
                title="Collapse sidebar inside"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
