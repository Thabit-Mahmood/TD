import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    
    // Map common image extensions to MIME types
    const mimeTypes: Record<string, string> = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'txt': 'text/plain',
      'xml': 'application/xml',
      'json': 'application/json',
    };

    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Try to fetch from public folder via the ASSETS binding
    const assetResponse = await fetch(new URL(`/${filePath}`, request.url));
    
    if (!assetResponse.ok) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const buffer = await assetResponse.arrayBuffer();
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Static file error:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
