import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { syncService } from "../../../lib/syncService";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { action, chatbaseAgentId, googleDriveFolderId } = await req.json();

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (action === 'start') {
      if (!chatbaseAgentId || !googleDriveFolderId) {
        return NextResponse.json({ 
          error: "Both chatbaseAgentId and googleDriveFolderId are required" 
        }, { status: 400 });
      }

      const jobId = await syncService.createSyncJob(userId, chatbaseAgentId, googleDriveFolderId);
      
      return NextResponse.json({ 
        success: true, 
        message: "Sync job started successfully",
        jobId 
      });
    } else if (action === 'stop') {
      if (!chatbaseAgentId) {
        return NextResponse.json({ 
          error: "chatbaseAgentId is required" 
        }, { status: 400 });
      }

      await syncService.stopSyncJob(userId, chatbaseAgentId);
      
      return NextResponse.json({ 
        success: true, 
        message: "Sync job stopped successfully" 
      });
    } else if (action === 'restart') {
      if (!chatbaseAgentId || !googleDriveFolderId) {
        return NextResponse.json({ 
          error: "Both chatbaseAgentId and googleDriveFolderId are required" 
        }, { status: 400 });
      }

      await syncService.restartSyncJob(userId, chatbaseAgentId, googleDriveFolderId);
      
      return NextResponse.json({ 
        success: true, 
        message: "Sync job restarted successfully" 
      });
    } else {
      return NextResponse.json({ 
        error: "Invalid action. Use 'start', 'stop', or 'restart'" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json({ 
      error: "Failed to manage sync job" 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    if (type === 'logs') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const logs = await syncService.getSyncLogs(userId, limit);
      
      return NextResponse.json({ logs });
    } else if (type === 'status') {
      // Get sync job status
      const syncJobsSnapshot = await db
        .collection('syncJobs')
        .where('userId', '==', userId)
        .where('isActive', '==', true)
        .get();

      const activeJobs = syncJobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({ activeJobs });
    } else {
      return NextResponse.json({ 
        error: "Invalid type. Use 'logs' or 'status'" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Sync API error:", error);
    return NextResponse.json({ 
      error: "Failed to get sync information" 
    }, { status: 500 });
  }
} 