# Firebase Setup Checklist

## ✅ Completed Steps

- [x] Created Firebase project: `classroom-dashboard-3a8c9`
- [x] Registered web app in Firebase Console
- [x] Updated app configuration with Firebase credentials
- [x] Installed Firebase packages

## 🔲 Required Steps (Complete These Now)

### Step 1: Enable Google Authentication

**Link:** https://console.firebase.google.com/project/classroom-dashboard-3a8c9/authentication

1. Click **"Authentication"** in the left sidebar
2. Click **"Get started"** button (if first time)
3. Click the **"Sign-in method"** tab
4. Find **"Google"** in the providers list
5. Click on **"Google"**
6. Toggle the **"Enable"** switch to ON
7. Select your email address as the "Project support email"
8. Click **"Save"**

**Why?** This allows users to sign in with their Google accounts.

---

### Step 2: Create Firestore Database

**Link:** https://console.firebase.google.com/project/classroom-dashboard-3a8c9/firestore

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"** button
3. Choose **"Start in production mode"** (we'll add rules next)
4. Select a location:
   - **For India:** `asia-south1 (Mumbai)`
   - **For US:** `us-central1`
   - **For Europe:** `europe-west1`
5. Click **"Enable"**
6. Wait for database to be created (30-60 seconds)

**Why?** This creates the database to store your student data.

---

### Step 3: Deploy Security Rules

**After Step 2 completes:**

1. In **Firestore Database**, click the **"Rules"** tab (top of page)
2. Delete all existing rules
3. Copy and paste these rules:

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
      // Allow reading if the student belongs to the authenticated teacher
      allow read: if isAuthenticated() &&
                     resource.data.teacherId == request.auth.uid;

      // Allow creating only if the teacher ID matches the authenticated user
      allow create: if isAuthenticated() &&
                       request.resource.data.teacherId == request.auth.uid;

      // Allow updating and deleting only if the student belongs to the authenticated teacher
      allow update, delete: if isAuthenticated() &&
                               resource.data.teacherId == request.auth.uid;
    }
  }
}
```

4. Click **"Publish"** button (top right)
5. Confirm by clicking **"Publish"** again

**Why?** These rules protect your data - only you can see your students, others cannot access your data.

---

## 🚀 Test Your App

Once you complete all 3 steps above:

### 1. Start the Development Server

```bash
npm start
```

### 2. Open in Browser

The app will open automatically, or go to the URL shown in the terminal (usually `http://localhost:8081`)

### 3. Sign In

1. You should see a beautiful login screen with "Sign in with Google" button
2. Click the button
3. Select your Google account
4. Grant permissions
5. You should be signed in and see the dashboard!

### 4. Test Adding a Student

1. Navigate to "Students" tab
2. Click "Add Student" button
3. Fill in student details
4. Save
5. The student should appear in your list
6. Check Firestore Console to see the data stored in the cloud!

---

## 🔍 Verify Setup

### Check Authentication

1. Go to: https://console.firebase.google.com/project/classroom-dashboard-3a8c9/authentication/users
2. After signing in, you should see your Google account listed here

### Check Firestore Data

1. Go to: https://console.firebase.google.com/project/classroom-dashboard-3a8c9/firestore/data
2. You should see:
   - `/teachers/{your-user-id}` - Your profile
   - `/students/{student-id}` - Each student you add

---

## ⚠️ Troubleshooting

### "Popup blocked" error
- Allow popups for localhost in your browser
- Or the app will automatically use redirect method

### "Missing or insufficient permissions"
- Make sure you published the Firestore security rules (Step 3)
- Sign out and sign in again

### Can't sign in
- Verify Google Authentication is enabled (Step 1)
- Check browser console for error messages
- Try in incognito/private mode

### "Failed to get document"
- Make sure Firestore database is created (Step 2)
- Check that security rules are published (Step 3)

---

## 📊 Monitor Usage

**Dashboard:** https://console.firebase.google.com/project/classroom-dashboard-3a8c9/usage

Monitor your usage to ensure you stay within free tier limits:
- Authentication: Unlimited
- Firestore Reads: 50,000/day
- Firestore Writes: 20,000/day
- Storage: 1 GB

For personal use with ~100 students, you'll use less than 1% of these limits!

---

## ✅ Setup Complete Checklist

After completing all steps, verify:

- [ ] Google Authentication is enabled
- [ ] Firestore Database is created
- [ ] Security rules are published
- [ ] App starts without errors
- [ ] Can sign in with Google account
- [ ] Can add a test student
- [ ] Student appears in Firestore Console
- [ ] Student appears in app after refresh

**All checked?** Congratulations! Your classroom dashboard is fully set up! 🎉

---

## 📚 Next Steps

- Add your actual students
- Explore the dashboard features
- Access from different devices to see real-time sync
- Try offline mode (disable internet, add student, re-enable internet)
- Check out the other documentation files for more features

**Questions?** Check `FIREBASE_SETUP.md` for detailed explanations.
