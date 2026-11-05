/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Mid-Day Meal Background Hero & Kitchen Inspection Banner
 * Features authentic documentary photography of mid-day meals being served,
 * kitchen hygiene status, and immediate feedback modal trigger.
 */

import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  CheckCircle2, 
  MessageSquarePlus, 
  ShieldCheck, 
  Clock, 
  ChefHat, 
  Eye, 
  Camera, 
  Star,
  CalendarDays
} from 'lucide-react';
import { FeedbackSummaryMetrics } from '../../utils/feedback';

interface MealInspectionHeroProps {
  onOpenFeedbackModal: () => void;
  feedbackMetrics: FeedbackSummaryMetrics;
  onOpenAssistant: () => void;
  onOpenGallery?: () => void;
  onOpenWeeklyPlan?: () => void;
}

export const MealInspectionHero: React.FC<MealInspectionHeroProps> = ({
  onOpenFeedbackModal,
  feedbackMetrics,
  onOpenAssistant,
  onOpenGallery,
  onOpenWeeklyPlan,
}) => {
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-lg group">
        {/* Real Generated Photography Background with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/midday_meal_serving_1792949878283.jpg"
            alt="School children receiving hot nutritious mid-day meals in South Indian school courtyard"
            className="w-full h-full object-cover object-center filter saturate-105 transition-transform duration-700 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim for WCAG AA readability in light & dark */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-900/80 to-neutral-950/60 dark:from-neutral-950/95 dark:via-neutral-950/85 dark:to-neutral-950/70"></div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 p-6 md:p-8 text-white space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold font-mono tracking-wide uppercase">
                  PM-POSHAN Scheme · Daily Live Kitchen Log
                </span>
                <span className="text-neutral-400 text-xs hidden sm:inline">·</span>
                <span className="text-neutral-300 text-xs hidden sm:inline flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  Service Time: 12:30 PM - 01:15 PM
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-xs">
                Nourishing Upper Primary Students with Dignity &amp; Care
              </h2>
              <p className="text-xs md:text-sm text-neutral-300 leading-relaxed drop-shadow-xs">
                Wholesome steamed rice, toor dal sambar enriched with farm drumsticks and moringa greens, and protein supplementation. Inspected daily by teachers, parents, and community SDMC committees.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={onOpenFeedbackModal}
                className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-teal-500/20 transition-all active:scale-98"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Log Feedback</span>
              </button>

              {onOpenWeeklyPlan && (
                <button
                  onClick={onOpenWeeklyPlan}
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="View upcoming 6-day South Indian school meal schedule"
                >
                  <CalendarDays className="w-3.5 h-3.5 text-amber-300" />
                  <span>Weekly Menu</span>
                </button>
              )}

              {onOpenGallery ? (
                <button
                  onClick={onOpenGallery}
                  className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Open live photo register and snap kitchen photos"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-300" />
                  <span>Meal Gallery</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowFullImageModal(true)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="View full-size serving courtyard documentary photo"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-300" />
                  <span>View Kitchen Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Clean Proof & Inspection Badges Strip */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Avg Food Taste</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {feedbackMetrics.avgTasteRating} / 5.0
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Kitchen Hygiene</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {feedbackMetrics.avgHygieneRating} / 5.0
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10">
              <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Served Hot &amp; Fresh</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-base font-bold font-mono text-white tabular-nums">
                  {feedbackMetrics.hotFoodComplianceRate}%
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Poshan Sahayak</span>
                <div className="text-xs font-semibold text-teal-300 mt-0.5">Gemini Nutrition AI</div>
              </div>
              <button
                onClick={onOpenAssistant}
                className="px-2 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-400/30 rounded-lg text-[10px] font-bold"
              >
                Ask →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Photo Modal */}
      {showFullImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowFullImageModal(false)}
        >
          <div className="relative max-w-4xl w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img
              src="/src/assets/images/midday_meal_serving_1792949878283.jpg"
              alt="Mid-day meals being served in government school"
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-4 bg-neutral-900 flex items-center justify-between text-xs text-neutral-300">
              <span>Government High School Mid-Day Meal Scheme — Daily Hot Meal Serving Session</span>
              <button
                onClick={() => setShowFullImageModal(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
