/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert';
import {
  INITIAL_MEAL_PHOTOS,
  filterMealPhotos,
  validateImageUpload,
} from './gallery';

test('Gallery: filterMealPhotos filters by query correctly', () => {
  const ragiResults = filterMealPhotos(INITIAL_MEAL_PHOTOS, { searchQuery: 'ragi' });
  assert.strictEqual(ragiResults.length, 1);
  assert.strictEqual(ragiResults[0].title.includes('Ragi'), true);

  const eggResults = filterMealPhotos(INITIAL_MEAL_PHOTOS, { searchQuery: 'egg' });
  assert.strictEqual(eggResults.length >= 2, true);
});

test('Gallery: filterMealPhotos respects verifiedOnly and mealType', () => {
  const verified = filterMealPhotos(INITIAL_MEAL_PHOTOS, { verifiedOnly: true });
  assert.strictEqual(verified.length, INITIAL_MEAL_PHOTOS.length);

  const nonExistentSnack = filterMealPhotos(INITIAL_MEAL_PHOTOS, { mealType: 'snack' });
  assert.strictEqual(nonExistentSnack.length, 0);
});

test('Gallery: validateImageUpload checks file size and type', () => {
  const valid = validateImageUpload({ size: 1024 * 100, type: 'image/jpeg' });
  assert.strictEqual(valid.isValid, true);

  const tooLarge = validateImageUpload({ size: 15 * 1024 * 1024, type: 'image/jpeg' });
  assert.strictEqual(tooLarge.isValid, false);
  assert.strictEqual(tooLarge.errorMessage?.includes('10MB'), true);

  const invalidType = validateImageUpload({ size: 1024, type: 'application/pdf' });
  assert.strictEqual(invalidType.isValid, false);
});
