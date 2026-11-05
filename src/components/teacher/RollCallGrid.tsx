/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * High-performance Roll Call Grid for 125 Section Students
 * Supports 1-tap cycling, keyboard shortcuts (P/A/L/E), spring feedback,
 * fuzzy search filter, status filter, and student inspector trigger.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Sparkles, Check, X, Clock, ShieldAlert, ArrowUpDown, Undo2 } from 'lucide-react';
import { Student } from '../../data/seedStudents';
import { AttendanceStatus, getNextAttendanceStatus } from '../../utils/attendance';
import { fuzzyStudentMatch } from '../../utils/search';

interface RollCallGridProps {
  students: Student[];
  attendanceState: Record<string, AttendanceStatus>;
  onStatusChange: (studentId: string, newStatus: AttendanceStatus, previousStatus: AttendanceStatus) => void;
  onSelectStudent: (student: Student) => void;
  onOpenBulkConfirm: (action: 'all_present' | 'copy_yesterday') => void;
  focusedStudentId: string | null;
  onFocusStudent: (id: string | null) => void;
}

export const RollCallGrid: React.FC<RollCallGridProps> = ({
  students,
  attendanceState,
  onStatusChange,
  onSelectStudent,
  onOpenBulkConfirm,
  focusedStudentId,
  onFocusStudent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus | 'flagged'>('all');
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [lastTappedId, setLastTappedId] = useState<string | null>(null);

  // Global keyboard listener for P, A, L, E when a student is focused or hovered
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (!focusedStudentId) return;

      const key = e.key.toLowerCase();
      let targetStatus: AttendanceStatus | null = null;
      if (key === 'p') targetStatus = 'present';
      else if (key === 'a') targetStatus = 'absent';
      else if (key === 'l') targetStatus = 'late';
      else if (key === 'e') targetStatus = 'excused';

      if (targetStatus) {
        e.preventDefault();
        const prev = attendanceState[focusedStudentId] || 'present';
        onStatusChange(focusedStudentId, targetStatus, prev);
        setLastTappedId(focusedStudentId);
        setTimeout(() => setLastTappedId(null), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedStudentId, attendanceState, onStatusChange]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Search filter
        if (searchQuery.trim()) {
          const match = fuzzyStudentMatch(searchQuery, s.name, s.id, s.nativeName);
          if (!match.matches) return false;
        }

        // Status filter
        if (statusFilter !== 'all') {
          if (statusFilter === 'flagged') {
            return s.bmi < 15.0 || s.bmi > 24.5;
          }
          const current = attendanceState[s.id] || 'present';
          if (current !== statusFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a.id.localeCompare(b.id);
      });
  }, [students, searchQuery, statusFilter, sortBy, attendanceState]);

  const handleCardClick = (student: Student) => {
    onFocusStudent(student.id);
    const current = attendanceState[student.id] || 'present';
    const next = getNextAttendanceStatus(current);
    onStatusChange(student.id, next, current);
    setLastTappedId(student.id);
    setTimeout(() => setLastTappedId(null), 250);
  };

  return (
    <div className="glass-panel p-4 md:p-6 space-y-4">
      {/* Top Toolbar: Filter, Search, Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
        {/* Search & Active Counts */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter section (e.g. Lakshmi, Laxmi, 042)..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'id' ? 'name' : 'id')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/60 text-xs text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 flex items-center gap-1 shrink-0"
            title={`Sort by: ${sortBy === 'id' ? 'Roll ID' : 'Student Name'}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="font-mono uppercase text-[10px]">{sortBy}</span>
          </button>
        </div>

        {/* Filter Tabs & Bulk Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-neutral-200/50 dark:bg-neutral-800/60 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('absent')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'absent'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              Absent
            </button>
            <button
              onClick={() => setStatusFilter('late')}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                statusFilter === 'late'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              Late
            </button>
          </div>

          {/* Bulk Action Buttons */}
          <button
            onClick={() => onOpenBulkConfirm('all_present')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-xs whitespace-nowrap"
          >
            Mark All Present
          </button>
          <button
            onClick={() => onOpenBulkConfirm('copy_yesterday')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors whitespace-nowrap"
          >
            Copy Yesterday
          </button>
        </div>
      </div>

      {/* Keyboard Shortcut Hint Banner */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
        <span>
          Showing <strong className="font-mono text-neutral-800 dark:text-neutral-200">{filteredStudents.length}</strong> of 125 students in this section.
        </span>
        <span className="hidden sm:inline text-teal-700 dark:text-teal-300">
          Tip: Tap any student to toggle status, or click to focus and press <kbd className="font-mono font-bold">P</kbd>, <kbd className="font-mono font-bold">A</kbd>, <kbd className="font-mono font-bold">L</kbd>, <kbd className="font-mono font-bold">E</kbd>
        </span>
      </div>

      {/* High-Density 125 Student Roll Call Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
        {filteredStudents.map((student) => {
          const currentStatus = attendanceState[student.id] || 'present';
          const isFocused = focusedStudentId === student.id;
          const isTapped = lastTappedId === student.id;

          // Badges and styles
          let statusBg = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
          let statusBadge = 'P · Present';
          if (currentStatus === 'absent') {
            statusBg = 'border-rose-500/60 bg-rose-500/15 text-rose-700 dark:text-rose-300';
            statusBadge = 'A · Absent';
          } else if (currentStatus === 'late') {
            statusBg = 'border-amber-500/60 bg-amber-500/15 text-amber-700 dark:text-amber-300';
            statusBadge = 'L · Late';
          } else if (currentStatus === 'excused') {
            statusBg = 'border-indigo-500/60 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300';
            statusBadge = 'E · Excused';
          }

          return (
            <div
              key={student.id}
              tabIndex={0}
              onFocus={() => onFocusStudent(student.id)}
              className={`group relative p-2.5 rounded-xl border text-xs select-none transition-all duration-150 cursor-pointer ${
                statusBg
              } ${
                isFocused
                  ? 'ring-2 ring-teal-500 ring-offset-1 dark:ring-offset-neutral-900'
                  : 'hover:shadow-md'
              } ${isTapped ? 'scale-95' : 'scale-100'}`}
              onClick={() => handleCardClick(student)}
            >
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-neutral-900 dark:text-white truncate text-[13px]">
                    {student.name}
                  </div>
                  {student.nativeName && (
                    <div className="text-[10px] text-neutral-500 truncate">
                      {student.nativeName}
                    </div>
                  )}
                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                    {student.id} · Age {student.age}
                  </div>
                </div>

                {/* Status indicator capsule */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-tight uppercase shadow-2xs">
                    {statusBadge}
                  </span>
                  
                  {/* Quick info inspector trigger button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStudent(student);
                    }}
                    className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline opacity-80 group-hover:opacity-100 mt-1"
                    title="View 14-day heatmap & growth"
                  >
                    Heatmap →
                  </button>
                </div>
              </div>

              {/* Status cycle hint on bottom border */}
              <div className="mt-2 pt-1 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[9px] text-neutral-400">
                <span>Click to cycle</span>
                <span className="font-mono font-bold text-neutral-600 dark:text-neutral-300">
                  {currentStatus === 'present' ? '→ Absent' : currentStatus === 'absent' ? '→ Late' : currentStatus === 'late' ? '→ Excused' : '→ Present'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="p-12 text-center text-xs text-neutral-500">
          No students found matching your search or active filter.
        </div>
      )}
    </div>
  );
};
