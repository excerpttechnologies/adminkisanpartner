import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    const path = searchParams.get('path');
    const url = searchParams.get('url');

    if (!fileName && !path && !url) {
      return NextResponse.json(
        { error: 'Missing file, path or url parameter' },
        { status: 400 }
      );
    }

    // Construct the URL to fetch from remote server
    let remoteUrl: string;
    if (url) {
      // If a full URL is provided, use it directly
      remoteUrl = url;
    } else if (path) {
      // If path is provided (like /uploads/ads/filename), determine if it's a full URL or relative
      if (path.startsWith('http')) {
        remoteUrl = path;
      } else {
        remoteUrl = `https://kisanadmin.etpl.ai${path}`;
      }
    } else {
      // If only filename is provided, construct the path on the remote server
      remoteUrl = `https://kisanadmin.etpl.ai/uploads/${fileName}`;
    }

    console.log(`[Image Proxy] Fetching from: ${remoteUrl}`);

    // Fetch the image from the remote server
    const response = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'NextJS-Image-Proxy/1.0',
      },
    });

    if (!response.ok) {
      console.error(`[Image Proxy] Failed to fetch: ${remoteUrl}, Status: ${response.status}`);
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the content type from the remote response
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    // Serve the image with appropriate headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[Image Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}
