import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/adminAuth';

async function canWrite(dirPath: string): Promise<boolean> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    const probePath = path.join(dirPath, `.write-probe-${Date.now()}.tmp`);
    await fs.writeFile(probePath, 'ok', 'utf8');
    await fs.unlink(probePath);
    return true;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const shouldUseGitHubPr =
    process.env.NODE_ENV === 'production' &&
    !!process.env.GITHUB_TOKEN &&
    !!process.env.GITHUB_OWNER &&
    !!process.env.GITHUB_REPO;

  const dataWritable = await canWrite(path.join(process.cwd(), 'data', 'projects'));
  const mediaWritable = await canWrite(path.join(process.cwd(), 'public', 'images', 'projects', 'diagnostics'));

  return NextResponse.json({
    ok: true,
    mode: shouldUseGitHubPr ? 'pr' : 'local',
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    aiConfigured: !!process.env.DEEPSEEK_API_KEY,
    dataWritable,
    mediaWritable,
    cwd: process.cwd(),
  });
}
