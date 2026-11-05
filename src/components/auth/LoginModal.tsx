/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Hero / Split-screen Login with 1-click Demo Accounts for Teacher, Admin, and Parent.
 * Includes Forgot Password flow and role-aware routing.
 */

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Heart, Lock, ArrowRight, X, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../common/Header';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, userName: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { signInWithGoogle, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setAuthError('Google sign-in was canceled or failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  const handleDemoLogin = (role: UserRole) => {
    if (role === 'teacher') {
      onLoginSuccess('teacher', 'Anitha Shenoy (Grade 6A Teacher)');
    } else if (role === 'admin') {
      onLoginSuccess('admin', 'Dr. K. S. Murthy (Headmaster)');
    } else if (role === 'parent') {
      onLoginSuccess('parent', 'Ramesh Gowda (Parent of Lakshmi)');
    }
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      onLoginSuccess('admin', email);
    } else if (email.includes('parent')) {
      onLoginSuccess('parent', email);
    } else {
      onLoginSuccess('teacher', email);
    }
    onClose();
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setIsForgotPassword(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="glass-panel-elevated w-full max-w-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Left Side: Brand Hero */}
        <div className="md:col-span-5 p-6 bg-gradient-to-br from-teal-700 via-teal-800 to-indigo-950 text-white flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
              YP
            </div>
            <h3 className="text-xl font-bold mt-4 tracking-tight">YuvaPoshan</h3>
            <p className="text-xs text-teal-100/80 mt-1">
              South Indian school attendance, mid-day meal nutrition, and child growth record portal.
            </p>
          </div>

          <div className="space-y-2 mt-6 text-[11px] text-teal-200/80">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>Role-governed data protection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-300" />
              <span>Sensitive student records encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Side: Demo Mode & Login Form */}
        <div className="md:col-span-7 p-6 bg-white dark:bg-neutral-900 text-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <span className="font-bold text-sm text-neutral-900 dark:text-white">
              {isForgotPassword ? 'Reset Password' : 'Sign In or Demo Access'}
            </span>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isForgotPassword ? (
            <div className="space-y-4 my-4">
              {/* Google Sign-in Primary Provider */}
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                  Firebase Authentication
                </span>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
                {authError && (
                  <p className="text-[11px] text-rose-500 mt-1.5">{authError}</p>
                )}
              </div>

              {/* 1-Click Demo Accounts */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Or Test Role Demo Accounts (1-Click)
                </span>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <button
                    onClick={() => handleDemoLogin('teacher')}
                    className="p-2.5 rounded-xl border border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-teal-600" />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          Class Teacher (Grade 6A)
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Roll call, attendance ring, meal log
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-teal-600 opacity-60 group-hover:opacity-100" />
                  </button>

                  <button
                    onClick={() => handleDemoLogin('admin')}
                    className="p-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          Headmaster / Admin
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          School KPIs, 500 directory, audit log
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 opacity-60 group-hover:opacity-100" />
                  </button>

                  <button
                    onClick={() => handleDemoLogin('parent')}
                    className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white">
                          Parent Portal
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          Linked child Lakshmi Narayanan (6A)
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-600 opacity-60 group-hover:opacity-100" />
                  </button>
                </div>
              </div>

              {/* Standard Form & Forgot Password */}
              <form onSubmit={handleCustomSubmit} className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                    Email or Staff Roll ID
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@yuvaposhan.edu.in"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs mt-0.5"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs mt-0.5"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs mt-2"
                >
                  Sign In
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4 my-6">
              <p className="text-neutral-600 dark:text-neutral-400">
                Enter your registered school email address or mobile phone number to receive a secure password reset link.
              </p>

              {resetSent ? (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reset instructions sent successfully.</span>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter school email or mobile number"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs"
                    required
                  />
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-neutral-500 hover:underline"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-semibold"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
