'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';

type Mode = 'site' | 'item';

type ItemsAllResponse = {
  projects: any[];
  achievements: any[];
  eca: any[];
};

export default function AdminAiPage() {
  const [mode, setMode] = useState<Mode>('site');

  const [sitePage, setSitePage] = useState<'home' | 'about' | 'contact'>('home');

  const [items, setItems] = useState<ItemsAllResponse>({ projects: [], achievements: [], eca: [] });
  const [category, setCategory] = useState<'projects' | 'achievements' | 'eca'>('projects');
  const [slug, setSlug] = useState<string>('');

  const [instruction, setInstruction] = useState('');
  const [currentJson, setCurrentJson] = useState<any>(null);
  const [proposedJson, setProposedJson] = useState<any>(null);

  const [isLoadingCurrent, setIsLoadingCurrent] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isCreatingPr, setIsCreatingPr] = useState(false);
  const [lastPrUrl, setLastPrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const itemOptions = useMemo(() => items[category] ?? [], [items, category]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items/all');
        if (!res.ok) return;
        const data = await res.json();
        setItems(data);
      } catch {
        // ignore
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    // Default slug to first item when switching category.
    if (mode !== 'item') return;
    const first = itemOptions?.[0]?.slug;
    if (first && !slug) setSlug(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, category, itemOptions?.length]);

  const loadCurrent = async () => {
    setError(null);
    setLastPrUrl(null);
    setProposedJson(null);
    setIsLoadingCurrent(true);
    try {
      if (mode === 'site') {
        const res = await fetch(`/api/site/${sitePage}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load site JSON');
        setCurrentJson(data);
      } else {
        if (!slug) throw new Error('Select an item slug.');
        const res = await fetch(`/api/items/${category}/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load item JSON');
        setCurrentJson(data);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load JSON');
      setCurrentJson(null);
    } finally {
      setIsLoadingCurrent(false);
    }
  };

  useEffect(() => {
    loadCurrent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sitePage, category, slug]);

  const draft = async () => {
    setError(null);
    setLastPrUrl(null);
    setIsDrafting(true);
    try {
      const res = await fetch('/api/ai-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          sitePage,
          category,
          slug,
          instruction,
          current: currentJson,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'AI draft failed');
      setProposedJson(data.proposed);
    } catch (e: any) {
      setError(e.message || 'AI draft failed');
    } finally {
      setIsDrafting(false);
    }
  };

  const createPr = async () => {
    setError(null);
    setLastPrUrl(null);
    setIsCreatingPr(true);
    try {
      const res = await fetch('/api/ai-to-pr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          sitePage,
          category,
          slug,
          instruction,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'PR creation failed');
      setLastPrUrl(data.prUrl);
    } catch (e: any) {
      setError(e.message || 'PR creation failed');
    } finally {
      setIsCreatingPr(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-black pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="p-6 bg-gray-900/50 rounded-2xl border border-white/10">
            <h1 className="text-2xl font-bold text-white">Admin: AI Assistant</h1>
            <p className="text-gray-400 text-sm mt-2">
              Describe what you want to change. Preview the JSON, then create a PR to publish.
            </p>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-2xl border border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Mode</label>
                <select
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as Mode);
                    setSlug('');
                    setCurrentJson(null);
                    setProposedJson(null);
                    setLastPrUrl(null);
                  }}
                  className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none"
                >
                  <option value="site">Edit site pages (home/about/contact)</option>
                  <option value="item">Edit an item (projects/achievements/eca)</option>
                </select>
              </div>

              {mode === 'site' ? (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Site page</label>
                  <select
                    value={sitePage}
                    onChange={(e) => setSitePage(e.target.value as any)}
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none"
                  >
                    <option value="home">home</option>
                    <option value="about">about</option>
                    <option value="contact">contact</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value as any);
                        setSlug('');
                      }}
                      className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none"
                    >
                      <option value="projects">projects</option>
                      <option value="achievements">achievements</option>
                      <option value="eca">eca</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Item</label>
                    <select
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none"
                    >
                      {itemOptions.map((it) => (
                        <option key={it.slug} value={it.slug}>
                          {it.slug}
                        </option>
                      ))}
                      {itemOptions.length === 0 && <option value="">(no items)</option>}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Instruction</label>
              <textarea
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={4}
                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-white outline-none"
                placeholder="Example: Rewrite the intro to be more professional, fix typos, and keep the tone friendly."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadCurrent}
                disabled={isLoadingCurrent}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50"
              >
                {isLoadingCurrent ? 'Loading…' : 'Reload current JSON'}
              </button>
              <button
                type="button"
                onClick={draft}
                disabled={isDrafting || !instruction || !currentJson}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isDrafting ? 'Drafting…' : 'Generate preview'}
              </button>
              <button
                type="button"
                onClick={createPr}
                disabled={isCreatingPr || !instruction}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50"
              >
                {isCreatingPr ? 'Creating PR…' : 'Create PR'}
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
                {error}
              </div>
            )}

            {lastPrUrl && (
              <div className="p-4 rounded-xl border border-white/10 bg-black/30">
                <p className="text-sm text-gray-300">Pull Request created:</p>
                <a
                  href={lastPrUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline break-all text-sm"
                >
                  {lastPrUrl}
                </a>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-white/10">
              <h2 className="text-white font-semibold mb-3">Current JSON</h2>
              <pre className="text-xs text-gray-300 overflow-auto max-h-[520px] bg-black/40 p-4 rounded-xl border border-white/5">
                {currentJson ? JSON.stringify(currentJson, null, 2) : '(none)'}
              </pre>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-2xl border border-white/10">
              <h2 className="text-white font-semibold mb-3">Proposed JSON (preview)</h2>
              <pre className="text-xs text-gray-300 overflow-auto max-h-[520px] bg-black/40 p-4 rounded-xl border border-white/5">
                {proposedJson ? JSON.stringify(proposedJson, null, 2) : '(generate a preview)'}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

