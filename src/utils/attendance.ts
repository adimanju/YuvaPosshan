/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan Attendance Statistics, Roll Call Logic, and Alert Engine
 */

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  loggedBy: string; // Teacher or Admin ID
  updatedAt: string; // ISO string
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRatePercent: number; // (present + late) / total * 100
  effectivePresentPercent: number;
}

export interface StudentAbsenceAlert {
  studentId: string;
  studentName: string;
  section: string;
  consecutiveAbsences: number;
  lastContactDate: string | null;
  lastStatusDate: string;
  followUpLogged: boolean;
  followUpNotes?: string;
}

/**
 * Computes attendance summary metrics for roll call
 */
export function computeAttendanceSummary(
  statuses: Record<string, AttendanceStatus> | AttendanceStatus[],
  totalStudentsCount?: number
): AttendanceSummary {
  const statusList = Array.isArray(statuses) ? statuses : Object.values(statuses);
  const total = totalStudentsCount ?? statusList.length;

  let present = 0;
  let absent = 0;
  let late = 0;
  let excused = 0;

  for (const s of statusList) {
    if (s === 'present') present++;
    else if (s === 'absent') absent++;
    else if (s === 'late') late++;
    else if (s === 'excused') excused++;
  }

  const attendanceRatePercent =
    total > 0 ? Number((((present + late) / total) * 100).toFixed(1)) : 0;
  const effectivePresentPercent =
    total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;

  return {
    total,
    present,
    absent,
    late,
    excused,
    attendanceRatePercent,
    effectivePresentPercent,
  };
}

/**
 * Next status cycle when tapping student card:
 * present -> absent -> late -> excused -> present
 */
export function getNextAttendanceStatus(current: AttendanceStatus): AttendanceStatus {
  switch (current) {
    case 'present':
      return 'absent';
    case 'absent':
      return 'late';
    case 'late':
      return 'excused';
    case 'excused':
      return 'present';
    default:
      return 'present';
  }
}

/**
 * Detects students with 3 or more consecutive absences across historical attendance dates
 * (Sorted most recent first).
 */
export function detectConsecutiveAbsences(
  students: Array<{ id: string; name: string; section: string; lastContactDate?: string }>,
  history: Record<string, Record<string, AttendanceStatus>>, // studentId -> (date -> status)
  minConsecutiveDays: number = 3
): StudentAbsenceAlert[] {
  const alerts: StudentAbsenceAlert[] = [];

  for (const student of students) {
    const studentHistory = history[student.id];
    if (!studentHistory) continue;

    // Sort dates descending
    const dates = Object.keys(studentHistory).sort().reverse();
    let consecutiveCount = 0;
    let lastStatusDate = dates[0] || 'Today';

    for (const date of dates) {
      const status = studentHistory[date];
      if (status === 'absent') {
        consecutiveCount++;
      } else {
        // Break sequence if present, late, or excused
        break;
      }
    }

    if (consecutiveCount >= minConsecutiveDays) {
      alerts.push({
        studentId: student.id,
        studentName: student.name,
        section: student.section,
        consecutiveAbsences: consecutiveCount,
        lastContactDate: student.lastContactDate || null,
        lastStatusDate,
        followUpLogged: false,
      });
    }
  }

  return alerts;
}
