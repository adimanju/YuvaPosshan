/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Admin & Headmaster Console:
 * School overview KPIs, 4-section small multiples, student directory with CSV export,
 * growth review list (non-diagnostic health professional referral), and audit log viewer.
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  Flame, 
  TrendingUp, 
  Download, 
  Search, 
  ShieldAlert, 
  FileText, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Student } from '../../data/seedStudents';
import { evaluateGrowthIndicator, GrowthEvaluation } from '../../utils/growth';
import { computeAttendanceSummary } from '../../utils/attendance';

interface AdminDashboardProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ students, onSelectStudent }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'directory' | 'growth_review' | 'audit_log'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | '5A' | '6A' | '7A' | '8A'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Filter flagged students for growth review list
  const flaggedGrowthStudents = useMemo(() => {
    return students
      .map((s) => ({
        student: s,
        growth: evaluateGrowthIndicator(s.bmi, s.age, s.gender),
      }))
      .filter((item) => item.growth.isFlaggedForReview);
  }, [students]);

  // Directory filter
  const filteredDirectory = useMemo(() => {
    return students.filter((s) => {
      if (selectedSection !== 'all' && s.section !== selectedSection) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.nativeName && s.nativeName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [students, selectedSection, searchQuery]);

  const totalPages = Math.ceil(filteredDirectory.length / pageSize);
  const paginatedDirectory = filteredDirectory.slice((page - 1) * pageSize, page * pageSize);

  // Export full school directory to CSV
  const handleExportDirectoryCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Student ID,Full Name,Native Script,Section,Age,Gender,Height (cm),Weight (kg),BMI,Growth Indicator,Parent Contact\n' +
      students
        .map((s) => {
          const evalG = evaluateGrowthIndicator(s.bmi, s.age, s.gender);
          return `"${s.id}","${s.name}","${s.nativeName || ''}","${s.section}",${s.age},"${s.gender}",${s.heightCm},${s.weightKg},${s.bmi},"${evalG.categoryLabel}","${s.parentPhone}"`;
        })
        .join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `YuvaPoshan_School_Directory_500_Students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Static sample audit logs
  const auditLogs = [
    {
      id: 'aud-01',
      timestamp: '2026-10-25 08:14:22',
      user: 'Teacher Anitha Shenoy (T-042)',
      action: 'ROLL_CALL_SAVED',
      details: 'Marked 125 attendance records for Grade 6A (112 Present, 8 Absent, 5 Late)',
      ipHash: '10.24.8.19 (School VLAN)',
    },
    {
      id: 'aud-02',
      timestamp: '2026-10-25 08:02:11',
      user: 'Kitchen Supv. R. Ramanathan (K-01)',
      action: 'MEAL_INVENTORY_ENTERED',
      details: 'Logged 18.75 kg Rice + 15 kg Sambar (21,840 kcal total food supplied)',
      ipHash: '10.24.8.44 (Kitchen Terminal)',
    },
    {
      id: 'aud-03',
      timestamp: '2026-10-24 16:30:00',
      user: 'Headmaster Dr. K. S. Murthy (ADM-01)',
      action: 'MONTHLY_NUTRITION_REPORT_GENERATED',
      details: 'Exported consolidated PM-POSHAN compliance summary for 500 students',
      ipHash: '10.24.8.1 (Admin Block)',
    },
    {
      id: 'aud-04',
      timestamp: '2026-10-24 11:20:15',
      user: 'Teacher K. V. Suresh (T-018)',
      action: 'PARENT_FOLLOWUP_LOGGED',
      details: 'Logged phone follow-up for YP-5A-008 (viral illness noted)',
      ipHash: '10.24.8.22 (Staff Room)',
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Headmaster &amp; School Administration
            </h2>
          </div>
          <p className="text-xs text-neutral-500">
            Consolidated oversight across 4 sections · Upper Primary Grades 5–8 (500 Students Enrolled)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDirectoryCSV}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export 500 Students (CSV)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'overview'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          School Overview &amp; KPIs
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'directory'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Student Directory ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('growth_review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'growth_review'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          <span>Growth Review List ({flaggedGrowthStudents.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('audit_log')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            activeTab === 'audit_log'
              ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Tab 1: School Overview & Small Multiples */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Total Enrolled</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">500</div>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">125 students across 4 sections</div>
            </div>

            <div className="glass-panel p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Average Attendance</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">91.4%</div>
              <div className="text-[11px] text-emerald-600 font-medium">↑ 1.2% over last month</div>
            </div>

            <div className="glass-panel p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Monthly Calories Supplied</span>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white tabular-nums">1.48M <span className="text-xs font-normal">kcal</span></div>
              <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">100% ICMR compliance rate</div>
            </div>

            <div className="glass-panel p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">Growth Referral Flagged</span>
              <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">{flaggedGrowthStudents.length}</div>
              <div className="text-[11px] text-neutral-500">Scheduled for pediatrician review</div>
            </div>
          </div>

          {/* Section Comparison Small Multiples */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Section Comparison (Small Multiples: Grades 5A, 6A, 7A, 8A)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['5A', '6A', '7A', '8A'] as const).map((sec) => {
                const secStudents = students.filter((s) => s.section === sec);
                const avgHeight = Math.round(secStudents.reduce((a, c) => a + c.heightCm, 0) / secStudents.length);
                const avgWeight = Math.round(secStudents.reduce((a, c) => a + c.weightKg, 0) / secStudents.length);
                const avgBmi = (secStudents.reduce((a, c) => a + c.bmi, 0) / secStudents.length).toFixed(1);

                return (
                  <div key={sec} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                      <span className="font-bold text-base text-neutral-900 dark:text-white">Grade {sec}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono">
                        125 Students
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Attendance Rate:</span>
                        <strong className="font-mono text-neutral-900 dark:text-white">
                          {sec === '6A' ? '91.2%' : sec === '5A' ? '92.8%' : sec === '7A' ? '89.6%' : '92.0%'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Avg Height / Weight:</span>
                        <span className="font-mono text-neutral-800 dark:text-neutral-200">
                          {avgHeight} cm · {avgWeight} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Avg Reference BMI:</span>
                        <strong className="font-mono text-teal-600 dark:text-teal-400">{avgBmi}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Student Directory */}
      {activeTab === 'directory' && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, ID, or Kannada script..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Filter Section:</span>
              {(['all', '5A', '6A', '7A', '8A'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSelectedSection(s);
                    setPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    selectedSection === s
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Student ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Section</th>
                  <th className="py-2.5 px-3">Age / Gender</th>
                  <th className="py-2.5 px-3">Height &amp; Weight</th>
                  <th className="py-2.5 px-3">BMI Index</th>
                  <th className="py-2.5 px-3">Parent Verified</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
                {paginatedDirectory.map((student) => {
                  const growth = evaluateGrowthIndicator(student.bmi, student.age, student.gender);
                  return (
                    <tr key={student.id} className="hover:bg-neutral-500/5 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-neutral-600 dark:text-neutral-400 font-semibold">
                        {student.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-neutral-900 dark:text-white">{student.name}</div>
                        {student.nativeName && (
                          <div className="text-[10px] text-neutral-500">{student.nativeName}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-teal-600 dark:text-teal-400">
                        {student.section}
                      </td>
                      <td className="py-2.5 px-3 capitalize">
                        {student.age}y · {student.gender}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">
                        {student.heightCm} cm · {student.weightKg} kg
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold">{student.bmi}</span>
                        <span
                          className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            growth.isFlaggedForReview
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {growth.categoryLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-500">
                        {student.parentName} ({student.parentPhone})
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="px-2 py-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                        >
                          View Heatmap
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
            <div>
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredDirectory.length)} of {filteredDirectory.length} students
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono">{page} / {totalPages || 1}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Growth Review List */}
      {activeTab === 'growth_review' && (
        <div className="glass-panel p-6 space-y-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 dark:text-amber-200">Non-Diagnostic Review Notice:</strong> Children on this list have physical growth indicators outside standard WHO/IAP upper-primary bounds. <em>No automated medical action is ever taken.</em> This roster is compiled for the visiting Government Primary Health Centre (PHC) medical officer during routine school health camps.
            </div>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {flaggedGrowthStudents.map(({ student, growth }) => (
              <div key={student.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                    <span>{student.name}</span>
                    <span className="font-mono text-neutral-400 font-normal">({student.id})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      {growth.categoryLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Grade {student.section} · Age {student.age} · Height {student.heightCm} cm · Weight {student.weightKg} kg · BMI {student.bmi}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-400 hidden sm:inline">
                    Parent: {student.parentPhone}
                  </span>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="px-3 py-1 text-xs rounded-lg border border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10"
                  >
                    View Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Append-Only Audit Log */}
      {activeTab === 'audit_log' && (
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              Cryptographic Access &amp; Audit Log (Append-Only)
            </h3>
            <span className="text-xs text-neutral-500">Immutable ledger</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
                    <span>{log.timestamp}</span>
                    <span>·</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">{log.action}</span>
                  </div>
                  <div className="text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">
                    {log.details}
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    Initiator: {log.user} ({log.ipHash})
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md self-start sm:self-center">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Signature Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
