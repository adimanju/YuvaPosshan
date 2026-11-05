/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firestore Real-Time Data Persistence Service
 * Encapsulates CRUD operations and subscriptions with hardened error handling.
 */

import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { MealFeedbackEntry } from '../utils/feedback';
import { MealPhoto } from '../utils/gallery';
import { AttendanceStatus } from '../utils/attendance';

// 1. Attendance Records
export async function saveAttendanceRecord(
  section: string,
  date: string,
  attendanceMap: Record<string, AttendanceStatus>,
  summary: { present: number; absent: number; late: number; excused: number },
  markedByUid: string
) {
  if (!auth.currentUser) {
    return;
  }
  const docId = `${section}_${date}`;
  const docRef = doc(db, 'attendance_records', docId);
  try {
    await setDoc(docRef, {
      section,
      date,
      attendanceMap,
      presentCount: summary.present,
      absentCount: summary.absent,
      lateCount: summary.late,
      excusedCount: summary.excused,
      markedByUid,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `attendance_records/${docId}`);
  }
}

export function subscribeToAttendanceRecord(
  section: string,
  date: string,
  onData: (data: Record<string, AttendanceStatus> | null) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const docId = `${section}_${date}`;
  const docRef = doc(db, 'attendance_records', docId);

  return onSnapshot(docRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      onData(data.attendanceMap || null);
    } else {
      onData(null);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, `attendance_records/${docId}`);
  });
}

// 2. Meal Quality Feedback Records
export async function saveMealFeedback(
  entry: MealFeedbackEntry,
  submittedByUid: string
) {
  if (!auth.currentUser) {
    return;
  }
  const colRef = collection(db, 'meal_feedback');
  try {
    await addDoc(colRef, {
      ...entry,
      submittedByUid,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, 'meal_feedback');
  }
}

export function subscribeToMealFeedback(
  onData: (entries: MealFeedbackEntry[]) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const q = query(collection(db, 'meal_feedback'), orderBy('createdAt', 'desc'), limit(50));

  return onSnapshot(q, (snapshot) => {
    const list: MealFeedbackEntry[] = [];
    snapshot.forEach((doc) => {
      list.push({
        id: doc.id,
        ...(doc.data() as Omit<MealFeedbackEntry, 'id'>),
      });
    });
    if (list.length > 0) {
      onData(list);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'meal_feedback');
  });
}

// 3. Meal Photos Register
export async function saveMealPhoto(
  photo: MealPhoto,
  uploadedByUid: string
) {
  if (!auth.currentUser) {
    return;
  }
  const docRef = doc(db, 'meal_photos', photo.id);
  try {
    await setDoc(docRef, {
      ...photo,
      uploadedByUid,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `meal_photos/${photo.id}`);
  }
}

export function subscribeToMealPhotos(
  onData: (photos: MealPhoto[]) => void
) {
  if (!auth.currentUser) {
    return () => {};
  }
  const q = query(collection(db, 'meal_photos'), orderBy('createdAt', 'desc'), limit(30));

  return onSnapshot(q, (snapshot) => {
    const photos: MealPhoto[] = [];
    snapshot.forEach((doc) => {
      photos.push({
        id: doc.id,
        ...(doc.data() as Omit<MealPhoto, 'id'>),
      });
    });
    if (photos.length > 0) {
      onData(photos);
    }
  }, (err) => {
    handleFirestoreError(err, OperationType.GET, 'meal_photos');
  });
}
