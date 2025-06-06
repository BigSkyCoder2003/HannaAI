import { google } from 'googleapis';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
}

export class GoogleDriveService {
  private auth: any;
  private drive: any;
  private db: FirebaseFirestore.Firestore;

  constructor() {
    this.db = getFirestore();
    this.initializeAuth();
  }

  private initializeAuth() {
    // Initialize Google OAuth2 client
    this.auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  async setUserCredentials(userId: string, accessToken: string, refreshToken: string) {
    // Store user's Google credentials securely
    this.auth.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Store refresh token in Firestore (encrypted in production)
    await this.db.collection('userCredentials').doc(userId).set({
      googleRefreshToken: refreshToken,
      updatedAt: new Date(),
    });
  }

  async getUserCredentials(userId: string) {
    const doc = await this.db.collection('userCredentials').doc(userId).get();
    if (!doc.exists) {
      throw new Error('User credentials not found');
    }
    
    const data = doc.data();
    if (!data) {
      throw new Error('User credentials data is empty');
    }
    
    this.auth.setCredentials({
      refresh_token: data.googleRefreshToken,
    });
    
    return data;
  }

  async listFilesInFolder(folderId: string, pageToken?: string): Promise<{
    files: GoogleDriveFile[];
    nextPageToken?: string;
  }> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, webViewLink)',
        pageSize: 100,
        pageToken: pageToken,
        orderBy: 'modifiedTime desc',
      });

      return {
        files: response.data.files || [],
        nextPageToken: response.data.nextPageToken,
      };
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  async getFileMetadata(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, mimeType, modifiedTime, size, webViewLink',
      });

      return response.data;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  async watchFolder(folderId: string, webhookUrl: string) {
    try {
      const response = await this.drive.files.watch({
        fileId: folderId,
        requestBody: {
          id: `watch-${folderId}-${Date.now()}`,
          type: 'web_hook',
          address: webhookUrl,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error setting up folder watch:', error);
      throw error;
    }
  }

  async getNewFilesInFolder(userId: string, folderId: string): Promise<GoogleDriveFile[]> {
    try {
      // Get last sync time from database
      const syncDoc = await this.db.collection('folderSync').doc(`${userId}_${folderId}`).get();
      const lastSyncTime = syncDoc.exists ? syncDoc.data()?.lastSyncTime : null;

      // Build query for files modified after last sync
      let query = `'${folderId}' in parents and trashed=false`;
      if (lastSyncTime) {
        query += ` and modifiedTime > '${lastSyncTime.toISOString()}'`;
      }

      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
        orderBy: 'modifiedTime desc',
      });

      // Update last sync time
      await this.db.collection('folderSync').doc(`${userId}_${folderId}`).set({
        lastSyncTime: new Date(),
        updatedAt: new Date(),
      });

      return response.data.files || [];
    } catch (error) {
      console.error('Error getting new files:', error);
      throw error;
    }
  }

  async extractTextFromFile(fileId: string, mimeType: string): Promise<string> {
    try {
      let text = '';
      
      if (mimeType.includes('text/')) {
        // Plain text files
        const buffer = await this.downloadFile(fileId);
        text = buffer.toString('utf-8');
      } else if (mimeType.includes('application/vnd.google-apps.document')) {
        // Google Docs
        const response = await this.drive.files.export({
          fileId: fileId,
          mimeType: 'text/plain',
        });
        text = response.data;
      } else if (mimeType.includes('application/pdf')) {
        // PDF files - would need PDF parsing library
        text = 'PDF content extraction not implemented yet';
      } else if (mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        // Word documents - would need docx parsing library
        text = 'Word document content extraction not implemented yet';
      }
      
      return text;
    } catch (error) {
      console.error('Error extracting text from file:', error);
      return 'Error extracting text from file';
    }
  }
}

export const googleDriveService = new GoogleDriveService(); 