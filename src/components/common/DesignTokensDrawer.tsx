/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan Design System, Token Proposal, & Information Architecture Explorer
 * Deliverable 1: Design system documentation (tokens, components, states, motion rules, IA)
 */

import React, { useState } from 'react';
import { X, Palette, Layout, ShieldCheck, Zap, Sliders, ChevronRight } from 'lucide-react';

interface DesignTokensDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const DesignTokensDrawer: React.FC<DesignTokensDrawerProps> = ({ isOpen, onClose, isDark }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'components' | 'ia' | 'motion'>('tokens');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                YuvaPoshan Design System &amp; Architecture Proposal
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Production token specifications, component inventory, and role IA
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('tokens')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'tokens'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Design Tokens
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'components'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Component List
          </button>
          <button
            onClick={() => setActiveTab('ia')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'ia'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Information Architecture
          </button>
          <button
            onClick={() => setActiveTab('motion')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'motion'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Motion &amp; A11y Rules
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-700 dark:text-neutral-300">
          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">
                  1. Color Palette Tokens (WCAG 2.1 AA Calibrated)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-teal-600"></div>
                      <span className="font-semibold text-neutral-900 dark:text-white">Teal Primary</span>
                    </div>
                    <code className="text-[10px] font-mono text-neutral-500">#0D9488 / #14B8A6 (Dark)</code>
                    <p className="text-[11px] text-neutral-500 mt-1">Calm, reassuring primary actions and accents.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-indigo-600"></div>
                      <span className="font-semibold text-neutral-900 dark:text-white">Indigo Authority</span>
                    </div>
                    <code className="text-[10px] font-mono text-neutral-500">#4338CA / #818CF8 (Dark)</code>
                    <p className="text-[11px] text-neutral-500 mt-1">Institutional trust and admin workflows.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-emerald-600"></div>
                      <span className="font-semibold text-neutral-900 dark:text-white">Present (P)</span>
                    </div>
                    <code className="text-[10px] font-mono text-neutral-500">#059669 / #10B981</code>
                    <p className="text-[11px] text-neutral-500 mt-1">Confirmed student attendance and healthy markers.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-rose-600"></div>
                      <span className="font-semibold text-neutral-900 dark:text-white">Absent (A)</span>
                    </div>
                    <code className="text-[10px] font-mono text-neutral-500">#E11D48 / #F43F5E</code>
                    <p className="text-[11px] text-neutral-500 mt-1">Unexcused absence and health review flags.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-amber-600"></div>
                      <span className="font-semibold text-neutral-900 dark:text-white">Late (L) &amp; Alerts</span>
                    </div>
                    <code className="text-[10px] font-mono text-neutral-500">#D97706 / #FBBF24</code>
                    <p className="text-[11px] text-neutral-500 mt-1">Late arrival and consecutive absence warnings.</p>
                  </div>

                  <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded-md bg-indigo-500"></div>
                      <span className="font-semibold text-neutral-900 dark:text-white">Excused (E)</span>
                    </div>
                    <code className="text-[10px] font-mono text-neutral-500">#6366F1 / #A5B4FC</code>
                    <p className="text-[11px] text-neutral-500 mt-1">Authorized leave or medical notice on record.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">
                  2. Glassmorphism Elevation Tokens
                </h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
                    <div>--color-bg-surface: rgba(255, 255, 255, 0.78) | rgba(15, 23, 42, 0.72)</div>
                    <div>backdrop-filter: blur(20px)</div>
                    <div>border: 1px solid rgba(255, 255, 255, 0.65) | rgba(255, 255, 255, 0.14)</div>
                    <div>box-shadow: 0 10px 30px -10px rgba(15, 76, 92, 0.08)</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">
                  3. Typography &amp; Scale
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li><strong>Family:</strong> Plus Jakarta Sans (Geometric display + clean body prose)</li>
                  <li><strong>Telemetry &amp; Counts:</strong> JetBrains Mono tabular figures (<code className="font-mono">tabular-nums</code>)</li>
                  <li><strong>Corner Radii:</strong> 20px card radius, 10px control radius, 9999px pills</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                Component Inventory
              </h4>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 font-semibold text-neutral-900 dark:text-white">
                  Teacher Roll Call &amp; Nutrition System
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-teal-600 dark:text-teal-400">RollCallGrid:</span> Fast 125-student grid, one-tap cycling, keyboard shortcuts (P/A/L/E), animated counters, and haptic feedback.
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-teal-600 dark:text-teal-400">AttendanceRing:</span> Live SVG ring showing percentage present+late with instant color interpolation.
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-teal-600 dark:text-teal-400">ConsecutiveAbsencesAlerts:</span> Flags 3+ consecutive absences with last contact date and one-tap follow-up dialog.
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-teal-600 dark:text-teal-400">MealCalorieLog:</span> Food picker (ICMR-NIN IFCT 2020), live (g/child × kcal/100g ÷ 100) × count calculator, category breakdown donut, and weekly target bands.
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-teal-600 dark:text-teal-400">StudentHeatmapModal:</span> 30-day attendance calendar heatmap with status color preview.
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-teal-600 dark:text-teal-400">BulkActionSheet:</span> Confirmation modal for &ldquo;Mark All Present&rdquo; and &ldquo;Copy Yesterday&rdquo;.
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 font-semibold text-neutral-900 dark:text-white">
                  Admin &amp; Parent Portals
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">AdminDashboard:</span> 4-section comparative KPIs, student directory with saved views and CSV export, growth review list, and append-only audit log.
                </div>
                <div className="p-3 space-y-1">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">ParentPortal:</span> Mobile-first child profile, growth curve against reference bands, meal log, and absence notification center.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ia' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                Information Architecture (By Role)
              </h4>

              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h5 className="font-bold text-teal-600 dark:text-teal-400">1. Class Teacher (Grade 5A - 8A)</h5>
                  <p className="text-[11px] text-neutral-500 mb-2">Designed for the 8:30 AM morning rush: speed, zero friction, and high scannability.</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <li><strong>Today&apos;s Roll Call:</strong> 125 student grid, live attendance ring, bulk mark all / copy yesterday, undo toast.</li>
                    <li><strong>Absence Alerts:</strong> 3+ day consecutive absence detector with parent contact action.</li>
                    <li><strong>Mid-day Meal Entry:</strong> Food item selector, grams/child &amp; count live calculator.</li>
                    <li><strong>Section Insights:</strong> Calorie breakdown donut, weekly calories against 700 kcal target, attendance by day.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h5 className="font-bold text-indigo-600 dark:text-indigo-400">2. Headmaster / Administrator</h5>
                  <p className="text-[11px] text-neutral-500 mb-2">High-level school health, nutrition compliance, and audit oversight.</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <li><strong>School Overview:</strong> Total 500 students across 4 sections, attendance rate KPI, monthly calories served.</li>
                    <li><strong>Section Comparison:</strong> Grade 5A vs 6A vs 7A vs 8A small multiples.</li>
                    <li><strong>Growth Review List:</strong> Non-diagnostic flag list for pediatrician / medical officer inspection.</li>
                    <li><strong>Directory &amp; Export:</strong> Paginated directory with filter, column selector, and CSV export.</li>
                    <li><strong>Audit Log:</strong> Timestamped append-only log of who accessed or updated records.</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30">
                  <h5 className="font-bold text-amber-600 dark:text-amber-400">3. Parent Portal</h5>
                  <p className="text-[11px] text-neutral-500 mb-2">Mobile-optimized, low-bandwidth, accessible in Kannada, Tamil, Telugu, and Malayalam.</p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-600 dark:text-neutral-300 text-[11px]">
                    <li><strong>Linked Child View:</strong> Attendance streak, today&apos;s status, nutrition supplied.</li>
                    <li><strong>Growth Guidepost:</strong> Informational BMI-for-age chart with clear non-diagnostic disclaimer.</li>
                    <li><strong>School Meal Record:</strong> What meal was prepared and supplied today.</li>
                    <li><strong>Notifications:</strong> SMS/in-app alert on recorded absence.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'motion' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                Motion &amp; Accessibility (WCAG 2.1 AA)
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400">
                <li><strong>Motion Budget:</strong> Feedback transitions settle within 150ms–240ms. Attendance taps trigger spring-scale (<code className="font-mono">scale: 0.96 &rarr; 1.0</code>).</li>
                <li><strong>Reduced Motion:</strong> Fully complies with <code className="font-mono">prefers-reduced-motion: reduce</code> via CSS variables and React motion flags.</li>
                <li><strong>Non-Color State Signaling:</strong> Every status has both an explicit color and an accompanying label/letter badge (&ldquo;P - Present&rdquo;, &ldquo;A - Absent&rdquo;).</li>
                <li><strong>Keyboard Accessibility:</strong> Full roving tab navigation, P/A/L/E roll call hotkeys, Cmd+K search, and &ldquo;?&rdquo; hotkey legend.</li>
                <li><strong>Touch Hitbox:</strong> All mobile controls &ge; 44x44px.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end bg-neutral-50 dark:bg-neutral-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            Close Proposal
          </button>
        </div>
      </div>
    </div>
  );
};
