import * as cron from 'node-cron';
import { getAdminDb, isFirebaseInitialized } from './firebase-admin';
import { googleDriveService } from './googleDrive';
import { chatbaseService } from './chatbaseService';

interface SyncJob {
  userId: string;
  chatbaseAgentId: string;
  googleDriveFolderId: string;
  isActive: boolean;
  lastSyncTime: Date;
  nextSyncTime: Date;
}

export class SyncService {
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  
  constructor() {
    // Only initialize sync jobs if Firebase is available
    if (isFirebaseInitialized()) {
      this.initializeSyncJobs();
    } else {
      console.warn('SyncService: Firebase not initialized, skipping sync job initialization');
    }
  }

  private getDb() {
    const db = getAdminDb();
    if (!db) {
      throw new Error('Firebase Firestore not available');
    }
    return db;
  }

  async initializeSyncJobs() {
    try {
      const db = this.getDb();
      
      // Load existing sync jobs from database
      const syncJobsSnapshot = await db.collection('syncJobs').where('isActive', '==', true).get();
      
      syncJobsSnapshot.forEach(doc => {
        const syncJob = doc.data() as SyncJob;
        this.createCronJob(doc.id, syncJob);
      });

      console.log(`Initialized ${syncJobsSnapshot.size} sync jobs`);
    } catch (error) {
      console.error('Error initializing sync jobs:', error);
    }
  }

  async createSyncJob(
    userId: string, 
    chatbaseAgentId: string, 
    googleDriveFolderId: string
  ): Promise<string> {
    try {
      const db = this.getDb();
      const jobId = `${userId}_${chatbaseAgentId}`;
      const now = new Date();
      
      const syncJob: SyncJob = {
        userId,
        chatbaseAgentId,
        googleDriveFolderId,
        isActive: true,
        lastSyncTime: now,
        nextSyncTime: new Date(now.getTime() + 15 * 60 * 1000), // Next sync in 15 minutes
      };

      // Save to database
      await db.collection('syncJobs').doc(jobId).set(syncJob);

      // Create cron job (runs every 15 minutes)
      this.createCronJob(jobId, syncJob);

      // Run initial sync
      await this.performSync(syncJob);

      console.log(`Created sync job for user ${userId}`);
      return jobId;
    } catch (error) {
      console.error('Error creating sync job:', error);
      throw error;
    }
  }

  private createCronJob(jobId: string, syncJob: SyncJob) {
    // Stop existing job if it exists
    if (this.cronJobs.has(jobId)) {
      this.cronJobs.get(jobId)?.stop();
    }

    // Create new cron job that runs every 15 minutes
    const task = cron.schedule('*/15 * * * *', async () => {
      console.log(`Running sync job ${jobId}`);
      await this.performSync(syncJob);
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    this.cronJobs.set(jobId, task);
    console.log(`Cron job created for ${jobId}`);
  }

  async performSync(syncJob: SyncJob) {
    try {
      console.log(`Performing sync for user ${syncJob.userId}`);
      
      // Set up Google Drive credentials for this user
      await googleDriveService.getUserCredentials(syncJob.userId);

      // Get new files from Google Drive folder
      const newFiles = await googleDriveService.getNewFilesInFolder(
        syncJob.userId, 
        syncJob.googleDriveFolderId
      );

      if (newFiles.length === 0) {
        console.log(`No new files found for user ${syncJob.userId}`);
        return;
      }

      console.log(`Found ${newFiles.length} new files for user ${syncJob.userId}`);

      // Process each new file
      for (const file of newFiles) {
        try {
          console.log(`Processing file: ${file.name}`);
          
          // Extract text content from the file
          const textContent = await googleDriveService.extractTextFromFile(file.id, file.mimeType);
          
          if (textContent && textContent.trim()) {
            // Sync with Chatbase
            const result = await chatbaseService.syncGoogleDriveFile(
              syncJob.chatbaseAgentId,
              file.name,
              textContent,
              file.id
            );

            if (result.success) {
              console.log(`Successfully synced file ${file.name} with Chatbase`);
              
              // Log the sync event
              await this.logSyncEvent(syncJob.userId, file.id, file.name, 'success');
            } else {
              console.error(`Failed to sync file ${file.name} with Chatbase:`, result.message);
              await this.logSyncEvent(syncJob.userId, file.id, file.name, 'error', result.message);
            }
          } else {
            console.log(`No text content extracted from file ${file.name}`);
            await this.logSyncEvent(syncJob.userId, file.id, file.name, 'warning', 'No text content found');
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          const errorMessage = fileError instanceof Error ? fileError.message : String(fileError);
          await this.logSyncEvent(syncJob.userId, file.id, file.name, 'error', errorMessage);
        }
      }

      // Retrain the chatbot if new files were synced
      if (newFiles.length > 0) {
        console.log(`Retraining chatbot ${syncJob.chatbaseAgentId}`);
        const retrainResult = await chatbaseService.retrainChatbot(syncJob.chatbaseAgentId);
        
        if (retrainResult.success) {
          console.log(`Successfully retrained chatbot ${syncJob.chatbaseAgentId}`);
        } else {
          console.error(`Failed to retrain chatbot:`, retrainResult.message);
        }
      }

      // Update last sync time
      const db = this.getDb();
      await db.collection('syncJobs').doc(`${syncJob.userId}_${syncJob.chatbaseAgentId}`).update({
        lastSyncTime: new Date(),
        nextSyncTime: new Date(Date.now() + 15 * 60 * 1000),
      });

    } catch (error) {
      console.error(`Error performing sync for user ${syncJob.userId}:`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.logSyncEvent(syncJob.userId, '', '', 'error', errorMessage);
    }
  }

  async logSyncEvent(
    userId: string, 
    fileId: string, 
    fileName: string, 
    status: 'success' | 'error' | 'warning',
    message?: string
  ) {
    try {
      const db = this.getDb();
      await db.collection('syncLogs').add({
        userId,
        fileId,
        fileName,
        status,
        message: message || '',
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error logging sync event:', error);
    }
  }

  async stopSyncJob(userId: string, chatbaseAgentId: string) {
    const jobId = `${userId}_${chatbaseAgentId}`;
    
    try {
      // Stop cron job
      if (this.cronJobs.has(jobId)) {
        this.cronJobs.get(jobId)?.stop();
        this.cronJobs.delete(jobId);
      }

      // Update database
      const db = this.getDb();
      await db.collection('syncJobs').doc(jobId).update({
        isActive: false,
        stoppedAt: new Date(),
      });

      console.log(`Stopped sync job ${jobId}`);
    } catch (error) {
      console.error(`Error stopping sync job ${jobId}:`, error);
      throw error;
    }
  }

  async getSyncLogs(userId: string, limit: number = 50) {
    try {
      const db = this.getDb();
      const logsSnapshot = await db
        .collection('syncLogs')
        .where('userId', '==', userId)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();

      return logsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting sync logs:', error);
      throw error;
    }
  }

  async restartSyncJob(userId: string, chatbaseAgentId: string, googleDriveFolderId: string) {
    // Stop existing job
    await this.stopSyncJob(userId, chatbaseAgentId);
    
    // Create new job
    await this.createSyncJob(userId, chatbaseAgentId, googleDriveFolderId);
  }
}

export const syncService = new SyncService(); 