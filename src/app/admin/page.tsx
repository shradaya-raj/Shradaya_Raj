import Link from 'next/link';
import { getAllItems } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [projects, achievements, eca] = await Promise.all(['projects', 'achievements', 'eca'].map(category => getAllItems(category as 'projects' | 'achievements' | 'eca')));
  const links = [
    ['Home', 'Biography, tools, statistics, buttons and featured projects', '/admin/pages/home'],
    ['About', 'Introduction paragraphs and skills', '/admin/pages/about'],
    ['Contact', 'Contact details, photo and LinkedIn', '/admin/pages/contact'],
    ['Content library', `${projects.length} projects · ${achievements.length} achievements · ${eca.length} activities`, '/admin/upload'],
    ['AI assistant', 'Optional assistance with content', '/admin/ai'],
  ];
  return <main className="min-h-screen bg-black text-white px-6 py-12"><div className="max-w-5xl mx-auto">
    <Link className="text-blue-300" href="/">← View website</Link>
    <h1 className="text-4xl font-bold mt-8 mb-3">Website dashboard</h1>
    <p className="text-gray-400 mb-8">Choose a page to edit. Review changes before saving.</p>
    <div className="grid md:grid-cols-2 gap-5">{links.map(([title, description, href]) => <Link key={href} href={href} className="rounded-2xl p-6 bg-gray-900 border border-gray-800 hover:border-blue-500"><h2 className="text-xl font-semibold mb-2">{title}</h2><p className="text-gray-400">{description}</p></Link>)}</div>
  </div></main>;
}
