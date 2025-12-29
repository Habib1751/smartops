# 🔑 GET YOUR FIREBASE WEB API KEY - URGENT

## ❌ Current Error
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## ✅ Solution - Get Web App Configuration

### Step-by-Step Instructions:

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/project/smartops-ai-dev/settings/general
   - (Or go to Firebase Console → Select "smartops-ai-dev" project → Click ⚙️ Settings → Project settings)

2. **Find Your Web App**
   - Scroll down to section **"Your apps"**
   - Look for a **Web app** (icon: `</>`)
   
   **If you DON'T see a web app:**
   - Click **"Add app"** button
   - Select **Web** platform (`</>` icon)
   - Give it a nickname: "SmartOps Web"
   - Click **"Register app"**

3. **Copy the Configuration**
   You'll see something like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "smartops-ai-dev.firebaseapp.com",
     projectId: "smartops-ai-dev",
     storageBucket: "smartops-ai-dev.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

4. **Update .env.local File**
   - Open: `e:\smartops\.env.local`
   - Replace these values with YOUR values from Firebase Console:
   
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

5. **Restart Development Server**
   - Stop the server (Ctrl+C in terminal)
   - Run: `npm run dev`
   - Try logging in again at http://localhost:3000

---

## ℹ️ What I Already Configured

✅ **Server-side (Admin SDK)** - Already set up from the JSON you provided:
- `FIREBASE_PROJECT_ID=smartops-ai-dev`
- `FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@smartops-ai-dev.iam.gserviceaccount.com`
- `FIREBASE_PRIVATE_KEY` (configured)

✅ **Client-side (Partial)** - Set from your project:
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartops-ai-dev`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartops-ai-dev.firebaseapp.com`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartops-ai-dev.appspot.com`

❌ **Missing (Need from Firebase Console)**:
- `NEXT_PUBLIC_FIREBASE_API_KEY` ← **THIS IS CAUSING THE ERROR**
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

---

## 🎯 Quick Link

**Direct link to your project settings:**
👉 https://console.firebase.google.com/project/smartops-ai-dev/settings/general

Scroll down to **"Your apps"** section and look for the Web app configuration!
