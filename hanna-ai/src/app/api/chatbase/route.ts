import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.CHATBASE_API_KEY;
  const chatbotId = process.env.CHATBASE_AGENT_ID;

  if (!apiKey || !chatbotId) {
    return NextResponse.json({ error: "Chatbase credentials not set." }, { status: 500 });
  }

  try {
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