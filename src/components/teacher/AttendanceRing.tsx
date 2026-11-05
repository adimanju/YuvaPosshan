/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Live SVG Attendance Ring
 * Shows (present + late) / total with smooth animated progress
 */

import React from 'react';

interface AttendanceRingProps {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  ratePercent: number;
}

export const AttendanceRing: React.FC<AttendanceRingProps> = ({
  present,
  absent,
  late,
  excused,
  total,
  ratePercent,
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ratePercent / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-neutral-200 dark:stroke-neutral-800"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="transition-all duration-300 ease-out"
            stroke="url(#attendanceGradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
          <defs>
            <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#4338ca" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center rate number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white tabular-nums">
            {ratePercent}%
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
            Present
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-neutral-600 dark:text-neutral-400">Present:</span>
          <strong className="font-mono text-neutral-900 dark:text-white tabular-nums">{present}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span className="text-neutral-600 dark:text-neutral-400">Absent:</span>
          <strong className="font-mono text-neutral-900 dark:text-white tabular-nums">{absent}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="text-neutral-600 dark:text-neutral-400">Late:</span>
          <strong className="font-mono text-neutral-900 dark:text-white tabular-nums">{late}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span className="text-neutral-600 dark:text-neutral-400">Excused:</span>
          <strong className="font-mono text-neutral-900 dark:text-white tabular-nums">{excused}</strong>
        </div>
      </div>
    </div>
  );
};
