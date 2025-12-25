
import * as firebaseApp from 'firebase/app';
import { getFirestore, collection, doc, getDocs, setDoc, query, orderBy, Firestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { IGameScene } from '../types';

/**
 * Firebase Project Configuration
 */
const firebaseConfig = {
  apiKey: "AIzaSyBIM23oOq-RJ_GLyy0w5wCm1fevgDmOZuo",
  authDomain: "mowen-41212.firebaseapp.com",
  projectId: "mowen-41212",
  storageBucket: "mowen-41212.firebasestorage.app",
  messagingSenderId: "461723676742",
  appId: "1:461723676742:web:89f94c3128f688f66e1a47",
  measurementId: "G-DJY7GEW483"
};

// Initialize Firebase
let db: Firestore | null = null;

try {
  // Use namespace import access for initializeApp
  const app = firebaseApp.initializeApp(firebaseConfig);
  
  // Initialize Auth and sign in anonymously
  // This is crucial to bypass "Missing or insufficient permissions" if rules require auth
  const auth = getAuth(app);
  signInAnonymously(auth).catch((error) => {
    console.warn("Firebase Anonymous Auth Failed (Network or Config):", error.message);
  });

  // Connect specifically to the 'mowen' database as requested by the user.
  db = getFirestore(app, 'mowen'); 
  console.log("Firebase initialized successfully with project:", firebaseConfig.projectId, "Database: mowen");
} catch (e: any) {
  console.error("Firebase initialization error:", e.message);
}

const COLLECTION_NAME = 'peach_garden_v1';

/**
 * Load all scenes from Cloud Firestore
 */
export const loadScenesFromCloud = async (): Promise<IGameScene[] | null> => {
  if (!db) return null;

  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Cloud connection timed out (5s)")), 5000)
    );

    const q = query(collection(db, COLLECTION_NAME), orderBy('id'));
    
    const querySnapshot: any = await Promise.race([
      getDocs(q),
      timeoutPromise
    ]);
    
    if (querySnapshot.empty) {
      console.log("Cloud Firestore is empty.");
      return null;
    }

    const scenes: IGameScene[] = [];
    querySnapshot.forEach((doc: any) => {
      scenes.push(doc.data() as IGameScene);
    });
    
    console.log(`Loaded ${scenes.length} scenes from Cloud Firestore`);
    return scenes;

  } catch (error: any) {
    const msg = error.message || "Unknown error";
    console.warn("Cloud load failed (falling back to local):", msg);
    return null;
  }
};

/**
 * Helper: Calculate object size in bytes
 */
const getSizeInBytes = (obj: any) => {
  const str = JSON.stringify(obj);
  return new TextEncoder().encode(str).length;
};

/**
 * Save all scenes to Cloud Firestore
 */
export const saveScenesToCloud = async (scenes: IGameScene[]): Promise<void> => {
  if (!db) throw new Error("Firebase not configured");

  console.log("Starting sequential cloud upload to 'mowen' database...");

  // No global timeout for upload, let it take its time.
  // We upload sequentially to ensure stability.
  
  let successCount = 0;
  let failCount = 0;

  for (const scene of scenes) {
    try {
      // Size Check
      const size = getSizeInBytes(scene);
      const sizeMB = (size / (1024 * 1024)).toFixed(2);
      
      // Firestore limit is approx 1,048,576 bytes
      if (size > 1000000) { 
         console.warn(`⚠️ Scene ${scene.id} is ${sizeMB} MB. It exceeds the 1MB Firestore limit and may fail.`);
      }

      const docRef = doc(db, COLLECTION_NAME, `scene_${scene.id}`);
      await setDoc(docRef, scene);
      console.log(`✅ Uploaded scene ${scene.id} to Cloud (${sizeMB} MB)`);
      successCount++;
    } catch (e: any) {
      console.error(`❌ Failed to upload scene ${scene.id}:`, e.message);
      failCount++;
    }
  }

  if (failCount > 0) {
    console.warn(`Upload complete. Success: ${successCount}, Failed: ${failCount}. Partial data saved.`);
  } else {
    console.log("All scenes uploaded to Cloud Firestore successfully");
  }
};

export const isCloudConfigured = (): boolean => {
  return db !== null;
};
