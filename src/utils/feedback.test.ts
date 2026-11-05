/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unit tests for Mid-Day Meal Feedback metrics calculation
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { computeFeedbackMetrics, MealFeedbackEntry } from './feedback';

test('Feedback: computeFeedbackMetrics calculates averages correctly', () => {
  const entries: MealFeedbackEntry[] = [
    {
      id: 'test-1',
      date: '2026-10-25',
      mealType: 'lunch',
      evaluatorRole: 'teacher',
      evaluatorName: 'Teacher A',
      temperature: 'steaming_hot',
      hygieneRating: 5,
      tasteRating: 4,
      portionSufficiency: 'optimal',
      wasteLevelPercent: 2,
      notes: 'Excellent',
      verifiedByHeadmaster: true,
      createdAt: '2026-10-25T12:00:00Z',
    },
    {
      id: 'test-2',
      date: '2026-10-25',
      mealType: 'lunch',
      evaluatorRole: 'parent_visitor',
      evaluatorName: 'Parent B',
      temperature: 'cold',
      hygieneRating: 3,
      tasteRating: 2,
      portionSufficiency: 'insufficient',
      wasteLevelPercent: 10,
      notes: 'Need warmer food',
      verifiedByHeadmaster: false,
      createdAt: '2026-10-25T12:30:00Z',
    },
  ];

  const metrics = computeFeedbackMetrics(entries);
  assert.equal(metrics.totalEvaluations, 2);
  assert.equal(metrics.avgHygieneRating, 4.0); // (5 + 3) / 2
  assert.equal(metrics.avgTasteRating, 3.0); // (4 + 2) / 2
  assert.equal(metrics.hotFoodComplianceRate, 50); // 1 out of 2 hot/warm
  assert.equal(metrics.optimalPortionRate, 50); // 1 out of 2 optimal
});

test('Feedback: handles empty array safely', () => {
  const metrics = computeFeedbackMetrics([]);
  assert.equal(metrics.totalEvaluations, 0);
  assert.equal(metrics.hotFoodComplianceRate, 100);
});
