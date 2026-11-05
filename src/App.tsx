/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan - Flagship Web Application
 * Student Attendance, School Meal Nutrition, and Child Growth Monitoring
 */

import React, { useState, useEffect } from 'react';
import { Header, UserRole } from './components/common/Header';
import { AuditBanner } from './components/common/AuditBanner';
import { CommandPalette } from './components/common/CommandPalette';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { DesignTokensDrawer } from './components/common/DesignTokensDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { OnboardingTour } from './components/common/OnboardingTour';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ParentPortal } from './components/parent/ParentPortal';
import { MealFeedbackModal } from './components/meals/MealFeedbackModal';
import { NutritionAssistantDrawer } from './components/chat/NutritionAssistantDrawer';
import { HealthCentresMapModal } from './components/maps/HealthCentresMapModal';
import { MealGallery } from './components/meals/MealGallery';
import { WeeklyMealPlan } from './components/meals/WeeklyMealPlan';
import { StudentHeatmapModal } from './components/teacher/StudentHeatmapModal';
import { SEED_STUDENTS, Student } from './data/seedStudents';
import { SupportedLanguage } from './data/i18n';
import { INITIAL_MEAL_FEEDBACK, MealFeedbackEntry, computeFeedbackMetrics } from './utils/feedback';
import { useAuth } from './context/AuthContext';
import { subscribeToMealFeedback, saveMealFeedback } from './lib/firestoreService';
import { Layers, Sparkles, LogIn, Sun, Moon, MessageSquarePlus, MapPin, Bot, CalendarDays, Camera } from 'lucide-react';

export default function App() {
  // Theme state: default to system or light, with localStorage cache
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('yuva_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Auth context integration
  const { currentUser: authUser, userProfile } = useAuth();

  // Role state
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [currentUser, setCurrentUser] = useState<string>('Anitha Shenoy (T-042)');

  // Multilingual state
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');

  // Network state (online vs offline mode)
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Modals state
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isWeeklyPlanOpen, setIsWeeklyPlanOpen] = useState(false);
  const [isMapsQuotaExceeded, setIsMapsQuotaExceeded] = useState(false);

  // Google Maps Quota Listener
  useEffect(() => {
    const handleQuota = () => setIsMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync auth profile when logged in with Google/Firebase
  useEffect(() => {
    if (userProfile?.role) {
      setCurrentRole(userProfile.role);
    }
    if (userProfile?.displayName) {
      setCurrentUser(userProfile.displayName);
    } else if (authUser?.email) {
      setCurrentUser(authUser.email);
    }
  }, [userProfile, authUser]);

  // Meal Quality Feedback state
  const [feedbackEntries, setFeedbackEntries] = useState<MealFeedbackEntry[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuva_meal_feedback');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_MEAL_FEEDBACK;
  });

  // Real-time Firestore subscription for meal feedback (only when authenticated)
  useEffect(() => {
    if (!authUser) return;

    const unsubscribe = subscribeToMealFeedback((remoteEntries) => {
      if (remoteEntries && remoteEntries.length > 0) {
        setFeedbackEntries((prev) => {
          const map = new Map<string, MealFeedbackEntry>();
          remoteEntries.forEach((e) => map.set(e.id, e));
          prev.forEach((e) => {
            if (!map.has(e.id)) map.set(e.id, e);
          });
          return Array.from(map.values());
        });
      }
    });
    return () => unsubscribe();
  }, [authUser]);

  const handleAddFeedback = (newEntry: MealFeedbackEntry) => {
    const updated = [newEntry, ...feedbackEntries];
    setFeedbackEntries(updated);
    localStorage.setItem('yuva_meal_feedback', JSON.stringify(updated));
    saveMealFeedback(newEntry, authUser?.uid || 'guest-user').catch(() => {});
  };

  const feedbackMetrics = computeFeedbackMetrics(feedbackEntries);

  // Focus student in Teacher view
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // Sync dark class to root document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('yuva_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('yuva_theme', 'light');
    }
  }, [isDark]);

  // Global keybindings: Cmd+K for command palette, '?' for shortcuts help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
      // '?' key
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleLoginSuccess = (role: UserRole, userName: string) => {
    setCurrentRole(role);
    setCurrentUser(userName);
  };

  return (
    <div className="min-h-screen bg-ambient-canvas text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Google Maps Quota Warning Banner */}
      {isMapsQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Bar with Top Bar Contract */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        currentLang={currentLang}
        onLangChange={(lang) => setCurrentLang(lang)}
        onOpenCommandPalette={() => setIsCmdOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenFeedbackModal={() => setIsFeedbackOpen(true)}
        onOpenMapModal={() => setIsMapOpen(true)}
        onOpenWeeklyPlan={() => setIsWeeklyPlanOpen(true)}
        onOpenGallery={() => setIsGalleryOpen(true)}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
      />

      {/* Sensitive Data & Privacy Banner */}
      <AuditBanner currentUser={currentUser} activeRole={currentRole} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {currentRole === 'teacher' && (
          <TeacherDashboard
            students={SEED_STUDENTS}
            currentLang={currentLang}
            isOnline={isOnline}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenFeedbackModal={() => setIsFeedbackOpen(true)}
            feedbackMetrics={feedbackMetrics}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onOpenGallery={() => setIsGalleryOpen(true)}
            onOpenWeeklyPlan={() => setIsWeeklyPlanOpen(true)}
          />
        )}

        {currentRole === 'admin' && (
          <AdminDashboard
            students={SEED_STUDENTS}
            onSelectStudent={(s) => setSelectedStudentForModal(s)}
          />
        )}

        {currentRole === 'parent' && (
          <ParentPortal
            students={SEED_STUDENTS}
            currentLang={currentLang}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenWeeklyPlan={() => setIsWeeklyPlanOpen(true)}
            onOpenGallery={() => setIsGalleryOpen(true)}
          />
        )}
      </main>

      {/* Footer / Status Strip */}
      <footer className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-4 px-4 md:px-8 text-xs text-neutral-500 bg-white/40 dark:bg-neutral-950/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-700 dark:text-neutral-300">YuvaPoshan</span>
            <span>·</span>
            <span>Mid-Day Meal &amp; Child Growth Information Record System</span>
          </div>

          <div className="flex items-center flex-wrap gap-4 text-[11px]">
            <button
              onClick={() => setIsWeeklyPlanOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1"
            >
              <CalendarDays className="w-3.5 h-3.5 text-amber-500" />
              <span>Weekly Menu</span>
            </button>
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5 text-teal-600" />
              <span>Meal Photos</span>
            </button>
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-teal-600" />
              <span>Meal Feedback</span>
            </button>
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-500" />
              <span>Poshan Sahayak</span>
            </button>
            <button
              onClick={() => setIsMapOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>PHC &amp; Godowns</span>
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Demo Login</span>
            </button>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>Guided Tour</span>
            </button>
            <button
              onClick={() => setIsDesignSystemOpen(true)}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Design System Spec</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Overlays and Modals */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        students={SEED_STUDENTS}
        onSelectStudent={(student) => {
          setSelectedStudentForModal(student);
        }}
        onQuickMarkAllPresent={() => {
          const updated: Record<string, any> = {};
          SEED_STUDENTS.filter((s) => s.section === '6A').forEach((s) => {
            updated[s.id] = 'present';
          });
          localStorage.setItem('yuva_attendance_6A', JSON.stringify(updated));
          window.location.reload();
        }}
        onToggleTheme={handleToggleTheme}
        isDark={isDark}
        onNavigateRole={(role) => setCurrentRole(role)}
      />

      <KeyboardShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <DesignTokensDrawer
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
        isDark={isDark}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <OnboardingTour
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        role={currentRole}
      />

      <MealFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onAddFeedback={handleAddFeedback}
        feedbackEntries={feedbackEntries}
      />

      <NutritionAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      <HealthCentresMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      {isGalleryOpen && (
        <MealGallery
          isModal
          onClose={() => setIsGalleryOpen(false)}
        />
      )}

      {isWeeklyPlanOpen && (
        <WeeklyMealPlan
          isModal
          currentLang={currentLang}
          onClose={() => setIsWeeklyPlanOpen(false)}
        />
      )}

      {selectedStudentForModal && (
        <StudentHeatmapModal
          student={selectedStudentForModal}
          onClose={() => setSelectedStudentForModal(null)}
          onUpdateStatus={() => {}}
          currentStatus="present"
        />
      )}
    </div>
  );
}
