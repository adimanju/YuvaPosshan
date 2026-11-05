/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Parent Portal (Mobile-First, Large Type, Simple Language)
 * Tailored for parents on older Android devices & low-bandwidth 4G.
 * Features linked child verification, attendance calendar, meals supplied,
 * growth trend guidepost with disclaimer, and absence notifications.
 */

import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Utensils, 
  Bell, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  Phone,
  CalendarDays,
  Camera
} from 'lucide-react';
import { Student } from '../../data/seedStudents';
import { evaluateGrowthIndicator } from '../../utils/growth';
import { SupportedLanguage, TRANSLATIONS } from '../../data/i18n';

interface ParentPortalProps {
  students: Student[];
  currentLang: SupportedLanguage;
  onOpenHelp: () => void;
  onOpenWeeklyPlan?: () => void;
  onOpenGallery?: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ 
  students, 
  currentLang,
  onOpenWeeklyPlan,
  onOpenGallery,
}) => {
  const t = TRANSLATIONS[currentLang];

  // Linked child ID (Demo parent Ramesh Gowda is linked to student Lakshmi Narayanan YP-6A-001)
  const [selectedChildId, setSelectedChildId] = useState<string>('YP-6A-001');
  const [activeTab, setActiveTab] = useState<'attendance' | 'meals' | 'growth' | 'notifications'>('attendance');

  // Notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      date: 'Today, 8:45 AM',
      title: 'Roll Call Marked: Present',
      body: 'Your child was safely marked Present in Grade 6A morning roll call.',
      isRead: false,
      type: 'attendance',
    },
    {
      id: 'notif-2',
      date: 'Yesterday, 12:30 PM',
      title: 'Mid-Day Lunch Provided',
      body: 'Today’s meal: Steamed Rice, Drumstick Sambar, and Boiled Egg (685 kcal supplied).',
      isRead: true,
      type: 'meal',
    },
    {
      id: 'notif-3',
      date: 'Oct 20, 2026',
      title: 'Health Checkup Record Updated',
      body: 'Annual school measurement completed: Height 142 cm, Weight 35 kg.',
      isRead: true,
      type: 'health',
    },
  ]);

  const child = students.find((s) => s.id === selectedChildId);

  if (!child) {
    return (
      <div className="glass-panel p-8 text-center max-w-md mx-auto space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
        <h3 className="font-bold text-base text-neutral-900 dark:text-white">Student Record Not Found</h3>
        <p className="text-xs text-neutral-500">
          In compliance with student privacy laws, you can only access records for verified linked children.
        </p>
      </div>
    );
  }

  const growth = evaluateGrowthIndicator(child.bmi, child.age, child.gender);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-20">
      {/* Mobile-Friendly Greeting Card */}
      <div className="glass-panel p-5 bg-gradient-to-br from-teal-500/10 via-indigo-500/5 to-transparent border-teal-500/20">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wide">
              {t.parent_greeting}, {child.parentName}
            </span>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
              {child.name}
              {child.nativeName && (
                <span className="ml-2 font-normal text-teal-600 dark:text-teal-400 text-sm">
                  ({child.nativeName})
                </span>
              )}
            </h2>
            <div className="text-xs text-neutral-500 mt-0.5">
              Grade {child.section} · Roll ID: <span className="font-mono text-neutral-700 dark:text-neutral-300">{child.id}</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            {child.name.charAt(0)}
          </div>
        </div>

        {/* Today's Quick Status Pill */}
        <div className="mt-4 p-3 rounded-xl bg-white/70 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Today&apos;s Status:
            </span>
            <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Present in Class
            </strong>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Recorded 08:32 AM</span>
        </div>
      </div>

      {/* Thumb-Zone Tab Buttons (min 44px touch targets) */}
      <div className="grid grid-cols-4 gap-2 bg-neutral-200/60 dark:bg-neutral-900/60 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-colors ${
            activeTab === 'attendance'
              ? 'bg-white dark:bg-neutral-800 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span>Attendance</span>
        </button>

        <button
          onClick={() => setActiveTab('meals')}
          className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-colors ${
            activeTab === 'meals'
              ? 'bg-white dark:bg-neutral-800 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Utensils className="w-4 h-4 mb-0.5" />
          <span>Meals</span>
        </button>

        <button
          onClick={() => setActiveTab('growth')}
          className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-colors ${
            activeTab === 'growth'
              ? 'bg-white dark:bg-neutral-800 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Heart className="w-4 h-4 mb-0.5" />
          <span>Growth</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center relative transition-colors ${
            activeTab === 'notifications'
              ? 'bg-white dark:bg-neutral-800 text-teal-600 dark:text-teal-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
          }`}
        >
          <Bell className="w-4 h-4 mb-0.5" />
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-rose-500"></span>
          )}
        </button>
      </div>

      {/* Tab 1: Attendance History Calendar */}
      {activeTab === 'attendance' && (
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              14-Day Attendance Calendar
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              93% Attendance
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Object.keys(child.attendanceHistory).sort().map((date) => {
              const status = child.attendanceHistory[date];
              const day = date.split('-')[2];
              let bg = 'bg-emerald-500';
              let text = 'P';
              if (status === 'absent') {
                bg = 'bg-rose-500';
                text = 'A';
              } else if (status === 'late') {
                bg = 'bg-amber-500';
                text = 'L';
              } else if (status === 'excused') {
                bg = 'bg-indigo-500';
                text = 'E';
              }

              return (
                <div
                  key={date}
                  className="p-2 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex flex-col items-center text-center"
                >
                  <span className="text-[10px] text-neutral-400 font-mono mb-1">{day}</span>
                  <span className={`w-6 h-6 rounded-full ${bg} text-white font-mono font-bold text-[11px] flex items-center justify-center`}>
                    {text}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-around text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Late</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Recent Meals & Nutrition */}
      {activeTab === 'meals' && (
        <div className="glass-panel p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              School Meals Provided This Week
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Food supplied per child according to PM-POSHAN Upper Primary dietary norms.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-neutral-900 dark:text-white">
                  Today&apos;s Mid-Day Lunch
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Steamed Rice + Toor Dal Sambar with drumstick &amp; carrots + Hard-Boiled Egg
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">685 kcal</span>
                <div className="text-[10px] text-neutral-400">supplied</div>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-neutral-900 dark:text-white">
                  Yesterday&apos;s Mid-Day Lunch
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Bisi Bele Bath + Fresh Curd + Drumstick Leaf Poriyal
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">710 kcal</span>
                <div className="text-[10px] text-neutral-400">supplied</div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Weekly Menu & Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {onOpenWeeklyPlan && (
              <button
                onClick={onOpenWeeklyPlan}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:border-teal-500/50 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-teal-600">
                      Upcoming 6-Day Menu
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      View full weekly schedule
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}

            {onOpenGallery && (
              <button
                onClick={onOpenGallery}
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:border-teal-500/50 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-teal-600">
                      School Meal Photos
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Daily kitchen camera logs
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Calorie values represent food portion supplied by the kitchen for each child according to government norms.
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Child Growth Guidepost */}
      {activeTab === 'growth' && (
        <div className="glass-panel p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-teal-600" />
              Child Growth Record (Height, Weight &amp; BMI)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              School health screening data recorded for pastoral care.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Height</div>
              <div className="text-base font-bold font-mono text-neutral-900 dark:text-white mt-1">
                {child.heightCm} cm
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Weight</div>
              <div className="text-base font-bold font-mono text-neutral-900 dark:text-white mt-1">
                {child.weightKg} kg
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Reference BMI</div>
              <div className="text-base font-bold font-mono text-teal-600 dark:text-teal-400 mt-1">
                {child.bmi}
              </div>
            </div>
          </div>

          {/* Prominent Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Medical &amp; Informational Notice</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
              {growth.disclaimer}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Absence & Meal Alerts Notification Center */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-teal-600" />
              Notifications &amp; Alerts
            </h3>
            <span className="text-xs text-neutral-500">{unreadCount} unread</span>
          </div>

          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border text-xs transition-colors ${
                  n.isRead
                    ? 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40'
                    : 'border-teal-500/40 bg-teal-500/5'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mb-1">
                  <span>{n.date}</span>
                  {!n.isRead && (
                    <span className="px-1.5 py-0.5 rounded bg-teal-500 text-white font-bold uppercase text-[9px]">
                      New
                    </span>
                  )}
                </div>
                <div className="font-bold text-neutral-900 dark:text-white">{n.title}</div>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1 text-[11px]">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
