/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Unit tests for YuvaPoshan core logic modules:
 * - Nutrition & Calorie formula: (grams * kcal100 / 100) * children
 * - BMI calculation & input bounds validation
 * - Attendance summary & consecutive absence detection
 * - Fuzzy search phonetic transliteration
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMealCalories, computeMealNutrition, FoodItem } from './nutrition';
import { calculateBMI, evaluateGrowthIndicator, validateMeasurementInputs } from './growth';
import { computeAttendanceSummary, detectConsecutiveAbsences, getNextAttendanceStatus } from './attendance';
import { fuzzyStudentMatch, normalizePhonetic } from './search';

test('Nutrition: calculateMealCalories implements exact formula', () => {
  // 150g per child of food with 340 kcal per 100g served to 125 children
  // Per child: (150 * 340) / 100 = 510 kcal
  // Total: 510 * 125 = 63,750 kcal
  const result = calculateMealCalories(150, 340, 125);
  assert.equal(result.perChildKcal, 510);
  assert.equal(result.totalKcal, 63750);
});

test('Nutrition: food supplied disclaimer is clearly populated', () => {
  const sampleFood: FoodItem = {
    id: 'food-sambar',
    name: 'Vegetable Sambar with Dal',
    localName: { kn: 'ತರಕಾರಿ ಸಾಂಬಾರ್', ta: 'காய் சாம்பார்', te: 'కూరగాయ సాంబార్', ml: 'പച്ചക്കറി സാമ്പാർ' },
    category: 'pulse',
    kcalPer100g: 110,
    proteinPer100g: 4.8,
    ironPer100g: 1.2,
    sourceReference: 'ICMR-NIN IFCT 2020',
    defaultGramsPerChild: 120,
  };

  const nutrition = computeMealNutrition(sampleFood, 120, 100);
  assert.equal(nutrition.caloriesSuppliedPerChild, 132); // (120 * 110) / 100 = 132
  assert.equal(nutrition.totalCaloriesSupplied, 13200);
  assert.match(nutrition.complianceNotice, /food supplied per child/i);
});

test('Growth: validateMeasurementInputs checks height, weight, and age ranges', () => {
  // Valid child
  const valid = validateMeasurementInputs({ heightCm: 142, weightKg: 36, ageYears: 11 });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);

  // Invalid height (< 100cm)
  const tooShort = validateMeasurementInputs({ heightCm: 90, weightKg: 30, ageYears: 11 });
  assert.equal(tooShort.isValid, false);
  assert.match(tooShort.errors.heightCm, /between 100 cm and 190 cm/);

  // Invalid weight (< 15kg or > 100kg)
  const invalidWeight = validateMeasurementInputs({ heightCm: 140, weightKg: 110, ageYears: 12 });
  assert.equal(invalidWeight.isValid, false);
  assert.match(invalidWeight.errors.weightKg, /between 15 kg and 100 kg/);

  // Invalid age
  const invalidAge = validateMeasurementInputs({ heightCm: 140, weightKg: 35, ageYears: 7 });
  assert.equal(invalidAge.isValid, false);
  assert.match(invalidAge.errors.ageYears, /between 9 and 16 years/);
});

test('Growth: calculateBMI and evaluation', () => {
  // Height: 140 cm (1.4m), Weight: 35 kg
  // BMI = 35 / (1.4 * 1.4) = 35 / 1.96 = 17.857 -> 17.9
  const bmi = calculateBMI(140, 35);
  assert.equal(bmi, 17.9);

  const evaluation = evaluateGrowthIndicator(bmi, 11);
  assert.equal(evaluation.category, 'healthy_weight');
  assert.equal(evaluation.isFlaggedForReview, false);
  assert.match(evaluation.disclaimer, /NOT a clinical diagnosis/);

  // Very low BMI flagged for review
  const lowBmi = calculateBMI(140, 20); // ~10.2
  const lowEval = evaluateGrowthIndicator(lowBmi, 11);
  assert.equal(lowEval.isFlaggedForReview, true);
  assert.equal(lowEval.category, 'severe_thinness');
});

test('Attendance: computeAttendanceSummary calculates percentages accurately', () => {
  const summary = computeAttendanceSummary([
    'present', 'present', 'present', 'present',
    'absent',
    'late',
    'excused'
  ], 7);

  assert.equal(summary.total, 7);
  assert.equal(summary.present, 4);
  assert.equal(summary.absent, 1);
  assert.equal(summary.late, 1);
  assert.equal(summary.excused, 1);
  // (4 + 1) / 7 = 71.4%
  assert.equal(summary.attendanceRatePercent, 71.4);
});

test('Attendance: getNextAttendanceStatus cycles correctly', () => {
  assert.equal(getNextAttendanceStatus('present'), 'absent');
  assert.equal(getNextAttendanceStatus('absent'), 'late');
  assert.equal(getNextAttendanceStatus('late'), 'excused');
  assert.equal(getNextAttendanceStatus('excused'), 'present');
});

test('Attendance: detectConsecutiveAbsences flags 3+ consecutive absences', () => {
  const students = [
    { id: 's1', name: 'Lakshmi N', section: '6A', lastContactDate: '2026-10-20' },
    { id: 's2', name: 'Arun Kumar', section: '6A' },
  ];

  const history = {
    s1: {
      '2026-10-24': 'absent' as const,
      '2026-10-23': 'absent' as const,
      '2026-10-22': 'absent' as const,
      '2026-10-21': 'present' as const,
    },
    s2: {
      '2026-10-24': 'absent' as const,
      '2026-10-23': 'present' as const,
      '2026-10-22': 'absent' as const,
    },
  };

  const alerts = detectConsecutiveAbsences(students, history, 3);
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0].studentId, 's1');
  assert.equal(alerts[0].consecutiveAbsences, 3);
  assert.equal(alerts[0].lastContactDate, '2026-10-20');
});

test('Search: fuzzy matching handles South Indian spelling variations', () => {
  // Lakshmi vs Laxmi
  const match1 = fuzzyStudentMatch('Laxmi', 'Lakshmi Narayanan', 'YP-6A-012');
  assert.equal(match1.matches, true);

  // Karthick vs Karthik
  const match2 = fuzzyStudentMatch('Karthick', 'Karthik Swaminathan', 'YP-5A-044');
  assert.equal(match2.matches, true);

  // Student ID search
  const match3 = fuzzyStudentMatch('5A-044', 'Karthik', 'YP-5A-044');
  assert.equal(match3.matches, true);
});
