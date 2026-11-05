/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Mid-Day Meal and Calorie Log with Live Calculator & Recharts Visualizations
 * Formula: (grams per child × kcal per 100g ÷ 100) × children served
 * Labeled strictly as "food supplied per child", NEVER "food eaten".
 */

import React, { useState } from 'react';
import { 
  Utensils, 
  Info, 
  Plus, 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  Download, 
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Area, 
  AreaChart, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { OFFICIAL_FOOD_ITEMS } from '../../data/foodTable';
import { calculateMealCalories, FoodItem, UPPER_PRIMARY_TARGET } from '../../utils/nutrition';

interface MealCalorieLogProps {
  presentStudentsCount: number;
}

export const MealCalorieLog: React.FC<MealCalorieLogProps> = ({ presentStudentsCount }) => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>(OFFICIAL_FOOD_ITEMS[0].id);
  const [gramsPerChild, setGramsPerChild] = useState<number>(150);
  const [childrenServed, setChildrenServed] = useState<number>(presentStudentsCount || 112);
  const [mealType, setMealType] = useState<'lunch' | 'morning_snack'>('lunch');
  const [activeChartTab, setActiveChartTab] = useState<'category' | 'daily' | 'target'>('category');
  const [showTableFallback, setShowTableFallback] = useState<boolean>(false);
  const [loggedItems, setLoggedItems] = useState<Array<{
    id: string;
    food: FoodItem;
    grams: number;
    children: number;
    perChildKcal: number;
    totalKcal: number;
  }>>([
    {
      id: 'log-1',
      food: OFFICIAL_FOOD_ITEMS[0], // Steamed Rice
      grams: 150,
      children: 112,
      perChildKcal: 195,
      totalKcal: 21840,
    },
    {
      id: 'log-2',
      food: OFFICIAL_FOOD_ITEMS[1], // Vegetable Sambar
      grams: 120,
      children: 112,
      perChildKcal: 110,
      totalKcal: 12320,
    },
    {
      id: 'log-3',
      food: OFFICIAL_FOOD_ITEMS[3], // Boiled Egg
      grams: 50,
      children: 98,
      perChildKcal: 78,
      totalKcal: 7644,
    },
    {
      id: 'log-4',
      food: OFFICIAL_FOOD_ITEMS[7], // Drumstick Leaf Poriyal
      grams: 60,
      children: 112,
      perChildKcal: 47,
      totalKcal: 5264,
    },
  ]);

  const selectedFood = OFFICIAL_FOOD_ITEMS.find((f) => f.id === selectedFoodId) || OFFICIAL_FOOD_ITEMS[0];
  const liveCalc = calculateMealCalories(gramsPerChild, selectedFood.kcalPer100g, childrenServed);

  // Total calories supplied across today's logged items
  const totalCaloriesSuppliedPerChild = loggedItems.reduce((acc, curr) => acc + curr.perChildKcal, 0);

  const handleAddMealItem = () => {
    const newItem = {
      id: `log-${Date.now()}`,
      food: selectedFood,
      grams: gramsPerChild,
      children: childrenServed,
      perChildKcal: liveCalc.perChildKcal,
      totalKcal: liveCalc.totalKcal,
    };
    setLoggedItems([...loggedItems, newItem]);
  };

  // Chart Data 1: Calories by Food Category (Donut)
  const categoryData = [
    { name: 'Cereal / Grains', value: 337, color: '#0d9488' },
    { name: 'Pulses & Dal', value: 110, color: '#4338ca' },
    { name: 'Egg / Protein Supplement', value: 78, color: '#f59e0b' },
    { name: 'Vegetables & Leafy Greens', value: 47, color: '#10b981' },
    { name: 'Dairy & Millets', value: 65, color: '#6366f1' },
  ];

  // Chart Data 2: Daily Calories by Meal Type (Stacked Bar)
  const dailyStackedData = [
    { day: 'Mon', lunch: 680, snack: 140 },
    { day: 'Tue', lunch: 720, snack: 150 },
    { day: 'Wed', lunch: 710, snack: 130 },
    { day: 'Thu', lunch: 690, snack: 160 },
    { day: 'Fri', lunch: 740, snack: 145 },
    { day: 'Sat', lunch: 660, snack: 120 },
  ];

  // Chart Data 3: Weekly Calories against ICMR Upper Primary Target (Line with band)
  const weeklyTargetData = [
    { week: 'W1', supplied: 690, minTarget: 650, maxTarget: 850, optimum: 700 },
    { week: 'W2', supplied: 715, minTarget: 650, maxTarget: 850, optimum: 700 },
    { week: 'W3', supplied: 705, minTarget: 650, maxTarget: 850, optimum: 700 },
    { week: 'W4 (Current)', supplied: totalCaloriesSuppliedPerChild || 685, minTarget: 650, maxTarget: 850, optimum: 700 },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Food Item,Category,Portion (g),Children Served,Calories Supplied / Child (kcal),Total Calories Supplied (kcal),Source Reference\n' +
      loggedItems
        .map(
          (item) =>
            `"${item.food.name}","${item.food.category}",${item.grams},${item.children},${item.perChildKcal},${item.totalKcal},"${item.food.sourceReference}"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `YuvaPoshan_Meal_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel p-4 md:p-6 space-y-6">
      {/* Header with Mandatory Legal / Nutrition Disclaimers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Utensils className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Mid-Day Meal Nutrition &amp; Calorie Ledger
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Official ICMR-NIN IFCT 2020 composition tables · Upper Primary norms (Grades 5–8)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/60 dark:bg-neutral-900/60 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Prominent Legal Clarity Notice */}
      <div className="p-3 rounded-xl bg-teal-500/10 dark:bg-teal-950/30 border border-teal-500/20 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-teal-900 dark:text-teal-200">Legal &amp; Clinical Notice:</strong> All figures represent{' '}
          <span className="font-semibold underline decoration-teal-500">food supplied per child</span> as prepared by the kitchen and verified against inventory records. They do <em>not</em> represent individual food eaten or absorbed. Growth and nutritional values are administrative records, not clinical diagnoses.
        </div>
      </div>

      {/* Two-Column Layout: Calculator & Live Entry vs Visual Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Meal Calculator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-500">
              Live Calorie Calculator
            </h4>

            {/* Select Food Item */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Select Food Item (ICMR-NIN IFCT Database)
              </label>
              <select
                value={selectedFoodId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedFoodId(id);
                  const f = OFFICIAL_FOOD_ITEMS.find((item) => item.id === id);
                  if (f) setGramsPerChild(f.defaultGramsPerChild);
                }}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white"
              >
                {OFFICIAL_FOOD_ITEMS.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} ({food.kcalPer100g} kcal / 100g)
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                Source: {selectedFood.sourceReference}
              </div>
            </div>

            {/* Meal Type */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMealType('lunch')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  mealType === 'lunch'
                    ? 'bg-teal-600 text-white'
                    : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                Mid-Day Lunch
              </button>
              <button
                type="button"
                onClick={() => setMealType('morning_snack')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  mealType === 'morning_snack'
                    ? 'bg-teal-600 text-white'
                    : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                Morning Snack
              </button>
            </div>

            {/* Grams per child & Children Served */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Grams / child
                </label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={gramsPerChild}
                  onChange={(e) => setGramsPerChild(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Children served
                </label>
                <input
                  type="number"
                  min="1"
                  max="125"
                  value={childrenServed}
                  onChange={(e) => setChildrenServed(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Live Result Tile */}
            <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-500/20 grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold uppercase">
                  Supplied / Child
                </div>
                <div className="text-xl font-bold font-mono text-teal-900 dark:text-teal-100 tabular-nums">
                  {liveCalc.perChildKcal}{' '}
                  <span className="text-xs font-normal">kcal</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold uppercase">
                  Total Kitchen Supply
                </div>
                <div className="text-xl font-bold font-mono text-teal-900 dark:text-teal-100 tabular-nums">
                  {liveCalc.totalKcal.toLocaleString()}{' '}
                  <span className="text-xs font-normal">kcal</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddMealItem}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Today&apos;s Meal Ledger</span>
            </button>
          </div>

          {/* Today's Logged Items Summary */}
          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-neutral-800 dark:text-neutral-200">
                Today&apos;s Menu Supplied ({loggedItems.length} Items)
              </span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-bold">
                Total: {totalCaloriesSuppliedPerChild} kcal / child
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {loggedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/40 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {item.food.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">
                      {item.grams}g × {item.children} children
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {item.perChildKcal} kcal
                    </span>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {item.totalKcal.toLocaleString()} tot
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recharts Visualization Tabs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-4">
            {/* Chart Sub-tabs & Accessibility Switch */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1 p-1 bg-neutral-200/50 dark:bg-neutral-800 rounded-lg text-xs">
                <button
                  onClick={() => setActiveChartTab('category')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                    activeChartTab === 'category'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <PieIcon className="w-3.5 h-3.5" />
                  <span>Category (Donut)</span>
                </button>
                <button
                  onClick={() => setActiveChartTab('daily')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                    activeChartTab === 'daily'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Daily Stacked</span>
                </button>
                <button
                  onClick={() => setActiveChartTab('target')}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1.5 ${
                    activeChartTab === 'target'
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Target Band</span>
                </button>
              </div>

              {/* Accessible Table Fallback Toggle */}
              <button
                onClick={() => setShowTableFallback(!showTableFallback)}
                className="px-2.5 py-1 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 flex items-center gap-1"
                title="Toggle accessible table view"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>{showTableFallback ? 'Show Chart' : 'Accessible Table'}</span>
              </button>
            </div>

            {/* View 1: Donut Chart (Calories by Food Category) */}
            {activeChartTab === 'category' && !showTableFallback && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val} kcal / child`, 'Energy Supplied']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => <span className="text-[11px] text-neutral-600 dark:text-neutral-400">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 2: Daily Calories by Meal Type (Stacked Bar) */}
            {activeChartTab === 'daily' && !showTableFallback && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStackedData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                          {value === 'lunch' ? 'Lunch (kcal)' : 'Morning Snack (kcal)'}
                        </span>
                      )}
                    />
                    <Bar dataKey="lunch" stackId="a" fill="#0d9488" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="snack" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* View 3: Weekly Calories Against Upper Primary Target (Line with Target Band) */}
            {activeChartTab === 'target' && !showTableFallback && (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTargetData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis domain={[500, 950]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="maxTarget"
                      stroke="#4338ca"
                      fill="#4338ca"
                      fillOpacity={0.12}
                      name="Recommended Band (650–850 kcal)"
                    />
                    <Line
                      type="monotone"
                      dataKey="supplied"
                      stroke="#0d9488"
                      strokeWidth={3}
                      name="Actual Supplied per Child"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Accessible Table Fallback for Screen Readers and Table View */}
            {showTableFallback && (
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                      <th className="p-2 font-semibold">Category / Dimension</th>
                      <th className="p-2 font-semibold font-mono text-right">Value (kcal / child)</th>
                      <th className="p-2 font-semibold">Target Standard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {categoryData.map((row) => (
                      <tr key={row.name}>
                        <td className="p-2 text-neutral-800 dark:text-neutral-200">{row.name}</td>
                        <td className="p-2 font-mono text-right font-bold tabular-nums">{row.value}</td>
                        <td className="p-2 text-neutral-500">ICMR Upper Primary Lunch</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
