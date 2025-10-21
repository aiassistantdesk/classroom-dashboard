# Quick Start Guide - Firebase Setup

## 5-Minute Setup

### 1. Create Firebase Project (2 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Name it "Classroom Dashboard"
4. Click through the setup wizard

### 2. Enable Services (1 minute)

**Authentication:**
1. Left sidebar → Authentication
2. Get started → Sign-in method tab
3. Enable "Google"
4. Save

**Firestore:**
1. Left sidebar → Firestore Database
2. Create database → Production mode
3. Choose location nearest to you
4. Enable

### 3. Get Configuration (1 minute)

1. Project Overview (gear icon) → Project settings
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Register app with nickname "Classroom Dashboard"
5. Copy the `firebaseConfig` object

### 4. Update App (1 minute)

Open `src/config/firebase.ts` and replace:

```typescript
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_AUTH_DOMAIN",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};
```

### 5. Set Security Rules (30 seconds)

1. Firestore Database → Rules tab
2. Copy content from `firestore.rules` file
3. Publish

### Done! 🎉

Start the app:
```bash
npm start
```

Click "Sign in with Google" and you're ready to use your classroom dashboard!

---

**Need more details?** See `FIREBASE_SETUP.md` for the complete guide.

**Questions?** Check `README_FIREBASE.md` for detailed explanations.
