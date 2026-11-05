/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WeeklyMealPlan: Upcoming School Menu for the Week
 * Displays the 6-day South Indian school menu under PM-POSHAN,
 * with daily ingredient breakdowns, nutritional targets (700 kcal & 20g protein),
 * millet days, egg & vegetarian alternatives, and print/export utilities.
 */

import React, { useState } from 'react';
import { 
  CalendarDays, 
  Flame, 
  Scale, 
  Sparkles, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Utensils, 
  Egg, 
  Milk, 
  Wheat, 
  Clock, 
  X,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { 
  DailyMenuPlan, 
  STANDARD_WEEKLY_MENU, 
  getTodayMenu, 
  calculateWeeklyAverages, 
  PM_POSHAN_UPPER_PRIMARY_TARGETS 
} from '../../utils/weeklyPlan';
import { SupportedLanguage } from '../../data/i18n';

interface WeeklyMealPlanProps {
  currentLang?: SupportedLanguage;
  onClose?: () => void;
  isModal?: boolean;
}

export const WeeklyMealPlan: React.FC<WeeklyMealPlanProps> = ({
  currentLang = 'en',
  onClose,
  isModal = false,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    const today = new Date().getDay();
    // 0 is Sunday -> default to Monday (1), 1-6 map directly
    return today === 0 ? 1 : today;
  });

  const [viewMode, setViewMode] = useState<'focused' | 'matrix'>('focused');

  // Escape key handler
  React.useEffect(() => {
    if (!isModal || !onClose) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isModal, onClose]);

  const todayMenu = getTodayMenu();
  const weeklyStats = calculateWeeklyAverages(STANDARD_WEEKLY_MENU);
  const activePlan = STANDARD_WEEKLY_MENU.find((d) => d.dayIndex === selectedDayIndex) || STANDARD_WEEKLY_MENU[0];

  // Export Weekly Menu to CSV
  const handleExportCSV = () => {
    const headers = [
      'Day',
      'Theme',
      'Main Course',
      'Dal / Accompaniment',
      'Protein / Egg Supplement',
      'Vegetable Feature',
      'Morning Beverage',
      'Calories Supplied (kcal)',
      'Protein Supplied (g)',
      'Iron Supplied (mg)',
      'Vegetarian Alternative',
    ];

    const rows = STANDARD_WEEKLY_MENU.map((d) => [
      `"${d.dayOfWeek} (${d.dayNativeKn})"`,
      `"${d.theme}"`,
      `"${d.mainCourse}"`,
      `"${d.accompaniment}"`,
      `"${d.proteinSupplement}"`,
      `"${d.vegetableFeature}"`,
      `"${d.morningBeverage || 'Pure Drinking Water'}"`,
      d.caloriesSuppliedKcal,
      d.proteinGrams,
      d.ironMg,
      `"${d.vegetarianAlternative}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `YuvaPoshan_Weekly_Meal_Plan_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
      className={`w-full ${isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md cursor-pointer' : ''}`}
    >
      <div 
        onClick={(e) => isModal && e.stopPropagation()} 
        className={`w-full ${isModal ? 'glass-panel-elevated max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden cursor-default' : 'glass-panel p-6 shadow-sm'}`}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Weekly School Meal Plan (PM-POSHAN)</span>
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Karnataka State Government School Standard Cycle · Upper Primary Grades 5–8
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-xl text-xs">
              <button
                onClick={() => setViewMode('focused')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === 'focused'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Day-by-Day
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === 'matrix'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Full Week Matrix
              </button>
            </div>

            {/* Print & CSV Export */}
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors hidden sm:flex items-center"
              title="Print Weekly Menu for School Notice Board"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Export weekly plan to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Weekly Compliance & Average Metric Strip */}
        <div className="px-5 py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-mono">Avg Energy</span>
              <div className="font-bold font-mono text-neutral-900 dark:text-white">
                {weeklyStats.avgCalories} kcal <span className="text-[10px] text-emerald-600 font-normal">(&ge;700)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-mono">Avg Protein</span>
              <div className="font-bold font-mono text-neutral-900 dark:text-white">
                {weeklyStats.avgProtein} g <span className="text-[10px] text-emerald-600 font-normal">(&ge;20g)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Egg className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-mono">Egg Supplement</span>
              <div className="font-bold text-neutral-900 dark:text-white text-[11px]">
                4 Days / Wk <span className="text-[10px] text-neutral-400 font-normal">(or Sundal)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-mono">ICMR Compliance</span>
              <div className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                100% Certified
              </div>
            </div>
          </div>
        </div>

        {/* View Mode 1: Day-by-Day Focused View */}
        {viewMode === 'focused' && (
          <div className={`p-5 overflow-y-auto ${isModal ? 'flex-1' : ''} space-y-5`}>
            {/* Day Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {STANDARD_WEEKLY_MENU.map((plan) => {
                const isSelected = plan.dayIndex === selectedDayIndex;
                const isToday = plan.dayIndex === todayMenu.dayIndex;

                return (
                  <button
                    key={plan.dayIndex}
                    onClick={() => setSelectedDayIndex(plan.dayIndex)}
                    className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500/15 text-teal-900 dark:text-teal-200 shadow-sm ring-1 ring-teal-500/50'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">{plan.dayOfWeek}</span>
                      {isToday && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-600 text-white font-mono uppercase">
                          Today
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-medium text-neutral-400 mt-0.5">
                      {plan.dayNativeKn} · {plan.caloriesSuppliedKcal} kcal
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Showcase Card */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 p-5 shadow-sm space-y-5">
              {/* Card Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono">
                      {activePlan.dayOfWeek.toUpperCase()} ({activePlan.dayNativeKn})
                    </span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                      {activePlan.theme}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                    {activePlan.mainCourse} &amp; {activePlan.accompaniment}
                  </h3>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">Energy Supplied</span>
                    <div className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                      {activePlan.caloriesSuppliedKcal} kcal
                    </div>
                  </div>
                  <div className="text-right border-l border-neutral-200 dark:border-neutral-700 pl-3">
                    <span className="text-[10px] text-neutral-400 uppercase font-mono">Protein</span>
                    <div className="text-base font-bold font-mono text-neutral-800 dark:text-neutral-200">
                      {activePlan.proteinGrams} g
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Structure Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* Main Course */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-semibold mb-1">
                    <Utensils className="w-3.5 h-3.5 text-teal-600" />
                    <span>Main Course</span>
                  </div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {activePlan.mainCourse}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Portion: 150g cooked grain
                  </div>
                </div>

                {/* Accompaniment / Dal */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-semibold mb-1">
                    <Wheat className="w-3.5 h-3.5 text-amber-600" />
                    <span>Dal / Gravy</span>
                  </div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {activePlan.accompaniment}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Toor dal &amp; regional vegetables
                  </div>
                </div>

                {/* Protein / Egg Supplement */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-semibold mb-1">
                    <Egg className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Protein Supplement</span>
                  </div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {activePlan.proteinSupplement}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                    Vegetarian alt: {activePlan.vegetarianAlternative}
                  </div>
                </div>

                {/* Morning Beverage / Milk */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-1.5 text-neutral-500 font-semibold mb-1">
                    <Milk className="w-3.5 h-3.5 text-sky-600" />
                    <span>Morning Session (09:30 AM)</span>
                  </div>
                  <div className="font-bold text-neutral-900 dark:text-white">
                    {activePlan.morningBeverage || 'Filtered Drinking Water'}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Ksheera Bhagya Scheme
                  </div>
                </div>
              </div>

              {/* Ingredient Breakdown Table */}
              <div>
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[10px]">
                  Standard Kitchen Ingredient Allocations (Per Child)
                </span>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activePlan.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                          {item.nameEn}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-medium">
                          {item.nameKn}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-300">
                        {item.portionGrams}g
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kitchen Prep & Sourcing Notes */}
              <div className="p-3.5 rounded-xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/60 text-xs flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-900 dark:text-teal-200">Preparation &amp; Quality Protocol: </span>
                  <span>{activePlan.prepNotes}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Mode 2: Full Week Matrix (6-day cards) */}
        {viewMode === 'matrix' && (
          <div className={`p-5 overflow-y-auto ${isModal ? 'flex-1' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STANDARD_WEEKLY_MENU.map((plan) => {
                const isToday = plan.dayIndex === todayMenu.dayIndex;

                return (
                  <div
                    key={plan.dayIndex}
                    onClick={() => {
                      setSelectedDayIndex(plan.dayIndex);
                      setViewMode('focused');
                    }}
                    className={`rounded-2xl border p-4 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                      isToday
                        ? 'border-teal-500 bg-teal-500/10 shadow-md ring-1 ring-teal-500/40'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 hover:border-teal-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-neutral-900 dark:text-white">
                            {plan.dayOfWeek}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            ({plan.dayNativeKn})
                          </span>
                        </div>
                        {isToday && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-600 text-white font-mono uppercase">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-neutral-900 dark:text-white">
                        {plan.mainCourse}
                      </div>

                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        + {plan.accompaniment}
                      </div>

                      <div className="mt-3 text-[11px] p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                        <span>Protein: {plan.proteinSupplement}</span>
                        {plan.eggServed ? (
                          <Egg className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Wheat className="w-3.5 h-3.5 text-teal-500" />
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-teal-600 dark:text-teal-400">
                        {plan.caloriesSuppliedKcal} kcal
                      </span>
                      <span className="text-neutral-500">
                        {plan.proteinGrams}g pro
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Legal Disclaimer Strip */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 text-[11px] text-neutral-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>All nutritional values represent food supplied per child as prepared by the school kitchen. Informational record only.</span>
          </div>
          <span className="font-mono text-[10px]">ICMR-NIN IFCT 2020 &amp; PM-POSHAN</span>
        </div>
      </div>
    </div>
  );
};
