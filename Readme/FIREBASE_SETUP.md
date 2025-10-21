# Firebase Setup Guide for Classroom Dashboard

This guide will walk you through setting up Firebase Authentication and Firestore for your Classroom Dashboard app.

## Prerequisites

- A Google account
- Node.js installed on your computer
- The Classroom Dashboard app cloned/downloaded

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "Classroom Dashboard")
4. (Optional) Enable Google Analytics if you want usage statistics
5. Click **"Create project"** and wait for it to be created
6. Click **"Continue"** when the project is ready

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (</>) to add a web app
2. Register your app with a nickname (e.g., "Classroom Dashboard Web")
3. **Check** the box for "Also set up Firebase Hosting" (optional, but recommended)
4. Click **"Register app"**
5. You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **Copy this configuration** - you'll need it in Step 5

## Step 3: Enable Google Authentication

1. In the Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"** in the list of providers
5. Toggle the **"Enable"** switch to ON
6. Select a **Project support email** (your email address)
7. Click **"Save"**

## Step 4: Create Firestore Database

1. In the Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add security rules next)
4. Choose a Cloud Firestore location closest to you or your users
5. Click **"Enable"**

## Step 5: Configure Firestore Security Rules

1. In the Firestore Database page, click on the **"Rules"** tab
2. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user owns the document
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Teachers collection - users can only read/write their own profile
    match /teachers/{teacherId} {
      allow read, write: if isAuthenticated() && isOwner(teacherId);
    }

    // Students collection - users can only access students they created
    match /students/{studentId} {
      allow read: if isAuthenticated() &&
                     (resource.data.teacherId == request.auth.uid);

      allow create: if isAuthenticated() &&
                       request.resource.data.teacherId == request.auth.uid;

      allow update, delete: if isAuthenticated() &&
                               resource.data.teacherId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"** to save the rules

### What these rules do:

- **Teachers**: Each teacher can only read and write their own profile data
- **Students**: Teachers can only access student records they created
- **Authentication**: All operations require a signed-in user
- **Privacy**: No teacher can see another teacher's data

## Step 6: Update Your App Configuration

1. Open the file: `src/config/firebase.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // Replace with your apiKey
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",  // Replace with your authDomain
  projectId: "YOUR_PROJECT_ID",              // Replace with your projectId
  storageBucket: "YOUR_PROJECT_ID.appspot.com",   // Replace with your storageBucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",  // Replace with your messagingSenderId
  appId: "YOUR_APP_ID"                       // Replace with your appId
};
```

3. Save the file

## Step 7: Test Your Setup

1. Start your development server:
```bash
npm start
```

2. Open the app in your web browser

3. Click **"Sign in with Google"**

4. Select your Google account

5. You should be signed in and see the dashboard!

## Optional: Enable Offline Persistence

Offline persistence is already enabled in the app configuration. This means:

- Your app works without an internet connection
- Changes are saved locally and synced when you're back online
- Data is cached for faster load times

## Firestore Data Structure

Your data will be organized as follows:

```
/teachers/{userId}
  - id: string
  - name: string
  - email: string
  - photoUrl: string (optional)
  - subject: string
  - schoolName: string
  - updatedAt: timestamp

/students/{studentId}
  - id: string
  - teacherId: string (references the teacher who created it)
  - studentFullName: string
  - rollNo: string
  - classStandard: string
  - division: string
  - ... (all other student fields)
  - createdAt: string
  - updatedAt: string
```

## Free Tier Limits

Firebase's free "Spark Plan" includes:

### Authentication
- **Unlimited** users

### Firestore
- **1 GB** storage
- **50,000** document reads per day
- **20,000** document writes per day
- **20,000** document deletes per day

### For Personal Use:
These limits are more than enough for personal classroom management! Even with 100 students and daily updates, you'll stay well within the free tier.

## Troubleshooting

### Error: "Firebase: Error (auth/popup-blocked)"
- Your browser is blocking popups
- The app will automatically try redirect method instead
- Allow popups for this site in your browser settings

### Error: "Missing or insufficient permissions"
- Check that your Firestore security rules are published correctly
- Make sure you're signed in with a Google account

### Data not syncing
- Check your internet connection
- Check the browser console for any error messages
- Verify your Firebase configuration is correct

### Can't sign in
- Make sure Google authentication is enabled in Firebase Console
- Check that your apiKey and authDomain are correct
- Try clearing your browser cache and cookies

## Next Steps

### Backing Up Your Data

You can export your data as JSON:

```typescript
import { exportStudentsAsJSON } from './services/firestore';

// Export all students
const teacherId = 'your-user-id';
const jsonData = await exportStudentsAsJSON(teacherId);

// Save to file or download
console.log(jsonData);
```

### Monitoring Usage

1. Go to Firebase Console → Usage and Billing
2. Monitor your daily reads/writes
3. Set up budget alerts if needed

## Security Best Practices

1. **Never share your API keys publicly** in GitHub or other public repositories
2. **Keep your Firebase config secure** - even though the apiKey is public-facing, it's protected by security rules
3. **Review security rules regularly** to ensure they match your needs
4. **Enable App Check** (optional) for additional security against abuse

## Support

If you encounter any issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Firebase Console](https://console.firebase.google.com/) for error messages
3. Check your browser's developer console for error logs

---

**Congratulations!** Your Classroom Dashboard is now connected to Firebase and ready to securely store your data in the cloud.
