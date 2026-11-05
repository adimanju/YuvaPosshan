/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Consecutive Absences Alert Panel (flags 3+ consecutive days)
 * With last contact date and one-tap "Log follow-up" action dialog.
 */

import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, CheckCircle, MessageSquare, Clock, X } from 'lucide-react';
import { StudentAbsenceAlert } from '../../utils/attendance';

interface ConsecutiveAbsenceAlertsProps {
  alerts: StudentAbsenceAlert[];
  onLogFollowUp: (studentId: string, notes: string) => void;
  onSelectStudent: (studentId: string) => void;
}

export const ConsecutiveAbsenceAlerts: React.FC<ConsecutiveAbsenceAlertsProps> = ({
  alerts,
  onLogFollowUp,
  onSelectStudent,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<StudentAbsenceAlert | null>(null);
  const [notes, setNotes] = useState('');

  if (alerts.length === 0) {
    return (
      <div className="glass-panel p-4 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="font-medium">
            Zero attendance risk alerts: All section students have attended regularly over the past 3 days.
          </span>
        </div>
      </div>
    );
  }

  const handleSaveFollowUp = () => {
    if (selectedAlert) {
      onLogFollowUp(selectedAlert.studentId, notes || 'Parent contacted via phone. Reason recorded.');
      setSelectedAlert(null);
      setNotes('');
    }
  };

  return (
    <>
      <div className="glass-panel p-4 border-amber-300/40 dark:border-amber-700/40 bg-amber-50/40 dark:bg-amber-950/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-neutral-900 dark:text-white">
                Consecutive Absences Alert ({alerts.length} Students)
              </h3>
              <p className="text-[11px] text-neutral-500">
                Children absent 3 or more consecutive school days requiring pastoral contact
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.studentId}
              className="p-3 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between shadow-xs hover:border-amber-400 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      onClick={() => onSelectStudent(alert.studentId)}
                      className="font-bold text-xs text-neutral-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 text-left"
                    >
                      {alert.studentName}
                    </button>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      {alert.studentId} · Section {alert.section}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 font-mono">
                    {alert.consecutiveAbsences} days absent
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>
                    Last contact:{' '}
                    <strong className="text-neutral-700 dark:text-neutral-300">
                      {alert.lastContactDate || 'No record'}
                    </strong>
                  </span>
                </div>

                {alert.followUpLogged && (
                  <div className="mt-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Follow-up logged today</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedAlert(alert)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Log Follow-up</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Follow-up Dialog */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel-elevated w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-teal-600" />
                Log Parent Follow-up: {selectedAlert.studentName}
              </h4>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400">
                Child has been absent for <strong>{selectedAlert.consecutiveAbsences} consecutive days</strong>. Confirm communication with parent or guardian to ensure student well-being.
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Follow-up Notes / Reason for Absence
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Parent stated child had mild viral fever; expected to return on Monday."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-3 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFollowUp}
                  className="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
                >
                  Save to Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
