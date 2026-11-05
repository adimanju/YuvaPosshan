/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Command Palette (Cmd/Ctrl + K) with phonetic South Indian search,
 * quick page jumping, and direct roll call actions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, User, CheckCircle2, Moon, Sun, ArrowRight, X } from 'lucide-react';
import { Student } from '../../data/seedStudents';
import { fuzzyStudentMatch } from '../../utils/search';
import { AttendanceStatus } from '../../utils/attendance';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onQuickMarkAllPresent: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  onNavigateRole: (role: 'teacher' | 'admin' | 'parent') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  students,
  onSelectStudent,
  onQuickMarkAllPresent,
  onToggleTheme,
  isDark,
  onNavigateRole,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter students using fuzzy phonetic match
  const filteredStudents = query.trim()
    ? students
        .filter((s) => fuzzyStudentMatch(query, s.name, s.id, s.nativeName).matches)
        .slice(0, 8)
    : [];

  const actions = [
    {
      id: 'mark-all-present',
      title: 'Mark all students present today',
      category: 'Attendance Action',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      run: () => {
        onQuickMarkAllPresent();
        onClose();
      },
    },
    {
      id: 'go-teacher',
      title: 'Jump to Teacher Roll Call (Grade 6A)',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-teal-500" />,
      run: () => {
        onNavigateRole('teacher');
        onClose();
      },
    },
    {
      id: 'go-admin',
      title: 'Jump to Headmaster / Admin Overview',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-indigo-500" />,
      run: () => {
        onNavigateRole('admin');
        onClose();
      },
    },
    {
      id: 'go-parent',
      title: "Jump to Parent Portal (Lakshmi's Profile)",
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-amber-500" />,
      run: () => {
        onNavigateRole('parent');
        onClose();
      },
    },
    {
      id: 'toggle-theme',
      title: isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      category: 'Preferences',
      icon: isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />,
      run: () => {
        onToggleTheme();
        onClose();
      },
    },
  ];

  const filteredActions = query.trim()
    ? actions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
    : actions;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-panel-elevated w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type student name (Laxmi, Karthik...), ID (YP-6A-012), or action..."
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
            aria-label="Search students and commands"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-500 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-neutral-100 dark:divide-neutral-900">
          {/* Student Search Results */}
          {filteredStudents.length > 0 && (
            <div className="pb-2">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Matching Students ({filteredStudents.length})
              </div>
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => {
                    onSelectStudent(student);
                    onClose();
                  }}
                  className="w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between hover:bg-teal-500/10 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <span>{student.name}</span>
                        {student.nativeName && (
                          <span className="text-[11px] text-neutral-400 font-normal">
                            ({student.nativeName})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Section {student.section} · ID: {student.id} · Age {student.age}y
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Focus card →
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Actions & Navigation
            </div>
            {filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={action.run}
                className="w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between hover:bg-teal-500/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800">
                    {action.icon}
                  </div>
                  <div>
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      {action.title}
                    </span>
                    <span className="ml-2 text-[10px] text-neutral-400">
                      {action.category}
                    </span>
                  </div>
                </div>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded">
                  ↵
                </kbd>
              </button>
            ))}
          </div>

          {filteredStudents.length === 0 && filteredActions.length === 0 && (
            <div className="p-6 text-center text-xs text-neutral-500">
              No students or actions match &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
