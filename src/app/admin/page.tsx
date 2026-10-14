import Link from 'next/link';
import { getAllItems } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projects, achievements, eca] = await Promise.all(['projects', 'achievements', 'eca'].map(category => getAllItems(category as 'projects' | 'achievements' | 'eca')));
  return <main className="min-h-screen bg-black text-white px-6 py-12"><div className="max-w-5xl mx-auto">
    <h1 className="text-4xl font-bold mt-8 mb-3">Website dashboard</h1>
    <p className="text-gray-400 mb-8">Use the navigation above to edit your pages, manage content or open the AI assistant.</p>
    <div className="grid sm:grid-cols-3 gap-5">{[['Projects', projects.length], ['Achievements', achievements.length], ['Activities', eca.length]].map(([name, count]) => <div key={name} className="rounded-2xl p-6 bg-gray-900/60 border border-blue-500/20"><p className="text-3xl font-bold text-blue-300">{count}</p><h2 className="mt-2 text-gray-300">{name}</h2></div>)}</div>
    <Link href="/admin/upload" className="inline-block mt-8 rounded-full bg-blue-500/15 border border-blue-500/30 px-5 py-3 text-blue-200 hover:bg-blue-500/25">Manage content →</Link>
  </div></main>;
}
