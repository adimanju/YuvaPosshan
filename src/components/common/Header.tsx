/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Header Component (Streamlined with Popups / Menus)
 * Groups top-right utilities and secondary navigation into clean, accessible popovers
 * to prevent display overflowing across laptop, tablet, and compact viewports.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  HelpCircle, 
  Layers, 
  UserCheck, 
  ShieldCheck, 
  Globe, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  MessageSquarePlus, 
  MapPin, 
  CalendarDays, 
  Camera,
  Utensils,
  ChevronDown,
  MoreVertical,
  Check,
  Menu,
  X,
  Keyboard,
  Info,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../../data/i18n';
import { useAuth } from '../../context/AuthContext';

export type UserRole = 'teacher' | 'admin' | 'parent';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentLang: SupportedLanguage;
  onLangChange: (lang: SupportedLanguage) => void;
  onOpenCommandPalette: () => void;
  onOpenHelp: () => void;
  onOpenDesignSystem: () => void;
  onOpenAssistant: () => void;
  onOpenFeedbackModal: () => void;
  onOpenMapModal: () => void;
  onOpenWeeklyPlan?: () => void;
  onOpenGallery?: () => void;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  isDark,
  onToggleTheme,
  currentLang,
  onLangChange,
  onOpenCommandPalette,
  onOpenHelp,
  onOpenDesignSystem,
  onOpenAssistant,
  onOpenFeedbackModal,
  onOpenMapModal,
  onOpenWeeklyPlan,
  onOpenGallery,
  isOnline,
  onToggleOnline,
}) => {
  const t = TRANSLATIONS[currentLang];
  const { currentUser, userProfile, signInWithGoogle, logout } = useAuth();

  // Popover states
  const [isMealsMenuOpen, setIsMealsMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for outside click handling
  const mealsMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click and Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (mealsMenuRef.current && !mealsMenuRef.current.contains(target)) {
        setIsMealsMenuOpen(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(target)) {
        setIsSettingsMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMealsMenuOpen(false);
        setIsSettingsMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-elevated border-b border-white/20 dark:border-white/10 px-3 md:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-sm font-semibold tracking-tight text-base">
            YP
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
              {t.app_title}
            </span>
            <span className="text-[10px] text-teal-700 dark:text-teal-300 font-medium tracking-wide hidden sm:inline whitespace-nowrap">
              Karnataka &amp; South India School Portal
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Active Role Selector */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          {/* Role Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-lg">
            <button
              onClick={() => onRoleChange('teacher')}
              className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentRole === 'teacher'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.role_teacher}</span>
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentRole === 'admin'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.role_admin}</span>
            </button>

            <button
              onClick={() => onRoleChange('parent')}
              className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                currentRole === 'parent'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
              }`}
            >
              <span>{t.role_parent}</span>
            </button>
          </div>

          {/* School Meals & Tools Dropdown Menu */}
          <div className="relative" ref={mealsMenuRef}>
            <button
              onClick={() => setIsMealsMenuOpen(!isMealsMenuOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isMealsMenuOpen
                  ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-teal-700 dark:text-teal-300'
                  : 'border-transparent text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
              }`}
              title="Mid-day meals, photos, feedback, and healthcare links"
              aria-expanded={isMealsMenuOpen}
            >
              <Utensils className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Meals &amp; Resources</span>
              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-150 ${isMealsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Meals & Resources Popover Menu */}
            {isMealsMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-60 glass-panel-elevated p-1.5 shadow-2xl z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-150">
                {onOpenWeeklyPlan && (
                  <button
                    onClick={() => {
                      onOpenWeeklyPlan();
                      setIsMealsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center gap-2.5 transition-colors group"
                  >
                    <CalendarDays className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        Weekly Meal Plan
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        6-Day PM-POSHAN standard cycle
                      </div>
                    </div>
                  </button>
                )}

                {onOpenGallery && (
                  <button
                    onClick={() => {
                      onOpenGallery();
                      setIsMealsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center gap-2.5 transition-colors group"
                  >
                    <Camera className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                        School Meal Photos
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Live photo register &amp; camera snap
                      </div>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenFeedbackModal();
                    setIsMealsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center gap-2.5 transition-colors group"
                >
                  <MessageSquarePlus className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      Meal Quality Feedback
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Teacher, parent &amp; SDMC register
                    </div>
                  </div>
                </button>

                <div className="my-1 border-t border-neutral-200 dark:border-neutral-800/80"></div>

                <button
                  onClick={() => {
                    onOpenMapModal();
                    setIsMealsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center gap-2.5 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      Health Centres &amp; Godowns
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      PHC clinic referrals &amp; grain stock
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenDesignSystem();
                    setIsMealsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center gap-2.5 transition-colors group"
                >
                  <Layers className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      Design System Spec
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      WCAG tokens &amp; component specs
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Primary Actions & Streamlined Utilities Popup */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Google Auth Status / Sign-in Button */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="hidden xl:inline text-[11px] font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[90px]">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={() => logout()}
                className="p-0.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400"
                title="Sign out from Firebase"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors shadow-2xs whitespace-nowrap"
              title="Sign in with Google (Firebase Auth)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="hidden sm:inline">Sign in</span>
            </button>
          )}

          {/* Poshan Sahayak AI Nutrition Advisor Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-colors shadow-2xs whitespace-nowrap"
            title="Poshan Sahayak (Gemini Nutrition Advisor)"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Poshan Sahayak</span>
          </button>

          {/* Quick Student Search Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            title="Search students (Cmd+K)"
            aria-label="Search students"
          >
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 text-neutral-500">
              ⌘K
            </kbd>
          </button>

          {/* Consolidated Settings & Utilities Popover Menu Button */}
          <div className="relative" ref={settingsMenuRef}>
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className={`p-2 rounded-lg text-xs transition-colors flex items-center justify-center border ${
                isSettingsMenuOpen
                  ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-teal-600'
                  : 'border-transparent text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
              }`}
              title="System settings, language, theme, and network state"
              aria-label="Settings and options menu"
              aria-expanded={isSettingsMenuOpen}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Settings & Preferences Popover Menu */}
            {isSettingsMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 glass-panel-elevated p-2 shadow-2xl z-50 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 font-bold text-[11px] text-neutral-400 uppercase tracking-wider">
                  Settings &amp; Preferences
                </div>

                {/* Account & Google Auth */}
                <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 mb-2">
                  {currentUser ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                            {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <div className="font-bold text-xs text-neutral-900 dark:text-white truncate max-w-[120px]">
                            {currentUser.displayName || 'Google User'}
                          </div>
                          <div className="text-[10px] text-teal-700 dark:text-teal-300 truncate max-w-[120px]">
                            {currentUser.email}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => logout()}
                        className="px-2 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mb-2">
                        Sign in with Google to sync roll call and meal feedback to Cloud Firestore.
                      </div>
                      <button
                        onClick={() => signInWithGoogle()}
                        className="w-full py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Sign in with Google</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Appearance / Theme Toggle */}
                <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isDark ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">Theme</span>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-neutral-700 shadow-2xs border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors flex items-center gap-1.5"
                  >
                    <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                </div>

                {/* Network Connectivity Toggle */}
                <div className="p-2 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/50 flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">Network</span>
                  </div>
                  <button
                    onClick={onToggleOnline}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                  </button>
                </div>

                {/* Multilingual Selector */}
                <div className="mb-2">
                  <div className="px-2 py-1 text-[11px] font-semibold text-neutral-500 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Language / ಭಾಷೆ</span>
                  </div>
                  <div className="mt-1 space-y-0.5 max-h-36 overflow-y-auto pr-1">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = currentLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            onLangChange(lang.code);
                            setIsSettingsMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-teal-500/15 text-teal-800 dark:text-teal-200 font-bold'
                              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.name}</span>
                            <span className="text-[10px] text-neutral-400 font-medium">({lang.nativeName})</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-neutral-200 dark:border-neutral-800 my-1"></div>

                {/* Keyboard Shortcuts Trigger */}
                <button
                  onClick={() => {
                    onOpenHelp();
                    setIsSettingsMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Keyboard Shortcuts</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-neutral-200/80 dark:bg-neutral-700 rounded text-neutral-500">
                    ?
                  </kbd>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle (Visible on screens < md) */}
          <div className="md:hidden relative" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 glass-panel-elevated p-3 shadow-2xl z-50 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-xs animate-in slide-in-from-top-2 duration-150 space-y-3">
                {/* Mobile Roles */}
                <div>
                  <div className="text-[10px] uppercase font-bold text-neutral-400 px-1 mb-1">Select Role</div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => {
                        onRoleChange('teacher');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-lg text-center font-semibold text-xs ${
                        currentRole === 'teacher' ? 'bg-teal-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Teacher
                    </button>
                    <button
                      onClick={() => {
                        onRoleChange('admin');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-lg text-center font-semibold text-xs ${
                        currentRole === 'admin' ? 'bg-teal-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => {
                        onRoleChange('parent');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`p-2 rounded-lg text-center font-semibold text-xs ${
                        currentRole === 'parent' ? 'bg-teal-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Parent
                    </button>
                  </div>
                </div>

                {/* Mobile Meal Actions */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-2 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400 px-1 mb-1">Meals &amp; Health</div>
                  {onOpenWeeklyPlan && (
                    <button
                      onClick={() => {
                        onOpenWeeklyPlan();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <CalendarDays className="w-4 h-4 text-amber-500" />
                      <span>Weekly Meal Plan</span>
                    </button>
                  )}
                  {onOpenGallery && (
                    <button
                      onClick={() => {
                        onOpenGallery();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4 text-teal-600" />
                      <span>School Meal Photos</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onOpenFeedbackModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-teal-600" />
                    <span>Meal Quality Feedback</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenMapModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>Health Centres &amp; Godowns</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
