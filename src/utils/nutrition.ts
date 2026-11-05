/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * YuvaPoshan Nutrition & Calorie Calculation Engine
 * Note: Calories represent "food supplied per child", NEVER "food eaten".
 * Formula: (grams per child × kcal per 100g ÷ 100) × children served
 */

export interface FoodItem {
  id: string;
  name: string;
  localName: {
    kn: string; // Kannada
    ta: string; // Tamil
    te: string; // Telugu
    ml: string; // Malayalam
  };
  category: 'cereal' | 'pulse' | 'vegetable' | 'dairy' | 'egg_protein' | 'millets';
  kcalPer100g: number;
  proteinPer100g: number; // in grams
  ironPer100g: number; // in mg
  sourceReference: string; // e.g., "ICMR-NIN IFCT 2020"
  defaultGramsPerChild: number;
}

export interface MealLogEntry {
  foodItemId: string;
  gramsPerChild: number;
  childrenServed: number;
  mealType: 'morning_snack' | 'lunch';
  date: string;
}

export interface NutritionCalculationResult {
  gramsPerChild: number;
  childrenServed: number;
  caloriesSuppliedPerChild: number; // kcal per child
  totalCaloriesSupplied: number; // kcal total
  proteinSuppliedPerChild: number; // g per child
  ironSuppliedPerChild: number; // mg per child
  complianceNotice: string;
}

export const DISCLAIMER_NUTRITION =
  'Notice: Figures indicate food supplied per child as per school mid-day meal guidelines and inventory logs. They do not measure individual food intake or consumption, and are strictly informational for record-keeping and dietary planning.';

export function calculateMealCalories(
  gramsPerChild: number,
  kcalPer100g: number,
  childrenServed: number
): { perChildKcal: number; totalKcal: number } {
  if (gramsPerChild < 0 || kcalPer100g < 0 || childrenServed < 0) {
    throw new Error('Input quantities must be non-negative.');
  }

  const perChildKcal = Number(((gramsPerChild * kcalPer100g) / 100).toFixed(1));
  const totalKcal = Math.round(perChildKcal * childrenServed);

  return {
    perChildKcal,
    totalKcal,
  };
}

export function computeMealNutrition(
  foodItem: FoodItem,
  gramsPerChild: number,
  childrenServed: number
): NutritionCalculationResult {
  const { perChildKcal, totalKcal } = calculateMealCalories(
    gramsPerChild,
    foodItem.kcalPer100g,
    childrenServed
  );

  const proteinSuppliedPerChild = Number(
    ((gramsPerChild * foodItem.proteinPer100g) / 100).toFixed(1)
  );
  const ironSuppliedPerChild = Number(
    ((gramsPerChild * foodItem.ironPer100g) / 100).toFixed(2)
  );

  return {
    gramsPerChild,
    childrenServed,
    caloriesSuppliedPerChild: perChildKcal,
    totalCaloriesSupplied: totalKcal,
    proteinSuppliedPerChild,
    ironSuppliedPerChild,
    complianceNotice: DISCLAIMER_NUTRITION,
  };
}

/**
 * Standard midday meal targets (ICMR / PM-POSHAN guidelines for Upper Primary Grade 5-8):
 * Recommended target: ~700 kcal and 20g protein for Upper Primary lunch.
 */
export const UPPER_PRIMARY_TARGET = {
  minKcal: 650,
  targetKcal: 700,
  maxKcal: 850,
  targetProteinGrams: 20,
};
