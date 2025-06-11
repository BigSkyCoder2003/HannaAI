import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { isValid: false, error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Validate agent ID format - should be alphanumeric with dashes/underscores only
    const agentIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!agentIdRegex.test(agentId) || agentId.length > 50) {
      return NextResponse.json(
        { isValid: false, error: 'Invalid agent ID format' },
        { status: 400 }
      );
    }

    // Only allow requests to chatbase.co domain (prevent SSRF)
    const iframeUrl = `https://www.chatbase.co/chatbot-iframe/${encodeURIComponent(agentId)}`;
    
    // Double-check the URL is what we expect
    if (!iframeUrl.startsWith('https://www.chatbase.co/chatbot-iframe/')) {
      return NextResponse.json(
        { isValid: false, error: 'Invalid URL generated' },
        { status: 400 }
      );
    }

    const response = await fetch(iframeUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HannaAI/1.0)',
      },
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000)
    });

    if (response.status === 404) {
      return NextResponse.json(
        { isValid: false, error: 'Agent ID not found (404)' },
        { status: 200 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { isValid: false, error: `HTTP ${response.status}: ${response.statusText}` },
        { status: 200 }
      );
    }

    // Agent ID appears to be valid
    return NextResponse.json(
      { isValid: true },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking agent ID:', error);
    return NextResponse.json(
      { isValid: false, error: 'Network error checking agent ID' },
      { status: 200 }
    );
  }
} 