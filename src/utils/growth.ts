/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan Child Growth & Physical Measurement Engine
 * 
 * IMPORTANT: This module is strictly an information and record-keeping tool.
 * It is NOT a diagnostic tool. Every growth or nutrition output carries
 * a visible, plain-language note that it is informational and should be
 * reviewed by a qualified healthcare professional.
 */

export const DISCLAIMER_GROWTH =
  'Informational note: This tool computes reference statistical growth indicators for school record-keeping only. It is NOT a clinical diagnosis or medical evaluation. All measurements and categories should be reviewed by a qualified healthcare professional or pediatrician.';

export interface MeasurementInput {
  heightCm: number;
  weightKg: number;
  ageYears: number;
  gender: 'female' | 'male' | 'other';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export type GrowthStatusCategory =
  | 'severe_thinness'
  | 'underweight'
  | 'healthy_weight'
  | 'at_risk_overweight'
  | 'marked_for_review';

export interface GrowthEvaluation {
  bmi: number;
  category: GrowthStatusCategory;
  categoryLabel: string;
  categoryColor: string;
  isFlaggedForReview: boolean;
  disclaimer: string;
}

/**
 * Validates physical measurements according to specified domain boundaries:
 * Height: 100 to 190 cm
 * Weight: 15 to 100 kg
 * Age: 9 to 16 years
 */
export function validateMeasurementInputs(input: Partial<MeasurementInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.heightCm === undefined || input.heightCm === null || isNaN(input.heightCm)) {
    errors.heightCm = 'Height is required.';
  } else if (input.heightCm < 100 || input.heightCm > 190) {
    errors.heightCm = 'Height must be between 100 cm and 190 cm.';
  }

  if (input.weightKg === undefined || input.weightKg === null || isNaN(input.weightKg)) {
    errors.weightKg = 'Weight is required.';
  } else if (input.weightKg < 15 || input.weightKg > 100) {
    errors.weightKg = 'Weight must be between 15 kg and 100 kg.';
  }

  if (input.ageYears === undefined || input.ageYears === null || isNaN(input.ageYears)) {
    errors.ageYears = 'Age is required.';
  } else if (input.ageYears < 9 || input.ageYears > 16) {
    errors.ageYears = 'Age must be between 9 and 16 years.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates Body Mass Index: weight (kg) / [height (m)]^2
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive numbers.');
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Number(bmi.toFixed(1));
}

/**
 * Evaluates child BMI against WHO / Indian Academy of Pediatrics (IAP) upper primary reference bands
 * Children with indicators outside agreed thresholds are marked for health professional review.
 * No automated medical action is ever taken.
 */
export function evaluateGrowthIndicator(
  bmi: number,
  ageYears: number,
  _gender: 'female' | 'male' | 'other' = 'female'
): GrowthEvaluation {
  // Approximate age-adjusted BMI percentiles for Upper Primary school age (10-14y)
  // Normal range roughly 14.5 to 21.5 depending on exact age
  let category: GrowthStatusCategory = 'healthy_weight';
  let categoryLabel = 'Healthy Range';
  let categoryColor = 'emerald';
  let isFlaggedForReview = false;

  const lowerBound = 14.0 + (ageYears - 10) * 0.25;
  const severeLower = lowerBound - 2.0;
  const upperBound = 21.0 + (ageYears - 10) * 0.6;
  const highRisk = upperBound + 3.0;

  if (bmi < severeLower) {
    category = 'severe_thinness';
    categoryLabel = 'Marked for Health Review (Low)';
    categoryColor = 'rose';
    isFlaggedForReview = true;
  } else if (bmi < lowerBound) {
    category = 'underweight';
    categoryLabel = 'Underweight Indicator';
    categoryColor = 'amber';
    isFlaggedForReview = true;
  } else if (bmi > highRisk) {
    category = 'marked_for_review';
    categoryLabel = 'Marked for Health Review (High)';
    categoryColor = 'rose';
    isFlaggedForReview = true;
  } else if (bmi > upperBound) {
    category = 'at_risk_overweight';
    categoryLabel = 'At-Risk Overweight';
    categoryColor = 'amber';
    isFlaggedForReview = true;
  } else {
    category = 'healthy_weight';
    categoryLabel = 'Within Reference Range';
    categoryColor = 'emerald';
    isFlaggedForReview = false;
  }

  return {
    bmi,
    category,
    categoryLabel,
    categoryColor,
    isFlaggedForReview,
    disclaimer: DISCLAIMER_GROWTH,
  };
}
