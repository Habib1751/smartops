import admin from 'firebase-admin';

// Server-side Firebase Admin initializer. Supports either:
// - FIREBASE_SERVICE_ACCOUNT_JSON (full JSON as single env var, with \n escaped), or
// - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (private key with \n escaped).

function parseServiceAccountFromEnv(): admin.ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return parsed as admin.ServiceAccount;
    } catch (e) {
      try {
        // try replacing escaped newlines and parse again
        const reparsed = JSON.parse(raw.replace(/\\n/g, '\n'));
        return reparsed as admin.ServiceAccount;
      } catch (err) {
        // fallthrough
      }
    }
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    } as admin.ServiceAccount;
  }

  return null;
}

export function initializeFirebaseAdminIfNeeded() {
  if (admin.apps.length) return;
  const svc = parseServiceAccountFromEnv();
  if (!svc) return;

  admin.initializeApp({
    credential: admin.credential.cert(svc as any),
  });
}

// Do not initialize at import time; callers should call initializeFirebaseAdminIfNeeded()
// when they are running on the server and expect admin to be available.

export function getAdminAuth() {
  if (!admin.apps.length) {
    initializeFirebaseAdminIfNeeded();
  }
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY.');
  }
  return admin.auth();
}

export default admin;
