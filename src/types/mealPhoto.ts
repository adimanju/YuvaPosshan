/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Meal Photo and Kitchen Camera Stream Type Definitions
 * Represents authenticated photos of school meals served under PM-POSHAN.
 */

export type MealSession = 'morning_snack' | 'midday_lunch' | 'evening_supplement';

export type QualityGrade = 'A+' | 'A' | 'B+' | 'Pending';

export interface MealPhoto {
  id: string;
  title: string;
  session: MealSession;
  timestamp: string; // ISO 8601 string or formatted time
  photoUrl: string; // Base64 data URL, asset path, or remote URL
  staffName: string;
  staffRole: string; // e.g., 'Head Cook', 'Assistant Cook', 'SDMC Member', 'Teacher'
  caloriesKcal: number;
  proteinGrams: number;
  temperatureC: number;
  portionsServed: number;
  qualityGrade: QualityGrade;
  tags: string[];
  notes?: string;
  isLiveCaptured: boolean;
  schoolName?: string;
  compliancePassed: boolean;
}

export interface MealPhotoFilter {
  session: 'all' | MealSession;
  searchQuery: string;
  dateRange: 'all' | 'today' | 'recent';
  liveOnly?: boolean;
}

export interface GalleryStats {
  totalPhotos: number;
  todayCount: number;
  liveCapturedCount: number;
  complianceRate: number;
  avgCalories: number;
  avgProtein: number;
  avgTemperature: number;
}
