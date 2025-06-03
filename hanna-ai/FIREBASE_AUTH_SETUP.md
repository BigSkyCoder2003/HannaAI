# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication in your Next.js application.

## 🚀 Quick Start

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to **Authentication** → **Sign-in method**
   - Enable **Email/Password** authentication
   - Enable **Google** authentication (optional)
4. Get your Firebase configuration:
   - Go to **Project Settings** → **General**
   - Scroll down to **Your apps** and click the web icon `</>`
   - Copy the configuration object

### 2. Environment Variables

Create a `.env.local` file in your project root and add your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Start the Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── firebase.ts                    # Firebase configuration
├── contexts/AuthContext.tsx       # Authentication context and hooks
├── components/
│   ├── ProtectedRoute.tsx         # Route protection wrapper
│   └── UserProfile.tsx            # User profile component
└── app/
    ├── AuthForm.tsx               # Login/Register form
    ├── layout.tsx                 # Root layout with AuthProvider
    └── page.tsx                   # Main page with auth demo
```

## 🔧 Components Overview

### AuthContext
Provides authentication state and methods throughout the app:
- `user`: Current user object or null
- `loading`: Authentication loading state
- `signUp(email, password, displayName?)`: Create new account
- `signIn(email, password)`: Sign in with email/password
- `signInWithGoogle()`: Sign in with Google
- `logout()`: Sign out user
- `resetPassword(email)`: Send password reset email

### AuthForm
Complete authentication form with:
- Sign in / Sign up toggle
- Email/password authentication
- Google authentication
- Password reset functionality
- Form validation and error handling

### ProtectedRoute
Wrapper component that:
- Shows loading spinner while checking auth state
- Redirects to login form if user not authenticated
- Renders protected content if user is authenticated

### UserProfile
Displays user information and logout button

## 🎨 Styling

The components use Tailwind CSS classes. Make sure you have Tailwind configured in your project.

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Firebase Rules**: Configure Firestore security rules for production
3. **Authentication**: Always validate user permissions on the server side
4. **HTTPS**: Use HTTPS in production for secure authentication

## 📚 Usage Examples

### Basic Protected Route
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  );
}
```

### Using Auth Context
```tsx
import { useAuth } from '../contexts/AuthContext';

export default function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.displayName || user?.email}!</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Custom Auth Form
```tsx
import AuthForm from '../app/AuthForm';

export default function LoginPage() {
  return (
    <div>
      <h1>Please sign in</h1>
      <AuthForm mode="signin" />
    </div>
  );
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Firebase config not found"**
   - Check that all environment variables are set in `.env.local`
   - Restart the development server after adding env vars

2. **"Auth domain not authorized"**
   - Add your domain to Firebase Auth settings
   - For localhost, add `localhost` to authorized domains

3. **Google Sign-in not working**
   - Enable Google authentication in Firebase Console
   - Configure OAuth consent screen in Google Cloud Console

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs/auth)
- [Next.js Documentation](https://nextjs.org/docs)
- Check the browser console for detailed error messages

## 🎯 Next Steps

1. **Add Firebase Rules**: Set up Firestore security rules
2. **User Profiles**: Create user profile collection in Firestore
3. **Email Verification**: Implement email verification flow
4. **Social Auth**: Add more social authentication providers
5. **Admin Panel**: Create admin interface for user management