import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Play,
  RotateCcw,
  Upload,
  Menu,
  ChevronDown,
  Layers,
  MoreVertical,
  ExternalLink,
  Cpu,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ImportScenarioModal } from './ImportScenarioModal';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    scenarios,
    selectedScenario,
    setSelectedScenario,
    runAnalysis,
    resetAll,
    refreshAnalysis,
    loading,
    devices
  } = useApp();

  const [showImportModal, setShowImportModal] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const [showScenarioDropdown, setShowScenarioDropdown] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);
  const scenarioRef = useRef<HTMLDivElement>(null);

  // Close overflow and dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setShowOverflow(false);
      }
      if (scenarioRef.current && !scenarioRef.current.contains(e.target as Node)) {
        setShowScenarioDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find devices
  const esp32 = devices.find((d) => d.device_id === 'esp32-console-01');
  const unoq = devices.find((d) => d.device_id === 'unoq-status-01');
  const currentScenario = scenarios.find((s) => s.id === selectedScenario);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 h-14 select-none">
      <div className="h-full px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            title="Toggle Navigation Menu"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <img
              src="/logo.png"
              alt="AEGIS-Graph Logo"
              className="w-8 h-8 rounded-full object-contain shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-sm tracking-tight text-slate-900">
                  AEGIS-Graph
                </span>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 px-1.5 py-0.5 rounded tracking-wide">
                  Console
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5 hidden sm:inline">
                Cloud Security Command Center
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Project / Scenario Selector */}
        <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4" ref={scenarioRef}>
          <div className="relative w-full">
            <button
              id="scenario-selector-btn"
              type="button"
              onClick={() => !loading && setShowScenarioDropdown((v) => !v)}
              disabled={loading}
              className="flex items-center justify-between w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 transition-colors cursor-pointer shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              title="Select architecture scenario to analyze"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold text-xs text-slate-800 truncate">
                  {currentScenario?.display_name || selectedScenario}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  showScenarioDropdown ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>

            {/* Hidden native select for backwards compatibility / automated scripts */}
            <select
              id="scenario-selector"
              value={selectedScenario}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedScenario(val);
                runAnalysis(val);
              }}
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.display_name}
                </option>
              ))}
            </select>

            {/* Custom Popover Dropdown */}
            {showScenarioDropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-full min-w-[280px] bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Architecture Scenarios
                </div>
                {scenarios.map((sc) => {
                  const isSelected = sc.id === selectedScenario;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => {
                        setSelectedScenario(sc.id);
                        runAnalysis(sc.id);
                        setShowScenarioDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <span className="truncate">{sc.display_name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions, Hardware Status Chips & Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Import Button (Outlined) */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            disabled={loading}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
            title="Import custom architecture (Terraform or JSON)"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Import</span>
          </button>

          {/* Primary Run Analysis Button */}
          <button
            id="run-analysis-btn"
            type="button"
            onClick={() => runAnalysis(selectedScenario)}
            disabled={loading}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs px-3 sm:px-3.5 py-1.5 rounded-lg shadow-xs transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
            title="Execute attack graph analysis"
          >
            <Play className={`w-3.5 h-3.5 fill-white shrink-0 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{loading ? 'Analyzing...' : 'Run Analysis'}</span>
            <span className="sm:hidden">{loading ? '...' : 'Run'}</span>
          </button>

          {/* Hardware Status Chips (ESP32 & UNO Q) */}
          <div className="hidden lg:flex items-center gap-2 pl-1 border-l border-slate-200">
            {/* ESP32 Chip */}
            <Link
              to="/hardware"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title={`ESP32 Console: ${esp32?.online ? 'Online' : 'Offline'}`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  esp32?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                }`}
              />
              <span className="font-semibold text-slate-700">ESP32</span>
              <span className={`text-[10px] ${esp32?.online ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                {esp32?.online ? 'Online' : 'Offline'}
              </span>
            </Link>

            {/* UNO Q Chip */}
            <Link
              to="/hardware"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title={`UNO Q Status: ${unoq?.online ? 'Online' : 'Offline'}`}
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  unoq?.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                }`}
              />
              <span className="font-semibold text-slate-700">UNO Q</span>
              <span className={`text-[10px] ${unoq?.online ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                {unoq?.online ? 'Online' : 'Offline'}
              </span>
            </Link>
          </div>

          {/* Refresh / Re-sync Button */}
          <button
            type="button"
            onClick={() => refreshAnalysis()}
            disabled={loading}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh graph and telemetry"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Overflow Menu */}
          <div className="relative" ref={overflowRef}>
            <button
              type="button"
              onClick={() => setShowOverflow(!showOverflow)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOverflow && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    resetAll();
                    setShowOverflow(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset System State</span>
                </button>
                <Link
                  to="/hardware"
                  onClick={() => setShowOverflow(false)}
                  className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hardware Console</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import Scenario Modal */}
      <ImportScenarioModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </header>
  );
};
