# Firebase Setup Instructions

To use PromptVault with Firebase authentication and Firestore database, follow these steps:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "promptvault-yourname")
4. Follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Save the changes

## 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location for your database
5. Click "Done"

## 4. Enable Storage (for image uploads)

1. Go to "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Select a location
5. Click "Done"

## 5. Get Firebase Configuration

1. Go to "Project settings" (gear icon in the left sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (</>)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## 6. Update Configuration

Replace the demo configuration in `src/lib/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## 7. Set up Firestore Security Rules

In the Firestore Database section, go to "Rules" and update them:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        resource.data.role == 'admin' || 
        request.auth.token.role == 'admin';
    }
    
    // Prompts can be read by authenticated users
    // Users can only write their own prompts
    match /prompts/{promptId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.role == 'admin');
    }
  }
}
```

## 8. Set up Storage Security Rules

In the Storage section, go to "Rules" and update them:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == resource.metadata.uploadedBy;
    }
  }
}
```

## Demo Mode

The application includes a demo mode that works without Firebase for testing purposes. The demo configuration is already set up in the code.

## Troubleshooting

- Make sure your Firebase project has billing enabled if you plan to use it in production
- Check the browser console for any Firebase-related errors
- Ensure your domain is added to the authorized domains in Firebase Authentication settings

