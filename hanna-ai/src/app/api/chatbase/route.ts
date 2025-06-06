import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb, isFirebaseInitialized } from "../../../lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    // Check if Firebase is properly initialized
    if (!isFirebaseInitialized()) {
      return NextResponse.json({ 
        error: "Server configuration error. Firebase is not properly initialized." 
      }, { status: 500 });
    }

    const auth = getAdminAuth();
    const db = getAdminDb();

    if (!auth || !db) {
      return NextResponse.json({ 
        error: "Server configuration error. Firebase services are not available." 
      }, { status: 500 });
    }

    const { message } = await req.json();
    const apiKey = process.env.CHATBASE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Chatbase API key not set." }, { status: 500 });
    }

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const userProfile = userDoc.data();
    const chatbotId = userProfile?.chatbaseAgentId;

    if (!chatbotId) {
      return NextResponse.json({ 
        error: "No Chatbase agent configured for this user. Please contact support to set up your agent." 
      }, { status: 400 });
    }

    const chatbaseRes = await fetch("https://www.chatbase.co/api/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [{ content: message, role: "user" }],
        chatbotId: chatbotId,
        stream: false,
        temperature: 0.5,
        model: "gpt-4o"
      }),
    });
    
    if (!chatbaseRes.ok) {
      const errorData = await chatbaseRes.json();
      return NextResponse.json({ error: errorData.message || "Chatbase API error" }, { status: chatbaseRes.status });
    }
    
    const data = await chatbaseRes.json();
    return NextResponse.json({ message: data.text || data.message || "No response from AI" });
  } catch (err) {
    console.error("Chatbase API error:", err);
    return NextResponse.json({ error: "Failed to contact Chatbase." }, { status: 500 });
  }
} 