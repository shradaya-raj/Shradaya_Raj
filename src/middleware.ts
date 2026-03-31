import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"',
    },
  });
}

function isAllowedWithoutAuth() {
  // In local development, allow access even without ADMIN_PASSWORD.
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== 'production';
}

export function middleware(req: NextRequest) {
  if (isAllowedWithoutAuth()) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD;
  if (!password) return unauthorized();

  const auth = req.headers.get('authorization') ?? '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'basic' || !encoded) return unauthorized();

  let decoded = '';
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(':');
  const providedPassword = idx >= 0 ? decoded.slice(idx + 1) : '';
  if (providedPassword !== password) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/upload',
    '/api/ai-assist',
    '/api/ai-draft',
    '/api/ai-to-pr',
    '/api/items/:path*',
  ],
};

