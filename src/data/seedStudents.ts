/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 500 Synthetic Students Dataset across Grades 5A, 6A, 7A, and 8A (125 per section)
 * With authentic South Indian names, native scripts, age, height, weight, and BMI.
 */

import { calculateBMI } from '../utils/growth';
import { AttendanceStatus } from '../utils/attendance';

export interface Student {
  id: string;
  name: string;
  nativeName?: string;
  gender: 'female' | 'male';
  section: '5A' | '6A' | '7A' | '8A';
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  parentName: string;
  parentPhone: string;
  lastContactDate?: string;
  attendanceHistory: Record<string, AttendanceStatus>; // date -> status
}

const FIRST_NAMES_F = [
  { en: 'Lakshmi', kn: 'ಲಕ್ಷ್ಮೀ', ta: 'லட்சுமி' },
  { en: 'Ananya', kn: 'ಅನನ್ಯ', ta: 'அனன்யா' },
  { en: 'Meenakshi', kn: 'ಮೀನಾಕ್ಷಿ', ta: 'மீனாட்சி' },
  { en: 'Deepa', kn: 'ದೀಪಾ', ta: 'தீபா' },
  { en: 'Tejaswini', kn: 'ತೇಜಸ್ವಿನಿ', ta: 'தேஜஸ்வினி' },
  { en: 'Kavya', kn: 'ಕಾವ್ಯಾ', ta: 'காவ்யா' },
  { en: 'Pooja', kn: 'ಪೂಜಾ', ta: 'பூஜா' },
  { en: 'Bhavana', kn: 'ಭಾವನಾ', ta: 'பாவனா' },
  { en: 'Sowmya', kn: 'ಸೌಮ್ಯಾ', ta: 'சௌமியா' },
  { en: 'Aishwarya', kn: 'ಐಶ್ವರ್ಯ', ta: 'ஐஸ்வர்யா' },
  { en: 'Keerthana', kn: 'ಕೀರ್ತನಾ', ta: 'கீர்த்தனா' },
  { en: 'Divya', kn: 'ದಿವ್ಯಾ', ta: 'திவ்யா' },
  { en: 'Sneha', kn: 'ಸ್ನೇಹಾ', ta: 'சினேகா' },
  { en: 'Ramya', kn: 'ರಮ್ಯಾ', ta: 'ரம்யா' },
  { en: 'Vidya', kn: 'ವಿದ್ಯಾ', ta: 'வித்யா' },
  { en: 'Harini', kn: 'ಹರಿಣಿ', ta: 'ஹரிணி' },
  { en: 'Shruthi', kn: 'ಶ್ರುತಿ', ta: 'சுருதி' },
  { en: 'Priyanka', kn: 'ಪ್ರಿಯಾಂಕ', ta: 'பிரியங்கா' },
  { en: 'Nandini', kn: 'ನಂದಿನಿ', ta: 'நந்தினி' },
  { en: 'Gayathri', kn: 'ಗಾಯತ್ರಿ', ta: 'காயத்ரி' },
  { en: 'Sahana', kn: 'ಸಹನಾ', ta: 'சஹானா' },
  { en: 'Vaishnavi', kn: 'ವೈಷ್ಣವಿ', ta: 'வைஷ்ணவி' },
  { en: 'Sindhu', kn: 'ಸಿಂಧು', ta: 'சிந்து' },
  { en: 'Swathi', kn: 'ಸ್ವಾತಿ', ta: 'சுவாதி' },
  { en: 'Meera', kn: 'ಮೀರಾ', ta: 'மீரா' },
];

const FIRST_NAMES_M = [
  { en: 'Karthik', kn: 'ಕಾರ್ತಿಕ್', ta: 'கார்த்திக்' },
  { en: 'Arun', kn: 'ಅರುಣ್', ta: 'அருண்' },
  { en: 'Praveen', kn: 'ಪ್ರವೀಣ್', ta: 'பிரவீன்' },
  { en: 'Venkatesh', kn: 'ವೆಂಕಟೇಶ್', ta: 'வெங்கடேஷ்' },
  { en: 'Harish', kn: 'ಹರೀಶ್', ta: 'ஹரீஷ்' },
  { en: 'Santhosh', kn: 'ಸಂತೋಷ್', ta: 'சந்தோஷ்' },
  { en: 'Manjunath', kn: 'ಮಂಜುನಾಥ್', ta: 'மஞ்சுநாத்' },
  { en: 'Ganesh', kn: 'ಗಣೇಶ್', ta: 'கணேஷ்' },
  { en: 'Chetan', kn: 'ಚೇತನ್', ta: 'சேத்தன்' },
  { en: 'Prashanth', kn: 'ಪ್ರಶಾಂತ್', ta: 'பிரசாந்த்' },
  { en: 'Vignesh', kn: 'ವಿಘ್ನೇಶ್', ta: 'விக்னேஷ்' },
  { en: 'Suresh', kn: 'ಸುರೇಶ್', ta: 'சுரேஷ்' },
  { en: 'Ramesh', kn: 'ರಮೇಶ್', ta: 'ரமேஷ்' },
  { en: 'Mahesh', kn: 'ಮಹೇಶ್', ta: 'மகேஷ்' },
  { en: 'Kiran', kn: 'ಕಿರಣ್', ta: 'கிரண்' },
  { en: 'Naveen', kn: 'ನವೀನ್', ta: 'நவீன்' },
  { en: 'Raghavan', kn: 'ರಾಘವನ್', ta: 'ராகவன்' },
  { en: 'Farhan', kn: 'ಫರ್ಹಾನ್', ta: 'ஃபர்ஹான்' },
  { en: 'Aditya', kn: 'ಆದಿತ್ಯ', ta: 'ஆதித்யா' },
  { en: 'Abhishek', kn: 'ಅಭಿಷೇಕ್', ta: 'அபிஷேக்' },
  { en: 'Vijay', kn: 'ವಿಜಯ್', ta: 'விஜய்' },
  { en: 'Siddharth', kn: 'ಸಿದ್ಧಾರ್ಥ್', ta: 'சித்தார்த்' },
  { en: 'Darshan', kn: 'ದರ್ಶನ್', ta: 'தர்ஷன்' },
  { en: 'Manoj', kn: 'ಮನೋಜ್', ta: 'மனோஜ்' },
  { en: 'Bharath', kn: 'ಭರತ್', ta: 'பரத்' },
];

const LAST_NAMES = [
  'Gowda', 'Rao', 'Narayanan', 'Swaminathan', 'Murthy', 'Sundaram',
  'Kumar', 'Bhat', 'Shetty', 'Pillai', 'Nair', 'Hegde', 'Reddy',
  'Naidu', 'Iyer', 'Menon', 'Acharya', 'Kulkarni', 'Deshmukh', 'Naik'
];

// Helper deterministic pseudo-random generator
function pseudoRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSeedStudents(): Student[] {
  const students: Student[] = [];
  const sections: Array<'5A' | '6A' | '7A' | '8A'> = ['5A', '6A', '7A', '8A'];
  const baseAges: Record<string, number> = { '5A': 10, '6A': 11, '7A': 12, '8A': 13 };

  // Past 14 dates for attendance history
  const dates: string[] = [];
  for (let d = 14; d >= 1; d--) {
    const dayStr = d < 10 ? `0${d}` : `${d}`;
    dates.push(`2026-10-${dayStr}`);
  }

  let globalIndex = 1;

  for (const section of sections) {
    const rand = pseudoRandom(1000 + sections.indexOf(section) * 7919);

    for (let i = 1; i <= 125; i++) {
      const padNum = i < 10 ? `00${i}` : i < 100 ? `0${i}` : `${i}`;
      const id = `YP-${section}-${padNum}`;
      const isFemale = rand() > 0.48;
      const firstObj = isFemale
        ? FIRST_NAMES_F[Math.floor(rand() * FIRST_NAMES_F.length)]
        : FIRST_NAMES_M[Math.floor(rand() * FIRST_NAMES_M.length)];
      const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
      const fullName = `${firstObj.en} ${lastName}`;
      const nativeName = firstObj.kn ? `${firstObj.kn}` : undefined;

      // Realistic physical stats per grade
      const baseAge = baseAges[section];
      const age = baseAge + (rand() > 0.6 ? 1 : 0);
      const heightCm = Math.round(122 + (age - 9) * 5.8 + (rand() * 12 - 6));
      const weightKg = Math.round(23 + (age - 9) * 3.7 + (rand() * 10 - 5));
      const bmi = calculateBMI(heightCm, weightKg);

      // Attendance history
      const attendanceHistory: Record<string, AttendanceStatus> = {};
      
      // Specifically seed 3 consecutive absences for students index 8, 23, and 61 to trigger alert panel
      const isConsecutiveAlertCase = i === 8 || i === 23 || i === 61;

      dates.forEach((date, idx) => {
        if (isConsecutiveAlertCase && idx >= dates.length - 3) {
          // Last 3 days absent
          attendanceHistory[date] = 'absent';
        } else {
          const r = rand();
          if (r < 0.88) {
            attendanceHistory[date] = 'present';
          } else if (r < 0.94) {
            attendanceHistory[date] = 'absent';
          } else if (r < 0.98) {
            attendanceHistory[date] = 'late';
          } else {
            attendanceHistory[date] = 'excused';
          }
        }
      });

      const parentFirst = isFemale ? 'Ramesh' : 'Lakshmi';
      const parentName = `${parentFirst} ${lastName}`;
      const phoneDigits = Math.floor(6000000000 + rand() * 3999999999);
      const parentPhone = `+91 ${phoneDigits.toString().slice(0, 5)} ${phoneDigits.toString().slice(5)}`;

      students.push({
        id,
        name: fullName,
        nativeName,
        gender: isFemale ? 'female' : 'male',
        section,
        age,
        heightCm,
        weightKg,
        bmi,
        parentName,
        parentPhone,
        lastContactDate: isConsecutiveAlertCase ? '2026-10-18' : '2026-10-24',
        attendanceHistory,
      });

      globalIndex++;
    }
  }

  return students;
}

// Singleton cached seed dataset
export const SEED_STUDENTS = generateSeedStudents();
