import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    
    // Map common file extensions to MIME types
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
      'css': 'text/css',
      'js': 'application/javascript',
    };

    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    // Construct the full path to the public file
    const fullPath = `/${filePath}`;
    
    // Return the file with proper caching headers
    return new NextResponse(null, {
      status: 307,
      headers: {
        'Location': fullPath,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Public file error:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
