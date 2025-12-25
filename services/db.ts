
import { IGameScene } from '../types';

const DB_NAME = 'PeachGardenDB';
const DB_VERSION = 1;
const STORE_SCENES = 'scenes_store';
const STORE_PROGRESS = 'progress_store';
const KEY_SCENES = 'current_story_v1';
const KEY_PROGRESS = 'current_progress_v1';

/**
 * Open the database connection
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("IndexedDB error:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SCENES)) {
        db.createObjectStore(STORE_SCENES);
      }
      if (!db.objectStoreNames.contains(STORE_PROGRESS)) {
        db.createObjectStore(STORE_PROGRESS);
      }
    };
  });
};

/**
 * Save all scenes (including heavy base64 images) to IndexedDB
 */
export const saveScenesToDB = async (scenes: IGameScene[]): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SCENES], 'readwrite');
    const store = transaction.objectStore(STORE_SCENES);
    const request = store.put(scenes, KEY_SCENES);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Load scenes from IndexedDB
 */
export const loadScenesFromDB = async (): Promise<IGameScene[] | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SCENES], 'readonly');
    const store = transaction.objectStore(STORE_SCENES);
    const request = store.get(KEY_SCENES);

    request.onsuccess = () => {
      resolve(request.result as IGameScene[] || null);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Save current reading progress (index)
 */
export const saveProgressToDB = async (index: number): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PROGRESS], 'readwrite');
    const store = transaction.objectStore(STORE_PROGRESS);
    const request = store.put(index, KEY_PROGRESS);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Load reading progress
 */
export const loadProgressFromDB = async (): Promise<number> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PROGRESS], 'readonly');
    const store = transaction.objectStore(STORE_PROGRESS);
    const request = store.get(KEY_PROGRESS);

    request.onsuccess = () => {
      // Default to 0 if not found
      resolve(typeof request.result === 'number' ? request.result : 0);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Clear all data (Reset game)
 */
export const clearDB = async (): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_SCENES, STORE_PROGRESS], 'readwrite');
    transaction.objectStore(STORE_SCENES).clear();
    transaction.objectStore(STORE_PROGRESS).clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};
