# HannaAI - Personal AI Assistant with Google Drive Integration

HannaAI is a Next.js application that provides personalized AI chat experiences using Chatbase agents with automatic Google Drive file synchronization.

## Features

### 🤖 Personal AI Agents
- Each user connects to their own Chatbase agent
- User-specific agent configuration
- Secure authentication and authorization

### 📁 Google Drive Integration
- Automatic file monitoring and synchronization
- Background processing every 15 minutes
- Support for multiple file types (text, Google Docs, PDFs*, Word docs*)
- Real-time sync status and activity logs

### 🔐 Authentication & User Management
- Firebase Authentication with Google Sign-In
- User profile management
- Secure token-based API communication

### 📊 Sync Management
- Visual sync status indicators
- Activity logs with success/error tracking
- Manual sync controls (start, stop, restart)
- Real-time sync job monitoring

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Material-UI
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Integration**: Chatbase API
- **File Processing**: Google Drive API
- **Background Jobs**: Node-cron
- **Styling**: Material-UI with Emotion

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Firebase Admin Configuration (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Chatbase Configuration
CHATBASE_API_KEY=your_chatbase_api_key

# Google OAuth Configuration (for Google Drive access)
GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
```

### 2. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Enable Firestore database
4. Generate a service account key for admin access
5. Configure security rules for Firestore

### 3. Chatbase Setup

1. Create an account at [Chatbase](https://www.chatbase.co)
2. Create your AI agent
3. Get your API key and agent ID
4. Each user will need their own agent ID

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs
4. Enable Google Drive API

### 5. Installation

```bash
npm install
npm run dev
```

## Usage

### For Users

1. **Sign Up/Sign In**: Use Google authentication to create an account
2. **Configure Agent**: Enter your personal Chatbase agent ID in Profile settings
3. **Link Google Drive**: 
   - Authorize Google Drive access
   - Enter your Google Drive folder ID
   - Enable automatic synchronization
4. **Chat**: Start chatting with your personalized AI assistant
5. **Monitor Sync**: View sync status and activity logs in your profile

### For Developers

#### Key Components

- `AuthContext`: Manages user authentication and profile data
- `UserProfile`: Component for managing user settings and sync configuration
- `Navigation`: App navigation with status indicators
- `GoogleDriveService`: Handles Google Drive file operations
- `ChatbaseService`: Manages Chatbase API interactions
- `SyncService`: Background job management for file synchronization

#### API Routes

- `/api/chatbase`: Chat with user-specific Chatbase agents
- `/api/sync`: Manage sync jobs (start, stop, restart, status, logs)

#### Database Collections

- `users`: User profiles with agent and folder configurations
- `syncJobs`: Active background sync jobs
- `syncLogs`: Sync activity history
- `userCredentials`: Encrypted Google OAuth tokens
- `folderSync`: Last sync timestamps per folder

## File Support

Currently supported file types:
- ✅ Plain text files (.txt, .md, etc.)
- ✅ Google Docs (exported as text)
- 🚧 PDF files (extraction not implemented)
- 🚧 Word documents (extraction not implemented)

## Security

- All API routes are protected with Firebase authentication
- Google OAuth tokens are stored securely in Firestore
- User data is isolated per account
- Environment variables for sensitive configuration

## Sync Process

1. **Monitor**: Background jobs check Google Drive folders every 15 minutes
2. **Detect**: New or modified files are identified
3. **Extract**: Text content is extracted from supported file types
4. **Sync**: Content is added/updated in the user's Chatbase agent
5. **Retrain**: Agent is retrained with new knowledge
6. **Log**: All activities are logged for user visibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the sync logs in your profile for detailed error information
- Ensure all environment variables are correctly configured
- Verify Chatbase agent ID and Google Drive folder ID are valid
- Check Google Drive folder permissions

---

**Note**: This application requires valid Chatbase API access and Google OAuth setup to function properly. Make sure to follow the setup instructions carefully.
