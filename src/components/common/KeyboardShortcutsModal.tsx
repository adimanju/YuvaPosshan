/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Keyboard Shortcuts Modal overlay (triggered via '?' or button)
 */

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-panel-elevated w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold">
            <Keyboard className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            aria-label="Close shortcuts modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-neutral-700 dark:text-neutral-300">
          <div>
            <h4 className="font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider text-[11px] mb-2">
              Teacher Roll Call (When student card selected)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Mark Present</span>
                <kbd className="px-2 py-1 font-mono font-bold bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 text-emerald-600">
                  P
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Mark Absent</span>
                <kbd className="px-2 py-1 font-mono font-bold bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 text-rose-600">
                  A
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Mark Late</span>
                <kbd className="px-2 py-1 font-mono font-bold bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 text-amber-600">
                  L
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Mark Excused</span>
                <kbd className="px-2 py-1 font-mono font-bold bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 text-indigo-600">
                  E
                </kbd>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider text-[11px] mb-2">
              Global Navigation
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Search students & commands</span>
                <kbd className="px-2 py-1 font-mono bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700">
                  Cmd / Ctrl + K
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Show this shortcut overlay</span>
                <kbd className="px-2 py-1 font-mono bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700">
                  ?
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Undo last attendance change</span>
                <kbd className="px-2 py-1 font-mono bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700">
                  Cmd / Ctrl + Z
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800/60">
                <span>Close modal or deselect</span>
                <kbd className="px-2 py-1 font-mono bg-white dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
