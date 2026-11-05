/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Utility functions and seed data for PM-POSHAN School Meal Photo Gallery
 */

import { MealPhoto, MealPhotoFilter, GalleryStats } from '../types/mealPhoto';

/**
 * Initial curated PM-POSHAN school meal photos showcasing authentic South Indian
 * government school mid-day meals, fresh ingredients, and kitchen operations.
 */
export const SEED_MEAL_PHOTOS: MealPhoto[] = [
  {
    id: 'meal-photo-001',
    title: 'Hot Sambar Rice with Moringa & Yardlong Beans',
    session: 'midday_lunch',
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(), // 42 mins ago
    photoUrl: '/src/assets/images/midday_meal_serving_1792949878283.jpg',
    staffName: 'Radhamma K.',
    staffRole: 'Head Cook (SHG Lead)',
    caloriesKcal: 565,
    proteinGrams: 18.2,
    temperatureC: 71,
    portionsServed: 125,
    qualityGrade: 'A+',
    tags: ['Toor Dal', 'Moringa', 'Hot Served', 'SDMC Inspected'],
    notes: 'Drumsticks and fresh greens harvested from school Poshan Vatika nutrition garden this morning.',
    isLiveCaptured: true,
    schoolName: 'GHPS Byatarayanapura, Bengaluru Urban',
    compliancePassed: true,
  },
  {
    id: 'meal-photo-002',
    title: 'Farm-Fresh Sambar Vegetables & Cold-Pressed Spices',
    session: 'midday_lunch',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
    photoUrl: '/src/assets/images/nutrition_fresh_ingredients_1792949876730.jpg',
    staffName: 'Parvati Bai',
    staffRole: 'Kitchen Assistant',
    caloriesKcal: 540,
    proteinGrams: 16.5,
    temperatureC: 68,
    portionsServed: 125,
    qualityGrade: 'A+',
    tags: ['Fresh Prep', 'Carrot', 'Toor Dal', 'Hygiene Grade A'],
    notes: 'Pre-cooking batch inspection: verified FSSAI-certified double-fortified iodized salt and iron-fortified oil.',
    isLiveCaptured: true,
    schoolName: 'GHPS Byatarayanapura, Bengaluru Urban',
    compliancePassed: true,
  },
  {
    id: 'meal-photo-003',
    title: 'Warm Finger Millet (Ragi Malt) with Jaggery',
    session: 'morning_snack',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), // Morning 9:45 AM
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    staffName: 'Smt. Anitha Shenoy',
    staffRole: 'Teacher In-Charge',
    caloriesKcal: 195,
    proteinGrams: 6.8,
    temperatureC: 64,
    portionsServed: 124,
    qualityGrade: 'A',
    tags: ['Millets', 'Calcium Rich', 'Morning Fuel', 'Karnataka Ksheera'],
    notes: 'Served at 10:00 AM break. 100% attendance participation recorded.',
    isLiveCaptured: false,
    schoolName: 'GHPS Byatarayanapura, Bengaluru Urban',
    compliancePassed: true,
  },
  {
    id: 'meal-photo-004',
    title: 'Nutritious Bisi Bele Bath with Crisp Poriyal & Curd',
    session: 'midday_lunch',
    timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), // Yesterday lunch
    photoUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    staffName: 'Manjula R.',
    staffRole: 'SDMC Parent Representative',
    caloriesKcal: 580,
    proteinGrams: 19.5,
    temperatureC: 72,
    portionsServed: 126,
    qualityGrade: 'A+',
    tags: ['Traditional Recipe', 'Ghee Tempered', 'High Protein'],
    notes: 'Parent committee sampled meal at 12:40 PM. Taste, warmth, and texture rated outstanding.',
    isLiveCaptured: false,
    schoolName: 'GHPS Byatarayanapura, Bengaluru Urban',
    compliancePassed: true,
  },
  {
    id: 'meal-photo-005',
    title: 'Hard-Boiled Farm Eggs & Sprouted Chana Sundal',
    session: 'evening_supplement',
    timestamp: new Date(Date.now() - 29 * 3600 * 1000).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80',
    staffName: 'Radhamma K.',
    staffRole: 'Head Cook (SHG Lead)',
    caloriesKcal: 210,
    proteinGrams: 13.4,
    temperatureC: 60,
    portionsServed: 122,
    qualityGrade: 'A+',
    tags: ['Poultry Egg', 'Sprouted Moong', 'High Biological Protein'],
    notes: 'Alternative bananas and fortified peanut chikki provided for vegetarian students.',
    isLiveCaptured: false,
    schoolName: 'GHPS Byatarayanapura, Bengaluru Urban',
    compliancePassed: true,
  },
  {
    id: 'meal-photo-006',
    title: 'Steamed Rice with Tomato Rasam & Potato Beetroot Poriyal',
    session: 'midday_lunch',
    timestamp: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    staffName: 'Kavitha M.',
    staffRole: 'Health Worker (ASHA)',
    caloriesKcal: 530,
    proteinGrams: 15.1,
    temperatureC: 67,
    portionsServed: 123,
    qualityGrade: 'A',
    tags: ['Iron Enriched', 'Rasam', 'Local Produce'],
    notes: 'Beetroot poriyal prepared to combat mild nutritional anemia identified in 7A screening.',
    isLiveCaptured: false,
    schoolName: 'GHPS Byatarayanapura, Bengaluru Urban',
    compliancePassed: true,
  }
];

/**
 * Filter meal photos by session, search keywords, and date range
 */
export function filterMealPhotos(photos: MealPhoto[], filter: MealPhotoFilter): MealPhoto[] {
  return photos.filter((item) => {
    // Session filter
    if (filter.session !== 'all' && item.session !== filter.session) {
      return false;
    }

    // Live snapped filter
    if (filter.liveOnly && !item.isLiveCaptured) {
      return false;
    }

    // Date range filter
    if (filter.dateRange !== 'all') {
      const itemDate = new Date(item.timestamp);
      const now = new Date();
      const diffHours = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60);

      if (filter.dateRange === 'today') {
        const isSameDay =
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear();
        if (!isSameDay && diffHours > 18) return false;
      } else if (filter.dateRange === 'recent') {
        if (diffHours > 72) return false;
      }
    }

    // Search query filter (title, staffName, tags, notes)
    if (filter.searchQuery.trim()) {
      const query = filter.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchStaff = item.staffName.toLowerCase().includes(query);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
      const matchNotes = item.notes?.toLowerCase().includes(query);
      if (!matchTitle && !matchStaff && !matchTags && !matchNotes) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validate new photo submission payload
 */
export function validateMealPhotoSubmission(data: Partial<MealPhoto>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Menu title must be at least 3 characters long');
  }

  if (!data.photoUrl || (!data.photoUrl.startsWith('data:image/') && !data.photoUrl.startsWith('/') && !data.photoUrl.startsWith('http'))) {
    errors.push('A valid meal photo must be taken with the camera or uploaded');
  }

  if (!data.staffName || data.staffName.trim().length < 2) {
    errors.push('Kitchen staff / inspector name is required');
  }

  if (typeof data.portionsServed === 'number' && (data.portionsServed <= 0 || data.portionsServed > 2000)) {
    errors.push('Portions served must be between 1 and 2,000 plates');
  }

  if (typeof data.temperatureC === 'number' && (data.temperatureC < 15 || data.temperatureC > 105)) {
    errors.push('Meal serving temperature must be within 15°C - 105°C');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Compute aggregate statistics for gallery stream
 */
export function computeGalleryStats(photos: MealPhoto[]): GalleryStats {
  if (photos.length === 0) {
    return {
      totalPhotos: 0,
      todayCount: 0,
      liveCapturedCount: 0,
      complianceRate: 100,
      avgCalories: 0,
      avgProtein: 0,
      avgTemperature: 0,
    };
  }

  const now = new Date();
  let todayCount = 0;
  let liveCapturedCount = 0;
  let compliantCount = 0;
  let totalCalories = 0;
  let totalProtein = 0;
  let totalTemp = 0;

  for (const p of photos) {
    const pDate = new Date(p.timestamp);
    const diffHours = (now.getTime() - pDate.getTime()) / (1000 * 60 * 60);
    const isSameDay =
      pDate.getDate() === now.getDate() &&
      pDate.getMonth() === now.getMonth() &&
      pDate.getFullYear() === now.getFullYear();

    if (isSameDay || diffHours <= 18) {
      todayCount += 1;
    }

    if (p.isLiveCaptured) {
      liveCapturedCount += 1;
    }

    if (p.compliancePassed) {
      compliantCount += 1;
    }

    totalCalories += p.caloriesKcal || 0;
    totalProtein += p.proteinGrams || 0;
    totalTemp += p.temperatureC || 0;
  }

  return {
    totalPhotos: photos.length,
    todayCount,
    liveCapturedCount,
    complianceRate: Math.round((compliantCount / photos.length) * 100),
    avgCalories: Math.round(totalCalories / photos.length),
    avgProtein: Number((totalProtein / photos.length).toFixed(1)),
    avgTemperature: Math.round(totalTemp / photos.length),
  };
}

/**
 * Format relative timestamp for display
 */
export function formatPhotoTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    if (diffHours < 48) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return timestamp;
  }
}

/**
 * Resizes and compresses an image File to a lightweight Base64 string for safe localStorage
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1024,
  maxHeight = 768,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Apply clean smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
