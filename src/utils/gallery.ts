/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Meal Gallery Utility Models and Pure Logic
 */

export interface MealPhoto {
  id: string;
  imageUrl: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  mealType: 'lunch' | 'snack';
  title: string;
  description: string;
  items: string[];
  caloriesSuppliedKcal: number;
  proteinGrams: number;
  uploadedBy: string;
  uploaderRole: 'cook' | 'kitchen_supervisor' | 'teacher' | 'parent';
  isVerified: boolean;
  temperatureNote?: string;
}

export const INITIAL_MEAL_PHOTOS: MealPhoto[] = [
  {
    id: 'mp-1',
    imageUrl: '/src/assets/images/school_meal_thali_1793076553795.jpg',
    date: '2026-10-26',
    time: '12:25',
    mealType: 'lunch',
    title: 'Standard Upper Primary Thali (Mon)',
    description: 'Freshly steamed Sona Masoori rice served with hot toor dal drumstick sambar, grade-A boiled egg, and sprouted green gram sundal.',
    items: ['Steamed Rice (150g)', 'Toor Dal Sambar (120g)', 'Boiled Egg (50g)', 'Sprouted Sundal (40g)'],
    caloriesSuppliedKcal: 712,
    proteinGrams: 21.8,
    uploadedBy: 'Muniyamma (Head Cook)',
    uploaderRole: 'cook',
    isVerified: true,
    temperatureNote: 'Steaming Hot (>68°C)',
  },
  {
    id: 'mp-2',
    imageUrl: '/src/assets/images/ragi_mudde_meal_1793076553487.jpg',
    date: '2026-10-24',
    time: '12:30',
    mealType: 'lunch',
    title: 'Karnataka Ragi Mudde Special (Thu)',
    description: 'Traditional finger millet Ragi Mudde served with mixed vegetable saaru, steamed rice, and drumstick leaf poriyal for natural iron fortification.',
    items: ['Ragi Mudde (125g)', 'Steamed Rice (60g)', 'Mixed Vegetable Saaru (120g)', 'Moringa Leaf Poriyal (40g)'],
    caloriesSuppliedKcal: 735,
    proteinGrams: 20.4,
    uploadedBy: 'Gangadhar (Kitchen Supervisor)',
    uploaderRole: 'kitchen_supervisor',
    isVerified: true,
    temperatureNote: 'Fresh & Hot (>70°C)',
  },
  {
    id: 'mp-3',
    imageUrl: '/src/assets/images/midday_meal_serving_1792949878283.jpg',
    date: '2026-10-23',
    time: '12:40',
    mealType: 'lunch',
    title: 'Courtyard Mid-Day Meal Serving Session',
    description: 'Students in Grade 6A dining together in the shaded school veranda. Orderly queue and stainless steel plates sanitized with boiling water.',
    items: ['Bisi Bele Bath (220g)', 'Boiled Egg (50g)', 'Peanut Chikki (25g)'],
    caloriesSuppliedKcal: 698,
    proteinGrams: 19.6,
    uploadedBy: 'Anitha Shenoy (Class Teacher)',
    uploaderRole: 'teacher',
    isVerified: true,
    temperatureNote: 'Served Hot',
  },
  {
    id: 'mp-4',
    imageUrl: '/src/assets/images/nutrition_fresh_ingredients_1792949876730.jpg',
    date: '2026-10-26',
    time: '08:45',
    mealType: 'lunch',
    title: 'Morning Raw Ingredient Inspection',
    description: 'Inspection of fresh farm-procured drumsticks, moringa leaves, grade-A eggs, and unpolished toor dal before cooking commence.',
    items: ['Toor Dal', 'Moringa Greens', 'Farm Fresh Eggs', 'Sona Masoori Rice'],
    caloriesSuppliedKcal: 0,
    proteinGrams: 0,
    uploadedBy: 'Gangadhar (Kitchen Supervisor)',
    uploaderRole: 'kitchen_supervisor',
    isVerified: true,
    temperatureNote: 'Raw Ingredient Audit',
  },
];

export interface MealPhotoFilterOptions {
  mealType?: 'all' | 'lunch' | 'snack';
  verifiedOnly?: boolean;
  searchQuery?: string;
}

export function filterMealPhotos(
  photos: MealPhoto[],
  options: MealPhotoFilterOptions = {}
): MealPhoto[] {
  const { mealType = 'all', verifiedOnly = false, searchQuery = '' } = options;
  const q = searchQuery.toLowerCase().trim();

  return photos.filter((photo) => {
    if (mealType !== 'all' && photo.mealType !== mealType) {
      return false;
    }
    if (verifiedOnly && !photo.isVerified) {
      return false;
    }
    if (q) {
      const matchTitle = photo.title.toLowerCase().includes(q);
      const matchDesc = photo.description.toLowerCase().includes(q);
      const matchItems = photo.items.some((item) => item.toLowerCase().includes(q));
      const matchUploader = photo.uploadedBy.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchItems && !matchUploader) {
        return false;
      }
    }
    return true;
  });
}

export function validateImageUpload(file: { size: number; type: string }): {
  isValid: boolean;
  errorMessage?: string;
} {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

  if (!file) {
    return { isValid: false, errorMessage: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !file.type.startsWith('image/')) {
    return {
      isValid: false,
      errorMessage: 'Please upload a valid JPEG, PNG, or WebP photo.',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      errorMessage: 'Image size exceeds 10MB limit. Please choose a smaller photo.',
    };
  }

  return { isValid: true };
}
