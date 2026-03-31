import { NextResponse } from 'next/server';

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"',
    },
  });
}

export function isAdminRequest(req: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;

  // In local development, allow access without configuring secrets.
  if (!password && process.env.NODE_ENV !== 'production') return true;

  if (!password) return false;

  const auth = req.headers.get('authorization') ?? '';
  const [scheme, encoded] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'basic' || !encoded) return false;

  let decoded = '';
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return false;
  }

  const idx = decoded.indexOf(':');
  const providedPassword = idx >= 0 ? decoded.slice(idx + 1) : '';
  return providedPassword === password;
}

export function requireAdmin(req: Request): NextResponse | null {
  return isAdminRequest(req) ? null : unauthorized();
}

