/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Student Attendance Heatmap & Physical Metrics Profile Modal
 */

import React from 'react';
import { X, Calendar, Activity, AlertCircle, Phone, UserCheck } from 'lucide-react';
import { Student } from '../../data/seedStudents';
import { AttendanceStatus } from '../../utils/attendance';
import { evaluateGrowthIndicator } from '../../utils/growth';

interface StudentHeatmapModalProps {
  student: Student | null;
  onClose: () => void;
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => void;
  currentStatus: AttendanceStatus;
}

export const StudentHeatmapModal: React.FC<StudentHeatmapModalProps> = ({
  student,
  onClose,
  onUpdateStatus,
  currentStatus,
}) => {
  if (!student) return null;

  const growth = evaluateGrowthIndicator(student.bmi, student.age, student.gender);
  const dates = Object.keys(student.attendanceHistory).sort();

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-panel-elevated w-full max-w-lg p-6 relative shadow-2xl animate-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                {student.name}
              </h3>
              {student.nativeName && (
                <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
                  ({student.nativeName})
                </span>
              )}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5">
              ID: <span className="font-mono text-neutral-700 dark:text-neutral-300">{student.id}</span> · Section {student.section} · Age {student.age}y ({student.gender})
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close heatmap modal"
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Growth & Health Overview (Strictly informational) */}
        <div className="mt-4 p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Growth Guidepost (School Record)
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                growth.isFlaggedForReview
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              {growth.categoryLabel}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white dark:bg-neutral-900">
              <div className="text-[10px] text-neutral-400 uppercase font-medium">Height</div>
              <div className="font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                {student.heightCm} cm
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-neutral-900">
              <div className="text-[10px] text-neutral-400 uppercase font-medium">Weight</div>
              <div className="font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                {student.weightKg} kg
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-neutral-900">
              <div className="text-[10px] text-neutral-400 uppercase font-medium">BMI</div>
              <div className="font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
                {student.bmi}
              </div>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-2 italic">
            * {growth.disclaimer}
          </p>
        </div>

        {/* 14-Day Attendance Heatmap Calendar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Recent Attendance History (14-Day Heatmap)
            </span>
            <span className="text-[11px] text-neutral-400">Past two weeks</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            {dates.map((date) => {
              const status = student.attendanceHistory[date];
              let bg = 'bg-emerald-500';
              let label = 'Present';
              if (status === 'absent') {
                bg = 'bg-rose-500';
                label = 'Absent';
              } else if (status === 'late') {
                bg = 'bg-amber-500';
                label = 'Late';
              } else if (status === 'excused') {
                bg = 'bg-indigo-500';
                label = 'Excused';
              }

              const day = date.split('-')[2];

              return (
                <div
                  key={date}
                  className="group relative flex flex-col items-center justify-center p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700/60 text-center cursor-default hover:border-teal-500 transition-colors"
                >
                  <span className="text-[10px] text-neutral-500 font-mono mb-1">{day}</span>
                  <div className={`w-3.5 h-3.5 rounded-full ${bg} transition-transform group-hover:scale-125`}></div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-1 hidden group-hover:block z-10 px-2 py-1 rounded bg-neutral-900 text-white text-[10px] font-medium whitespace-nowrap shadow-lg">
                    {date}: {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Status Override */}
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-neutral-500">Today&apos;s Status:</span>
            <span className="ml-2 font-bold uppercase font-mono text-teal-600 dark:text-teal-400">
              {currentStatus}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateStatus(student.id, 'present')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentStatus === 'present'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              P
            </button>
            <button
              onClick={() => onUpdateStatus(student.id, 'absent')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentStatus === 'absent'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
              }`}
            >
              A
            </button>
            <button
              onClick={() => onUpdateStatus(student.id, 'late')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentStatus === 'late'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              L
            </button>
            <button
              onClick={() => onUpdateStatus(student.id, 'excused')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currentStatus === 'excused'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              E
            </button>
          </div>
        </div>

        {/* Parent Contact Card */}
        <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-800/40 text-xs">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span>Parent: {student.parentName} ({student.parentPhone})</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Verified Link</span>
        </div>
      </div>
    </div>
  );
};
