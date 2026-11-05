/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan Mid-Day Meal Feedback & Quality Inspection Engine
 */

export interface MealFeedbackEntry {
  id: string;
  date: string;
  mealType: 'lunch' | 'morning_snack';
  evaluatorRole: 'teacher' | 'parent_visitor' | 'sdmc_member' | 'student_rep';
  evaluatorName: string;
  temperature: 'steaming_hot' | 'warm' | 'tepid' | 'cold';
  hygieneRating: number; // 1 to 5
  tasteRating: number; // 1 to 5
  portionSufficiency: 'optimal' | 'excess' | 'insufficient';
  wasteLevelPercent: number; // estimated plate waste %
  notes: string;
  verifiedByHeadmaster: boolean;
  createdAt: string;
}

export interface FeedbackSummaryMetrics {
  totalEvaluations: number;
  avgHygieneRating: number;
  avgTasteRating: number;
  hotFoodComplianceRate: number; // % that was steaming_hot or warm
  optimalPortionRate: number; // % optimal
}

export function computeFeedbackMetrics(entries: MealFeedbackEntry[]): FeedbackSummaryMetrics {
  if (entries.length === 0) {
    return {
      totalEvaluations: 0,
      avgHygieneRating: 5.0,
      avgTasteRating: 5.0,
      hotFoodComplianceRate: 100,
      optimalPortionRate: 100,
    };
  }

  const total = entries.length;
  const sumHygiene = entries.reduce((acc, curr) => acc + curr.hygieneRating, 0);
  const sumTaste = entries.reduce((acc, curr) => acc + curr.tasteRating, 0);
  const warmCount = entries.filter((e) => e.temperature === 'steaming_hot' || e.temperature === 'warm').length;
  const optimalCount = entries.filter((e) => e.portionSufficiency === 'optimal').length;

  return {
    totalEvaluations: total,
    avgHygieneRating: Number((sumHygiene / total).toFixed(1)),
    avgTasteRating: Number((sumTaste / total).toFixed(1)),
    hotFoodComplianceRate: Math.round((warmCount / total) * 100),
    optimalPortionRate: Math.round((optimalCount / total) * 100),
  };
}

export const INITIAL_MEAL_FEEDBACK: MealFeedbackEntry[] = [
  {
    id: 'fb-01',
    date: '2026-10-25',
    mealType: 'lunch',
    evaluatorRole: 'teacher',
    evaluatorName: 'Anitha Shenoy (Class Teacher 6A)',
    temperature: 'steaming_hot',
    hygieneRating: 5,
    tasteRating: 5,
    portionSufficiency: 'optimal',
    wasteLevelPercent: 3,
    notes: 'Drumstick sambar was aromatic and thick with good dal consistency. Rice was tender and thoroughly steamed. Children finished plates completely.',
    verifiedByHeadmaster: true,
    createdAt: '2026-10-25T12:45:00Z',
  },
  {
    id: 'fb-02',
    date: '2026-10-24',
    mealType: 'lunch',
    evaluatorRole: 'parent_visitor',
    evaluatorName: 'Suresh Bhat (SDMC Parent Rep)',
    temperature: 'steaming_hot',
    hygieneRating: 5,
    tasteRating: 4,
    portionSufficiency: 'optimal',
    wasteLevelPercent: 4,
    notes: 'Sampled Bisi Bele Bath and curd. Quality of ghee and vegetables was satisfactory. Kitchen utensils were sanitized.',
    verifiedByHeadmaster: true,
    createdAt: '2026-10-24T12:50:00Z',
  },
  {
    id: 'fb-03',
    date: '2026-10-23',
    mealType: 'lunch',
    evaluatorRole: 'student_rep',
    evaluatorName: 'Lakshmi N. (School Pupil Leader)',
    temperature: 'warm',
    hygieneRating: 4,
    tasteRating: 5,
    portionSufficiency: 'optimal',
    wasteLevelPercent: 2,
    notes: 'Boiled eggs were fresh and easy to peel. All classmates in Grade 6 enjoyed the sprouted sundal.',
    verifiedByHeadmaster: false,
    createdAt: '2026-10-23T13:00:00Z',
  },
];
