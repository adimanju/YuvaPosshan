/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * First-run Guided Tour & Coach Marks
 */

import React, { useState } from 'react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { UserRole } from './Header';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, onClose, role }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const teacherSteps = [
    {
      title: "Welcome to Today's Roll Call",
      description: 'Mark attendance for all 125 students in seconds. Tap any card to toggle between Present, Absent, Late, and Excused.',
      badge: 'Step 1 of 3: Speed Roll Call',
    },
    {
      title: 'Lightning-Fast Hotkeys',
      description: 'Click any student card to focus, then press P (Present), A (Absent), L (Late), or E (Excused) on your keyboard. Press Cmd+Z anytime to undo.',
      badge: 'Step 2 of 3: Keyboard Power',
    },
    {
      title: 'Mid-Day Meal & Calorie Log',
      description: 'Enter portions and see calories update live based on ICMR-NIN IFCT tables. Every calculation clearly notes that figures indicate food supplied, not food eaten.',
      badge: 'Step 3 of 3: Nutrition Ledger',
    },
  ];

  const adminSteps = [
    {
      title: 'School-Wide Nutrition & Attendance Overview',
      description: 'Track real-time attendance percentages, monthly calories supplied, and 4-section comparative KPIs across Grades 5 through 8.',
      badge: 'Step 1 of 3: Executive Metrics',
    },
    {
      title: 'Student Directory & Export',
      description: 'Search, filter, and export all 500 student records with physical measurements, BMI guideposts, and parent contacts in CSV format.',
      badge: 'Step 2 of 3: Record Keeping',
    },
    {
      title: 'Growth Review Roster & Audit Log',
      description: 'Review non-diagnostic growth flags for visiting PHC medical officers, and view immutable cryptographic access logs.',
      badge: 'Step 3 of 3: Privacy & Health Care',
    },
  ];

  const parentSteps = [
    {
      title: 'Your Child’s Daily Attendance',
      description: 'See whether your child is safely marked Present in school right from your phone.',
      badge: 'Step 1 of 2: Attendance Check',
    },
    {
      title: 'Nutritious School Meals',
      description: 'Check what delicious, government-inspected meals (Rice, Sambar, Egg, Ragi Mudde) were supplied at school today.',
      badge: 'Step 2 of 2: Meal Updates',
    },
  ];

  const steps = role === 'teacher' ? teacherSteps : role === 'admin' ? adminSteps : parentSteps;
  const currentStepData = steps[step] || steps[0];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel-elevated w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 font-mono">
              {currentStepData.badge}
            </span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-5 space-y-2">
          <h3 className="font-bold text-base text-neutral-900 dark:text-white">
            {currentStepData.title}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs">
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
          >
            Skip Tour
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <span>{step === steps.length - 1 ? 'Start Using YuvaPoshan' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
