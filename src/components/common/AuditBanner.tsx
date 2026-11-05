/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Audit, Privacy, & Medical Record-Keeping Plain-Language Banner
 */

import React, { useState } from 'react';
import { ShieldCheck, Info, Eye, X } from 'lucide-react';

interface AuditBannerProps {
  currentUser: string;
  activeRole: string;
}

export const AuditBanner: React.FC<AuditBannerProps> = ({ currentUser, activeRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-teal-900/10 dark:bg-teal-950/40 border-b border-teal-500/20 px-4 py-2 text-xs text-neutral-700 dark:text-neutral-300 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>
            <strong className="font-semibold text-teal-900 dark:text-teal-200">Sensitive Student Records:</strong> Access is role-governed and cryptographically logged. Active Session: <span className="font-mono text-neutral-900 dark:text-white">{currentUser} ({activeRole})</span>.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1 font-medium whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Hide Privacy & Legal Notice' : 'View Audit & Legal Notice'}</span>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-teal-500/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-neutral-600 dark:text-neutral-400">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p>
              <strong>Informational Disclaimer:</strong> YuvaPoshan is an educational administrative and nutrition record-keeping tool. It is <em>not</em> a clinical diagnostic instrument. Growth percentiles and BMI reference indices are statistical guideposts only and must be interpreted by a registered healthcare provider.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              <strong>Data Privacy & Access Audit:</strong> In compliance with child data safety guidelines, all student identity fields, attendance roll modifications, and health records are timestamped with user ID, IP hash, and audit checksum.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
