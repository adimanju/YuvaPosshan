/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  STANDARD_WEEKLY_MENU,
  getWeeklyMenu,
  getTodayMenu,
  calculateWeeklyAverages,
  PM_POSHAN_UPPER_PRIMARY_TARGETS,
} from './weeklyPlan';

test('WeeklyPlan: 6-day cycle spans Mon through Sat', () => {
  const menu = getWeeklyMenu();
  assert.strictEqual(menu.length, 6);
  assert.strictEqual(menu[0].dayOfWeek, 'Monday');
  assert.strictEqual(menu[5].dayOfWeek, 'Saturday');
});

test('WeeklyPlan: getTodayMenu returns valid plan for any date', () => {
  // Monday
  const monday = new Date('2026-10-26T10:00:00');
  const mondayPlan = getTodayMenu(monday);
  assert.strictEqual(mondayPlan.dayOfWeek, 'Monday');

  // Sunday fallback to Monday
  const sunday = new Date('2026-10-25T10:00:00');
  const sundayPlan = getTodayMenu(sunday);
  assert.strictEqual(sundayPlan.dayOfWeek, 'Monday');
});

test('WeeklyPlan: calculateWeeklyAverages meets PM-POSHAN standard targets', () => {
  const stats = calculateWeeklyAverages(STANDARD_WEEKLY_MENU);
  assert.strictEqual(stats.totalDays, 6);
  // Average calories should be >= 700 kcal
  assert.strictEqual(stats.avgCalories >= 700, true);
  // Average protein should be >= 20g
  assert.strictEqual(stats.avgProtein >= 20.0, true);
  // Compliant days should be at least 5 of 6 (Saturday is light half-day session)
  assert.strictEqual(stats.compliantDays >= 5, true);
});
