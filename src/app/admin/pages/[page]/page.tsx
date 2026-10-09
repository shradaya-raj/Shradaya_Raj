'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isSitePage } from '@/lib/siteContent';

const label = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, character => character.toUpperCase());
const inputClass = 'w-full bg-black border border-gray-700 rounded-lg p-3 text-white';

function ImagePreview({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const safeSource = /^\/(?!\/)/.test(src) || /^https?:\/\//i.test(src);
  if (!src.trim()) return <p className="text-sm text-gray-400">No image selected.</p>;
  if (!safeSource) return <p role="status" className="text-sm text-amber-300">Enter a local image path or an http/https image URL to preview it.</p>;
  return <div className="rounded-xl border border-gray-700 bg-black p-4 space-y-2">
    {!failed && <>
      {!loaded && <p className="text-sm text-gray-400">Loading image preview…</p>}
      {/* Native images preview remote URLs without requiring Next image host configuration. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Selected image preview" className="max-h-64 max-w-full rounded-lg object-contain" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
    </>}
    {failed && <p role="status" className="text-sm text-amber-300">This image could not be loaded. Check the path or choose another image.</p>}
    <p className="text-xs text-gray-400 break-all">{src}</p>
  </div>;
}

function Fields({ value, onChange, name }: { value: any; onChange: (value: any) => void; name: string }) {
  if (typeof value === 'string') return <div className="space-y-3"><label className="block space-y-2"><span className="text-gray-300">{label(name)}</span>{/paragraph|description/i.test(name) ? <textarea className={inputClass} rows={5} value={value} onChange={event => onChange(event.target.value)} /> : <input className={inputClass} value={value} onChange={event => onChange(event.target.value)} />}</label>{['profileImage', 'imageSrc'].includes(name) && <ImagePreview key={value} src={value} />}</div>;
  if (Array.isArray(value)) {
    const makeEntry = () => {
      if (name === 'stats') return { number: '', label: '' };
      if (name === 'toolsCategories') return { title: '', items: [] };
      return '';
    };
    const move = (index: number, direction: number) => { const next = [...value]; [next[index], next[index + direction]] = [next[index + direction], next[index]]; onChange(next); };
    return <fieldset className="border border-gray-700 rounded-xl p-4 space-y-4"><legend className="px-2 font-semibold">{label(name)}</legend>{value.map((entry, index) => <div key={index} className="bg-gray-950 rounded-lg p-4 space-y-3"><Fields name={`${name} ${index + 1}`} value={entry} onChange={updated => onChange(value.map((item, position) => position === index ? updated : item))} /><div className="flex gap-4 text-sm"><button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="text-blue-300 disabled:opacity-30" aria-label={`Move ${name} ${index + 1} up`}>↑ Move up</button><button type="button" disabled={index === value.length - 1} onClick={() => move(index, 1)} className="text-blue-300 disabled:opacity-30" aria-label={`Move ${name} ${index + 1} down`}>↓ Move down</button><button type="button" onClick={() => onChange(value.filter((_, position) => position !== index))} className="text-red-300" aria-label={`Remove ${name} ${index + 1}`}>Remove</button></div></div>)}<button type="button" className="text-blue-300" onClick={() => onChange([...value, makeEntry()])}>+ Add {label(name)}</button></fieldset>;
  }
  return <div className="space-y-5">{Object.entries(value).map(([key, entry]) => <div key={key}>{typeof entry === 'object' && !Array.isArray(entry) && <h2 className="text-xl font-semibold mb-4">{label(key)}</h2>}<Fields name={key} value={entry} onChange={updated => onChange({ ...value, [key]: updated })} /></div>)}</div>;
}

export default function PageEditor({ params }: { params: { page: string } }) {
  const [content, setContent] = useState<any>(null);
  const [original, setOriginal] = useState('');
  const [projects, setProjects] = useState<{ slug: string; title: string }[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [prUrl, setPrUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState(false);
  const page = params.page;

  useEffect(() => {
    if (!isSitePage(page)) { setError('Page not found.'); return; }
    let active = true;
    setContent(null); setError(''); setReview(false); setMessage(''); setPrUrl('');
    Promise.all([fetch(`/api/site/${page}`, { cache: 'no-store' }), page === 'home' ? fetch('/api/items/all', { cache: 'no-store' }) : Promise.resolve(null)])
      .then(async ([response, itemsResponse]) => {
        if (!response.ok || (itemsResponse && !itemsResponse.ok)) throw new Error('Could not load the editor.');
        const data = await response.json();
        if (page === 'home') data.featuredProjects ??= { mode: 'automatic', slugs: [], limit: '3' };
        const items = itemsResponse ? await itemsResponse.json() : null;
        if (active) { setContent(data); setOriginal(JSON.stringify(data)); setProjects(items?.projects ?? []); }
      }).catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [page]);

  const dirty = content && JSON.stringify(content) !== original;
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const save = async () => {
    setSaving(true); setError(''); setMessage(''); setPrUrl('');
    try {
      const response = await fetch(`/api/site/${page}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Save failed.');
      if (result.prUrl) { setPrUrl(result.prUrl); setMessage('Changes submitted for review. Merge and deploy to publish.'); }
      else { setOriginal(JSON.stringify(content)); setMessage(result.message); }
      setReview(false);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Save failed.'); }
    finally { setSaving(false); }
  };

  const settings = content?.featuredProjects;
  const updateSettings = (next: any) => setContent({ ...content, featuredProjects: { ...settings, ...next } });
  const selected = settings?.slugs ?? [];
  return <main className="min-h-screen bg-black text-white p-6"><div className="max-w-3xl mx-auto space-y-6">
    <Link href="/admin" className="text-blue-300">← Dashboard</Link>
    <h1 className="text-3xl font-bold">Edit {label(page)}</h1>
    <p className="text-gray-400">Edit text and lists below. Image fields currently use an existing image path. Media uploads will be added in a later step.</p>
    {error && <p role="alert" className="p-4 bg-red-950 text-red-200 rounded-lg">{error}</p>}
    {message && <div role="status" className="p-4 bg-green-950 rounded-lg">{message}{prUrl && <a href={prUrl} target="_blank" rel="noreferrer" className="block underline mt-2">Open publishing review</a>}</div>}
    {!content && !error && <p>Loading editor…</p>}
    {content && <><div className="bg-gray-900 p-6 rounded-2xl"><Fields name={page} value={Object.fromEntries(Object.entries(content).filter(([key]) => key !== 'featuredProjects'))} onChange={updated => setContent({ ...updated, ...(settings ? { featuredProjects: settings } : {}) })} /></div>
    {settings && <section className="bg-gray-900 rounded-2xl p-6 space-y-4"><h2 className="text-xl font-semibold">Featured projects</h2><label className="block">Selection mode<select className={inputClass} value={settings.mode} onChange={event => updateSettings({ mode: event.target.value })}><option value="automatic">Newest projects marked featured</option><option value="manual">Choose and order projects myself</option></select></label><label className="block">Maximum displayed<input type="number" min="1" max="30" className={inputClass} value={settings.limit} onChange={event => updateSettings({ limit: event.target.value })} /></label>
    {settings.mode === 'manual' && <><p className="text-gray-400">Removing a project here keeps it in your project library. An empty selection shows no featured projects.</p><ol className="space-y-3">{selected.map((slug: string, index: number) => <li key={slug} className="p-3 bg-black rounded-lg">{index + 1}. {projects.find(project => project.slug === slug)?.title ?? slug}<div className="flex gap-4 mt-2"><button disabled={index === 0} className="text-blue-300 disabled:opacity-30" onClick={() => { const next = [...selected]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; updateSettings({ slugs: next }); }}>Move up</button><button disabled={index === selected.length - 1} className="text-blue-300 disabled:opacity-30" onClick={() => { const next = [...selected]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; updateSettings({ slugs: next }); }}>Move down</button><button className="text-red-300" onClick={() => updateSettings({ slugs: selected.filter((item: string) => item !== slug) })}>Remove</button></div></li>)}</ol><label className="block">Add project<select className={inputClass} value="" onChange={event => { if (event.target.value) updateSettings({ slugs: [...selected, event.target.value] }); }}><option value="">Choose a project…</option>{projects.filter(project => !selected.includes(project.slug)).map(project => <option key={project.slug} value={project.slug}>{project.title}</option>)}</select></label></>}
    </section>}
    <div className="flex gap-4 items-center"><button className="bg-blue-600 rounded-lg px-5 py-3 disabled:opacity-40" disabled={!dirty || saving} onClick={() => setReview(true)}>Review changes</button><a href={`/${page === 'home' ? '' : page}`} target="_blank" rel="noreferrer" className="text-blue-300">Open current public page</a><button disabled={!dirty || saving} className="text-gray-300 disabled:opacity-40" onClick={() => { setContent(JSON.parse(original)); setReview(false); }}>Discard edits</button></div>
    {review && <section className="border border-blue-500 rounded-xl p-6 space-y-4"><h2 className="text-xl font-semibold">Review before saving</h2><p className="text-gray-300">These are the proposed values. Local saves update your website files. Production saves create a publishing review.</p><div className="max-h-96 overflow-auto bg-gray-900 p-4 rounded-lg"><Review value={content} /></div><div className="flex gap-4"><button className="bg-blue-600 px-5 py-3 rounded-lg disabled:opacity-40" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button><button disabled={saving} onClick={() => setReview(false)}>Continue editing</button></div></section>}
    </>}
  </div></main>;
}

function Review({ value }: { value: any }) {
  if (typeof value === 'string') return <p className="whitespace-pre-wrap break-words">{value || '(empty)'}</p>;
  if (Array.isArray(value)) return <ol className="space-y-3 list-decimal pl-5">{value.map((entry, index) => <li key={index}><Review value={entry} /></li>)}</ol>;
  return <dl className="space-y-4">{Object.entries(value).map(([key, entry]) => <div key={key}><dt className="text-blue-300 font-semibold">{label(key)}</dt><dd className="pl-3 mt-1"><Review value={entry} /></dd></div>)}</dl>;
}
