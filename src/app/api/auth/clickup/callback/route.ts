import { NextRequest, NextResponse } from 'next/server';

const CLICKUP_CLIENT_ID = process.env.CLICKUP_CLIENT_ID || '9M53WAXCHZGD3DNDVSJ39OOQLU4QKLQX';
const CLICKUP_CLIENT_SECRET = process.env.CLICKUP_CLIENT_SECRET || '3MQJ1LKGR9EZH9QJDARNGQTS15ZM4A7M9QAWB204RX4PR3AKUJZ4OHEUPEM55N1J';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('[ClickUp OAuth] Authorization error:', error);
      return new NextResponse(
        `<html><body><h1>ClickUp Authorization Error</h1><p>Error: ${error}</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!code) {
      console.error('[ClickUp OAuth] No authorization code received');
      return new NextResponse(
        `<html><body><h1>No Code Received</h1><p>No authorization code was provided.</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.clickup.com/api/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: CLICKUP_CLIENT_ID,
        client_secret: CLICKUP_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[ClickUp OAuth] Token exchange failed:', errorText);
      return new NextResponse(
        `<html><body><h1>Token Exchange Failed</h1><p>Error: ${errorText}</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    console.log('[ClickUp OAuth] Successfully obtained access token');
    console.log('[ClickUp OAuth] Token:', accessToken);

    // Display the token on the page so user can copy it
    return new NextResponse(
      `<html>
        <head><title>ClickUp Connected</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #10b981;">✅ ClickUp Connected Successfully!</h1>
          <p>Your access token has been generated. Copy this token and add it to your environment variables:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; word-break: break-all;">
            <strong>CLICKUP_ACCESS_TOKEN=</strong><br/>
            <code style="color: #b23028; font-size: 14px;">${accessToken}</code>
          </div>
          <p style="color: #6b7280;">Add this to your .env.local file and redeploy.</p>
          <a href="/dashboard" style="display: inline-block; background: #b23028; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">Go to Dashboard</a>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );

  } catch (error) {
    console.error('[ClickUp OAuth] Callback error:', error);
    return new NextResponse(
      `<html><body><h1>Callback Error</h1><p>Error: ${error}</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
