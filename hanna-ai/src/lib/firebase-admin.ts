import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Validate required environment variables
const requiredEnvVars = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

let firebaseApp: App | null = null;
let adminAuth: Auth | null = null;
let adminDb: Firestore | null = null;

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (missingEnvVars.length > 0) {
    console.warn(`Firebase Admin not initialized. Missing environment variables: ${missingEnvVars.join(', ')}`);
    return false;
  }

  if (!getApps().length) {
    try {
      firebaseApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID!,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
          privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error("Failed to initialize Firebase Admin:", error);
      return false;
    }
  } else {
    firebaseApp = getApps()[0];
  }

  try {
    adminAuth = getAuth(firebaseApp);
    adminDb = getFirestore(firebaseApp);
    return true;
  } catch (error) {
    console.error("Failed to get Firebase services:", error);
    return false;
  }
}

// Initialize on import (but don't fail if env vars are missing)
const isInitialized = initializeFirebaseAdmin();

// Export functions that check initialization
export function getAdminAuth(): Auth | null {
  if (!isInitialized || !adminAuth) {
    console.warn('Firebase Admin Auth not available');
    return null;
  }
  return adminAuth;
}

export function getAdminDb(): Firestore | null {
  if (!isInitialized || !adminDb) {
    console.warn('Firebase Admin Firestore not available');
    return null;
  }
  return adminDb;
}

export function isFirebaseInitialized(): boolean {
  return isInitialized;
}

export { firebaseApp }; 