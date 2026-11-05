/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Teacher Dashboard: The flagship view of YuvaPoshan
 * Roll Call 125 students, live SVG ring, optimistic auto-save & offline sync,
 * consecutive absence alerts, meal calorie log, and undo toasts.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  CloudCheck, 
  CloudOff,
  AlertCircle,
  HelpCircle,
  CalendarDays
} from 'lucide-react';
import { Student } from '../../data/seedStudents';
import { AttendanceStatus, computeAttendanceSummary, detectConsecutiveAbsences } from '../../utils/attendance';
import { AttendanceRing } from './AttendanceRing';
import { RollCallGrid } from './RollCallGrid';
import { ConsecutiveAbsenceAlerts } from './ConsecutiveAbsenceAlerts';
import { MealCalorieLog } from './MealCalorieLog';
import { MealInspectionHero } from '../meals/MealInspectionHero';
import { StudentHeatmapModal } from './StudentHeatmapModal';
import { SupportedLanguage, TRANSLATIONS } from '../../data/i18n';
import { FeedbackSummaryMetrics } from '../../utils/feedback';
import { useAuth } from '../../context/AuthContext';
import { saveAttendanceRecord, subscribeToAttendanceRecord } from '../../lib/firestoreService';

interface TeacherDashboardProps {
  students: Student[];
  currentLang: SupportedLanguage;
  isOnline: boolean;
  onOpenHelp: () => void;
  onOpenFeedbackModal: () => void;
  feedbackMetrics: FeedbackSummaryMetrics;
  onOpenAssistant: () => void;
  onOpenGallery?: () => void;
  onOpenWeeklyPlan?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  currentLang,
  isOnline,
  onOpenHelp,
  onOpenFeedbackModal,
  feedbackMetrics,
  onOpenAssistant,
  onOpenGallery,
  onOpenWeeklyPlan,
}) => {
  const t = TRANSLATIONS[currentLang];
  const [activeSection, setActiveSection] = useState<'5A' | '6A' | '7A' | '8A'>('6A');

  const { currentUser } = useAuth();

  // Filter 125 students for this section
  const sectionStudents = students.filter((s) => s.section === activeSection);

  // Initialize attendance state for today
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>(() => {
    // Check localStorage first
    const saved = localStorage.getItem(`yuva_attendance_${activeSection}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    const initial: Record<string, AttendanceStatus> = {};
    sectionStudents.forEach((s) => {
      // Seed initial realistic roll
      initial[s.id] = s.attendanceHistory['2026-10-24'] || 'present';
    });
    return initial;
  });

  // Undo history stack
  const [undoHistory, setUndoHistory] = useState<Array<{ studentId: string; prevStatus: AttendanceStatus }>>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');

  // Selected student for heatmap inspection modal
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [focusedStudentId, setFocusedStudentId] = useState<string | null>(sectionStudents[0]?.id || null);

  // Bulk action confirmation dialog
  const [bulkActionConfirm, setBulkActionConfirm] = useState<'all_present' | 'copy_yesterday' | null>(null);

  // When active section changes or user authenticates, subscribe to Firestore and load cached attendance
  useEffect(() => {
    let unsubscribe = () => {};
    if (currentUser) {
      unsubscribe = subscribeToAttendanceRecord(activeSection, '2026-10-27', (remoteData) => {
        if (remoteData) {
          setAttendanceState(remoteData);
          localStorage.setItem(`yuva_attendance_${activeSection}`, JSON.stringify(remoteData));
        }
      });
    }

    const saved = localStorage.getItem(`yuva_attendance_${activeSection}`);
    if (saved) {
      try {
        setAttendanceState(JSON.parse(saved));
        setFocusedStudentId(sectionStudents[0]?.id || null);
        return () => unsubscribe();
      } catch {}
    }
    const initial: Record<string, AttendanceStatus> = {};
    sectionStudents.forEach((s) => {
      initial[s.id] = s.attendanceHistory['2026-10-24'] || 'present';
    });
    setAttendanceState(initial);
    setFocusedStudentId(sectionStudents[0]?.id || null);

    return () => unsubscribe();
  }, [activeSection, currentUser]);

  // Save to localStorage and Firestore whenever attendance changes
  const persistAttendance = (newState: Record<string, AttendanceStatus>) => {
    setSaveStatus('saving');
    localStorage.setItem(`yuva_attendance_${activeSection}`, JSON.stringify(newState));

    const summaryMetrics = computeAttendanceSummary(newState, sectionStudents.length);
    saveAttendanceRecord(
      activeSection,
      '2026-10-27',
      newState,
      {
        present: summaryMetrics.present,
        absent: summaryMetrics.absent,
        late: summaryMetrics.late,
        excused: summaryMetrics.excused,
      },
      currentUser?.uid || 'teacher-042'
    ).catch(() => {});

    setTimeout(() => {
      setSaveStatus('saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 280);
  };

  const handleStatusChange = (
    studentId: string,
    newStatus: AttendanceStatus,
    previousStatus: AttendanceStatus
  ) => {
    const updated = { ...attendanceState, [studentId]: newStatus };
    setAttendanceState(updated);
    persistAttendance(updated);

    // Push to undo stack
    setUndoHistory((prev) => [...prev.slice(-9), { studentId, prevStatus: previousStatus }]);

    // Show undo toast
    const targetStudent = sectionStudents.find((s) => s.id === studentId);
    showToast(`Marked ${targetStudent?.name || studentId} as ${newStatus.toUpperCase()}`, studentId, previousStatus);
  };

  const showToast = (msg: string, studentId?: string, prevStatus?: AttendanceStatus) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUndo = () => {
    if (undoHistory.length === 0) return;
    const lastAction = undoHistory[undoHistory.length - 1];
    setUndoHistory((prev) => prev.slice(0, -1));

    const updated = { ...attendanceState, [lastAction.studentId]: lastAction.prevStatus };
    setAttendanceState(updated);
    persistAttendance(updated);
    setToastMessage(`Undid change for student ${lastAction.studentId}`);
  };

  const handleExecuteBulkAction = () => {
    if (bulkActionConfirm === 'all_present') {
      const updated: Record<string, AttendanceStatus> = {};
      sectionStudents.forEach((s) => {
        updated[s.id] = 'present';
      });
      setAttendanceState(updated);
      persistAttendance(updated);
      showToast('All 125 students marked Present today.');
    } else if (bulkActionConfirm === 'copy_yesterday') {
      const updated: Record<string, AttendanceStatus> = {};
      sectionStudents.forEach((s) => {
        const yest = s.attendanceHistory['2026-10-24'] || 'present';
        updated[s.id] = yest;
      });
      setAttendanceState(updated);
      persistAttendance(updated);
      showToast("Copied yesterday's attendance roll.");
    }
    setBulkActionConfirm(null);
  };

  // Metrics summary
  const summary = computeAttendanceSummary(attendanceState, sectionStudents.length);

  // Consecutive absence alerts
  const studentAbsenceHistory: Record<string, Record<string, AttendanceStatus>> = {};
  sectionStudents.forEach((s) => {
    studentAbsenceHistory[s.id] = s.attendanceHistory;
  });
  const alerts = detectConsecutiveAbsences(sectionStudents, studentAbsenceHistory, 3);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner: Section Switcher & Live Roll Call Overview */}
      <div className="glass-panel p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {t.todays_roll_call}
            </h2>
          </div>
          <div className="text-xs text-neutral-500 flex items-center gap-3">
            <span>Morning Roll Call Session · Upper Primary</span>
            <span>·</span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Section Selector */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">Section:</span>
            {(['5A', '6A', '7A', '8A'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSection(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                  activeSection === sec
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                Grade {sec} (125)
              </button>
            ))}
          </div>
        </div>

        {/* Live Attendance Ring & Status Counter */}
        <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-200 dark:border-neutral-800">
          <AttendanceRing
            present={summary.present}
            absent={summary.absent}
            late={summary.late}
            excused={summary.excused}
            total={summary.total}
            ratePercent={summary.attendanceRatePercent}
          />

          {/* Auto-save & Sync Indicator Tile */}
          <div className="flex flex-col items-end gap-1 text-right text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              {isOnline ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CloudCheck className="w-4 h-4" />
                  <span>{saveStatus === 'saving' ? t.saving : `${t.saved_just_now} (${lastSavedTime})`}</span>
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 text-[11px]">
                  <CloudOff className="w-4 h-4" />
                  <span>{t.offline_mode}</span>
                </span>
              )}
            </div>

            {undoHistory.length > 0 && (
              <button
                onClick={handleUndo}
                className="mt-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-700 dark:text-neutral-300 flex items-center gap-1 transition-colors"
                title="Undo last change (Cmd+Z)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3+ Consecutive Absences Alert Panel */}
      <ConsecutiveAbsenceAlerts
        alerts={alerts}
        onLogFollowUp={(id, note) => {
          showToast(`Logged parent follow-up note for student ${id}`);
        }}
        onSelectStudent={(id) => {
          const s = sectionStudents.find((item) => item.id === id);
          if (s) setSelectedStudent(s);
        }}
      />

      {/* Main 125-Student Roll Call Grid */}
      <RollCallGrid
        students={sectionStudents}
        attendanceState={attendanceState}
        onStatusChange={handleStatusChange}
        onSelectStudent={(s) => setSelectedStudent(s)}
        onOpenBulkConfirm={(action) => setBulkActionConfirm(action)}
        focusedStudentId={focusedStudentId}
        onFocusStudent={(id) => setFocusedStudentId(id)}
      />

      {/* Mid-Day Meal Background Hero & Kitchen Quality Inspection */}
      <MealInspectionHero
        onOpenFeedbackModal={onOpenFeedbackModal}
        feedbackMetrics={feedbackMetrics}
        onOpenAssistant={onOpenAssistant}
        onOpenGallery={onOpenGallery}
        onOpenWeeklyPlan={onOpenWeeklyPlan}
      />

      {/* Mid-Day Meal Nutrition & Calorie Ledger */}
      <MealCalorieLog presentStudentsCount={summary.present} />

      {/* Student 14-Day Heatmap & Growth Modal */}
      <StudentHeatmapModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        currentStatus={selectedStudent ? attendanceState[selectedStudent.id] || 'present' : 'present'}
        onUpdateStatus={(id, st) => {
          const prev = attendanceState[id] || 'present';
          handleStatusChange(id, st, prev);
        }}
      />

      {/* Bulk Action Confirmation Sheet / Modal */}
      {bulkActionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel-elevated w-full max-w-sm p-6 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white mb-2">
              {bulkActionConfirm === 'all_present'
                ? 'Mark All 125 Students Present?'
                : "Copy Yesterday's Attendance Roll?"}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5">
              {bulkActionConfirm === 'all_present'
                ? 'This will update all student cards in Grade ' + activeSection + ' to Present. You can still modify individual cards afterwards.'
                : "This will replicate yesterday's attendance statuses for all students in Grade " + activeSection + '.'}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setBulkActionConfirm(null)}
                className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteBulkAction}
                className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
              >
                Confirm Bulk Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Undo Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
          <span>{toastMessage}</span>
          {undoHistory.length > 0 && (
            <button
              onClick={handleUndo}
              className="font-bold underline text-teal-400 dark:text-teal-700 hover:opacity-80"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
};
