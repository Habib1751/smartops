# SmartOps Setup Guide

## ✅ Project Successfully Cloned and Running!

Your SmartOps project is now running at: **http://localhost:3000**

---

## 🔐 What You Need to Login

To login to the SmartOps form, you need to configure **Firebase Authentication**. Here's what to do:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select an existing project
3. Enable **Authentication** in your Firebase project:
   - In Firebase Console, go to **Build** → **Authentication**
   - Click "Get Started"
   - Enable **Email/Password** authentication
   - (Optional) Enable **Google** authentication if you want Google sign-in

### Step 2: Get Firebase Configuration

1. In Firebase Console, click the **gear icon** → **Project Settings**
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`) to create a web app
4. Register your app with a nickname (e.g., "SmartOps Web")
5. Copy the Firebase configuration values

### Step 3: Update .env.local File

Open the file `e:\smartops\.env.local` and replace the placeholder values:

```env
# From Firebase SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# For Server-side Admin SDK (Optional for now)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

### Step 4: Restart the Development Server

After updating `.env.local`, restart the server:

1. Stop the current server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Open http://localhost:3000

---

## 📝 How to Login

Once Firebase is configured, you have **3 login options**:

### Option 1: Sign Up with Email
1. Click "Sign Up" tab on the login form
2. Enter your name, email, and password
3. Click "Sign Up"
4. Check your email for verification link
5. Login with your credentials

### Option 2: Google Sign-In
1. Click the "Sign in with Google" button
2. Choose your Google account
3. You'll be automatically logged in

### Option 3: Demo Account (if available)
- The app may have a demo mode - check for a "Demo" button on the login form

---

## 🚀 Running the Project

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Clean development start (if issues occur)
npm run dev:clean
```

---

## 📁 Project Structure

- `/app` - Next.js 15 app directory (pages and routes)
- `/components` - React components including LoginForm
- `/lib` - Utilities (Firebase client/admin, auth hooks)
- `/data` - Data files
- `/public` - Static assets
- `.env.local` - Your Firebase configuration (DO NOT COMMIT)

---

## ⚠️ Important Notes

1. **Never commit** `.env.local` to Git (it's already in `.gitignore`)
2. Firebase configuration is **required** for login functionality
3. The app uses **Firebase Authentication** for user management
4. Make sure to enable Authentication methods in Firebase Console

---

## 🐛 Troubleshooting

**Firebase is not configured** error:
- Make sure `.env.local` has correct values
- Restart the development server after changing `.env.local`
- Check that all `NEXT_PUBLIC_` variables are set

**Can't create account:**
- Enable Email/Password in Firebase Console → Authentication → Sign-in method

**Google sign-in not working:**
- Enable Google provider in Firebase Console → Authentication → Sign-in method
- Add `localhost` to authorized domains

---

## 📞 Need Help?

Check the following files for more details:
- [DEBUGGING_LEADS.md](./DEBUGGING_LEADS.md) - Debugging information
- [README.md](./README.md) - General project info

---

**Status:** ✅ Project cloned and dependencies installed
**Server:** ✅ Running on http://localhost:3000
**Next Step:** Configure Firebase credentials in `.env.local`
