/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Weekly Meal Plan Models and Pure Logic
 * Grounded in PM-POSHAN Karnataka & South Indian School Menu Guidelines
 * Target: Upper Primary (Grades 5-8) >= 700 kcal & >= 20g protein
 */

export interface DailyMenuItem {
  category: 'cereal' | 'pulses' | 'vegetable' | 'protein' | 'dairy_snack';
  nameEn: string;
  nameKn: string;
  nameTa: string;
  portionGrams: number;
}

export interface DailyMenuPlan {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  dayIndex: number; // 1 (Mon) - 6 (Sat)
  dayNativeKn: string;
  dayNativeTa: string;
  theme: string;
  mainCourse: string;
  accompaniment: string;
  proteinSupplement: string;
  vegetableFeature: string;
  morningBeverage?: string;
  caloriesSuppliedKcal: number;
  proteinGrams: number;
  ironMg: number;
  isVegetarianDefault: boolean;
  eggServed: boolean;
  vegetarianAlternative: string;
  items: DailyMenuItem[];
  prepNotes: string;
}

export const PM_POSHAN_UPPER_PRIMARY_TARGETS = {
  minCaloriesKcal: 700,
  minProteinGrams: 20,
  minFoodGrainGrams: 150,
  minPulsesGrams: 30,
  minVegetablesGrams: 75,
};

export const STANDARD_WEEKLY_MENU: DailyMenuPlan[] = [
  {
    dayOfWeek: 'Monday',
    dayIndex: 1,
    dayNativeKn: 'ಸೋಮವಾರ',
    dayNativeTa: 'திங்கட்கிழமை',
    theme: 'Immunity & Iron Boost',
    mainCourse: 'Steamed Sona Masoori Rice',
    accompaniment: 'Drumstick & Moringa Leaf Sambar',
    proteinSupplement: 'Boiled Egg (Grade A, 50g)',
    vegetableFeature: 'Carrot, Drumstick & Moringa greens',
    morningBeverage: 'Ksheera Bhagya Fortified Milk (150 ml)',
    caloriesSuppliedKcal: 715,
    proteinGrams: 21.5,
    ironMg: 5.2,
    isVegetarianDefault: true,
    eggServed: true,
    vegetarianAlternative: 'Sprouted Green Gram Sundal (50g)',
    items: [
      { category: 'cereal', nameEn: 'Sona Masoori Rice', nameKn: 'ಸೋನಾ ಮಸೂರಿ ಅನ್ನ', nameTa: 'சாதம்', portionGrams: 150 },
      { category: 'pulses', nameEn: 'Toor Dal Sambar', nameKn: 'ತೊಗರಿ ಬೇಳೆ ಸಾಂಬಾರ್', nameTa: 'சாம்பார்', portionGrams: 120 },
      { category: 'protein', nameEn: 'Boiled Egg (or Sundal)', nameKn: 'ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ / ಸುಂಡಲ್', nameTa: 'வேகவைத்த முட்டை', portionGrams: 50 },
      { category: 'vegetable', nameEn: 'Moringa Greens & Drumstick', nameKn: 'ನುಗ್ಗೆಸೊಪ್ಪು ಮತ್ತು ನುಗ್ಗೆಕಾಯಿ', nameTa: 'முருங்கைக்கீரை', portionGrams: 40 },
    ],
    prepNotes: 'Drumsticks sourced locally from taluk agricultural cooperative. Sambar cooked in stainless steel cauldrons at >85°C.',
  },
  {
    dayOfWeek: 'Tuesday',
    dayIndex: 2,
    dayNativeKn: 'ಮಂಗಳವಾರ',
    dayNativeTa: 'செவ்வாய்க்கிழமை',
    theme: 'Warm Spice & High Energy',
    mainCourse: 'Karnataka Bisi Bele Bath',
    accompaniment: 'Fresh Curd & Spiced Boondi',
    proteinSupplement: 'Boiled Egg (Grade A, 50g)',
    vegetableFeature: 'French Beans, Diced Carrots & Green Peas',
    caloriesSuppliedKcal: 725,
    proteinGrams: 22.2,
    ironMg: 4.8,
    isVegetarianDefault: true,
    eggServed: true,
    vegetarianAlternative: 'Jaggery Peanut Chikki (25g)',
    items: [
      { category: 'cereal', nameEn: 'Bisi Bele Bath (Rice + Dal)', nameKn: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್', nameTa: 'சாம்பார் சாதம்', portionGrams: 220 },
      { category: 'dairy_snack', nameEn: 'Curd / Buttermilk', nameKn: 'ಮೊಸರು / ಮಜ್ಜಿಗೆ', nameTa: 'தயிர்', portionGrams: 80 },
      { category: 'protein', nameEn: 'Boiled Egg (or Peanut Chikki)', nameKn: 'ಮೊಟ್ಟೆ / ಕಡಲೆಕಾಯಿ ಚಿಕ್ಕಿ', nameTa: 'முட்டை / கடலை மிட்டாய்', portionGrams: 50 },
      { category: 'vegetable', nameEn: 'Mixed Vegetable Medley', nameKn: 'ತರಕಾರಿ ಮಿಶ್ರಣ', nameTa: 'காய்கறி கலவை', portionGrams: 50 },
    ],
    prepNotes: 'Bisi Bele masala freshly ground. Fortified double-toned milk curd supplied for digestion and gut health.',
  },
  {
    dayOfWeek: 'Wednesday',
    dayIndex: 3,
    dayNativeKn: 'ಬುಧವಾರ',
    dayNativeTa: 'புதன்கிழமை',
    theme: 'Fiber & Whole Legumes',
    mainCourse: 'Steamed Rice with Ghee Droplet',
    accompaniment: 'Mixed Vegetable Sambar (Kumbalakai & Tomato)',
    proteinSupplement: 'Sprouted Bengal Gram Sundal',
    vegetableFeature: 'Ash Gourd, Tomato & Curry Leaf Tempering',
    morningBeverage: 'Ksheera Bhagya Fortified Milk (150 ml)',
    caloriesSuppliedKcal: 705,
    proteinGrams: 20.8,
    ironMg: 5.6,
    isVegetarianDefault: true,
    eggServed: false,
    vegetarianAlternative: 'Sprouted Bengal Gram Sundal (all children)',
    items: [
      { category: 'cereal', nameEn: 'Steamed Rice', nameKn: 'ಬಿಸಿ ಅನ್ನ', nameTa: 'சாதம்', portionGrams: 150 },
      { category: 'pulses', nameEn: 'Mixed Dal Sambar', nameKn: 'ಮಿಶ್ರ ಬೇಳೆ ಸಾರು', nameTa: 'பருப்பு சாம்பார்', portionGrams: 120 },
      { category: 'protein', nameEn: 'Sprouted Chickpea Sundal', nameKn: 'ಮೊಳಕೆ ಕಾಳು ಉಸಲಿ', nameTa: 'சுண்டல்', portionGrams: 60 },
      { category: 'vegetable', nameEn: 'Pumpkin & Tomato Gravy', nameKn: 'ಕುಂಬಳಕಾಯಿ ಪಲ್ಯ', nameTa: 'பூசணிக்காய்', portionGrams: 50 },
    ],
    prepNotes: 'Whole sprouted pulses soaked 18 hours prior for enhanced zinc, iron bioavailability and enzyme activation.',
  },
  {
    dayOfWeek: 'Thursday',
    dayIndex: 4,
    dayNativeKn: 'ಗುರುವಾರ',
    dayNativeTa: 'வியாழக்கிழமை',
    theme: 'Millet Heritage (Karnataka Special)',
    mainCourse: 'Ragi Mudde (Finger Millet Ball) + Steamed Rice',
    accompaniment: 'Traditional Mixed Green Saaru (Bassaru)',
    proteinSupplement: 'Boiled Egg (Grade A, 50g)',
    vegetableFeature: 'Steamed Greens (Dill & Amaranth leaves) Poriyal',
    caloriesSuppliedKcal: 745,
    proteinGrams: 23.4,
    ironMg: 7.4,
    isVegetarianDefault: true,
    eggServed: true,
    vegetarianAlternative: 'Roasted Soyabean & Peanut Mix (40g)',
    items: [
      { category: 'cereal', nameEn: 'Ragi Mudde (Finger Millet)', nameKn: 'ರಾಗಿ ಮುದ್ದೆ', nameTa: 'கேழ்வரகு களி', portionGrams: 130 },
      { category: 'cereal', nameEn: 'Steamed Rice', nameKn: 'ಅನ್ನ', nameTa: 'சாதம்', portionGrams: 60 },
      { category: 'pulses', nameEn: 'Dill & Gram Bassaru', nameKn: 'ಸಬ್ಬಕ್ಕಿ ಬಸ್ಸಾರು', nameTa: 'கீரை சாறு', portionGrams: 120 },
      { category: 'protein', nameEn: 'Boiled Egg (or Soyabean Mix)', nameKn: 'ಮೊಟ್ಟೆ / ಸೋಯಾಬೀನ್ ಮಿಶ್ರಣ', nameTa: 'முட்டை', portionGrams: 50 },
    ],
    prepNotes: 'Organic finger millet flour sourced under Karnataka Millets Mission. Rich in calcium (344mg/100g) and natural fiber.',
  },
  {
    dayOfWeek: 'Friday',
    dayIndex: 5,
    dayNativeKn: 'ಶುಕ್ರವಾರ',
    dayNativeTa: 'வெள்ளிக்கிழமை',
    theme: 'Vegetable Pulao & Soya Protein',
    mainCourse: 'Aromatic Vegetable Pulao with Soya Chunks',
    accompaniment: 'Cooling Mint Onion Curd Raita',
    proteinSupplement: 'Boiled Egg (Grade A, 50g)',
    vegetableFeature: 'Green Peas, Mint, Coriander & French Beans',
    morningBeverage: 'Ksheera Bhagya Fortified Milk (150 ml)',
    caloriesSuppliedKcal: 720,
    proteinGrams: 22.0,
    ironMg: 5.1,
    isVegetarianDefault: true,
    eggServed: true,
    vegetarianAlternative: 'Sprouted Green Moong & Coconut Sundal (50g)',
    items: [
      { category: 'cereal', nameEn: 'Vegetable & Soya Pulao', nameKn: 'ತರಕಾರಿ ಪಲಾವ್', nameTa: 'காய்கறி புலாவ்', portionGrams: 200 },
      { category: 'dairy_snack', nameEn: 'Pachadi / Raita', nameKn: 'ಮೊಸರು ಬಜ್ಜಿ', nameTa: 'பச்சடி', portionGrams: 80 },
      { category: 'protein', nameEn: 'Boiled Egg (or Moong Sundal)', nameKn: 'ಮೊಟ್ಟೆ / ಹೆಸರುಕಾಳು ಸುಂಡಲ್', nameTa: 'முட்டை', portionGrams: 50 },
      { category: 'vegetable', nameEn: 'Mint, Peas & Carrot Medley', nameKn: 'ಪುದೀನಾ ಮತ್ತು ಬಟಾಣಿ', nameTa: 'புதினா காய்கறி', portionGrams: 40 },
    ],
    prepNotes: 'Soya chunks cooked tender with mild spices and whole cumin seeds. High child acceptance rating (4.8/5.0).',
  },
  {
    dayOfWeek: 'Saturday',
    dayIndex: 6,
    dayNativeKn: 'ಶನಿವಾರ',
    dayNativeTa: 'சனிக்கிழமை',
    theme: 'Half-Day Light & Energizing Menu',
    mainCourse: 'Lemon Rice (Chitranna) / Vegetable Khichdi',
    accompaniment: 'Fresh Coconut Coriander Chutney',
    proteinSupplement: 'Roasted Peanut Chikki (30g)',
    vegetableFeature: 'Curry Leaves, Green Chilli & Grated Carrot Garnish',
    morningBeverage: 'Ksheera Bhagya Fortified Milk (150 ml)',
    caloriesSuppliedKcal: 680,
    proteinGrams: 18.5,
    ironMg: 4.2,
    isVegetarianDefault: true,
    eggServed: false,
    vegetarianAlternative: 'All children receive Jaggery Peanut Chikki',
    items: [
      { category: 'cereal', nameEn: 'Lemon Rice (Chitranna)', nameKn: 'ಚಿತ್ರಾನ್ನ', nameTa: 'எலுமிச்சை சாதம்', portionGrams: 180 },
      { category: 'pulses', nameEn: 'Roasted Chana Chutney', nameKn: 'ಕಾಯಿ ಚಟ್ನಿ', nameTa: 'தேங்காய் சட்னி', portionGrams: 50 },
      { category: 'protein', nameEn: 'Jaggery Peanut Chikki', nameKn: 'ಕಡಲೆಕಾಯಿ ಚಿಕ್ಕಿ', nameTa: 'கடலை மிட்டாய்', portionGrams: 30 },
      { category: 'dairy_snack', nameEn: 'Fortified Hot Milk', nameKn: 'ಬಿಸಿ ಹಾಲು', nameTa: 'பால்', portionGrams: 150 },
    ],
    prepNotes: 'Saturday morning session concludes at 12:30 PM. Warm milk served at 9:30 AM interval, followed by hot lunch before departure.',
  },
];

export function getWeeklyMenu(): DailyMenuPlan[] {
  return STANDARD_WEEKLY_MENU;
}

export function getTodayMenu(date: Date = new Date()): DailyMenuPlan {
  const day = date.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  if (day === 0) {
    // On Sunday, show Monday's upcoming menu
    return STANDARD_WEEKLY_MENU[0];
  }
  return STANDARD_WEEKLY_MENU[day - 1] || STANDARD_WEEKLY_MENU[0];
}

export function calculateWeeklyAverages(menu: DailyMenuPlan[] = STANDARD_WEEKLY_MENU) {
  if (!menu || menu.length === 0) {
    return { avgCalories: 0, avgProtein: 0, avgIron: 0, compliantDays: 0 };
  }

  const totals = menu.reduce(
    (acc, item) => ({
      calories: acc.calories + item.caloriesSuppliedKcal,
      protein: acc.protein + item.proteinGrams,
      iron: acc.iron + item.ironMg,
      compliant:
        acc.compliant +
        (item.caloriesSuppliedKcal >= PM_POSHAN_UPPER_PRIMARY_TARGETS.minCaloriesKcal &&
        item.proteinGrams >= PM_POSHAN_UPPER_PRIMARY_TARGETS.minProteinGrams
          ? 1
          : 0),
    }),
    { calories: 0, protein: 0, iron: 0, compliant: 0 }
  );

  return {
    avgCalories: Math.round(totals.calories / menu.length),
    avgProtein: Number((totals.protein / menu.length).toFixed(1)),
    avgIron: Number((totals.iron / menu.length).toFixed(1)),
    compliantDays: totals.compliant,
    totalDays: menu.length,
  };
}
