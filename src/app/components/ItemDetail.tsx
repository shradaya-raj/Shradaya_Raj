/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
'use client'

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import React, { useEffect, useMemo, useState } from 'react';
import { Item } from '@/lib/types';
import { formatDate } from '@/lib/dateFormatter';
import Navigation from '@/components/Navigation';
import { getAttachmentPaths, getPrimaryImagePath } from '@/lib/media';
import DynamicVisualizations from './DynamicVisualizations';

interface ItemDetailProps {
    item: Item;
}

export default function ItemDetail({ item }: ItemDetailProps) {
    const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
    const coverImage = useMemo(() => getPrimaryImagePath(item), [item])
    const attachmentPaths = useMemo(() => getAttachmentPaths(item), [item])
    const attachmentGroups = useMemo(() => {
        const getExt = (value: string) => {
            const name = value.split('/').pop() || value;
            const idx = name.lastIndexOf('.');
            return idx >= 0 ? name.slice(idx).toLowerCase() : '';
        };

        const images: string[] = [];
        const videos: string[] = [];
        const docs: string[] = [];
        const other: string[] = [];

        for (const path of attachmentPaths) {
            const ext = getExt(path);
            if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg'].includes(ext)) images.push(path);
            else if (['.mp4', '.webm', '.mov', '.m4v'].includes(ext)) videos.push(path);
            else if (['.pdf', '.doc', '.docx', '.txt', '.csv', '.xlsx'].includes(ext)) docs.push(path);
            else other.push(path);
        }

        return { images, videos, docs, other };
    }, [attachmentPaths])

    useEffect(() => {
        if (!lightbox) return

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightbox(null)
        }

        // Basic focus/UX: prevent background scroll while lightbox is open.
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', onKeyDown)

        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [lightbox])

    return (
        <>
            <Navigation />
            {lightbox && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="relative w-[92vw] h-[86vh] max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={lightbox.src}
                            alt={lightbox.alt}
                            fill
                            className="object-contain"
                            priority
                        />
                        <button
                            type="button"
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                            onClick={() => setLightbox(null)}
                            aria-label="Close image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
            <main className="min-h-screen bg-black text-white pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-12">
                        {item.featured && (
                            <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold uppercase tracking-wider mb-4">
                                Featured Project
                            </span>
                        )}
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{item.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                            <span className="capitalize">{item.category}</span>
                        </div>
                    </header>

                    {coverImage && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 ring-1 ring-white/10">
                            <button
                                type="button"
                                className="absolute inset-0 z-10 cursor-zoom-in"
                                onClick={() =>
                                    setLightbox({
                                        src: coverImage,
                                        alt: item.title,
                                    })
                                }
                                aria-label="Open project image"
                            />
                            <Image
                                src={coverImage}
                                alt={item.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-2xl font-semibold mb-4 text-blue-400">Overview</h2>
                                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                                    {item.description}
                                </p>
                            </section>

                            {attachmentPaths.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Attachments</h2>
                                    <div className="space-y-4">
                                        {attachmentGroups.videos.length > 0 && (
                                            <div className="space-y-3">
                                                <h3 className="text-sm uppercase tracking-wide text-gray-400">Videos</h3>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {attachmentGroups.videos.map((video) => (
                                                        <div key={video} className="rounded-xl border border-white/10 bg-gray-900/40 p-3">
                                                            <video controls className="w-full rounded-lg bg-black">
                                                                <source src={video} />
                                                                Your browser does not support this video format.
                                                            </video>
                                                            <a
                                                                href={video}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-block mt-2 text-xs text-blue-300 hover:text-blue-200 underline break-all"
                                                            >
                                                                {video.split('/').pop()}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {attachmentGroups.images.length > 0 && (
                                            <div className="space-y-3">
                                                <h3 className="text-sm uppercase tracking-wide text-gray-400">Images</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {attachmentGroups.images.map((img) => (
                                                        <button
                                                            key={img}
                                                            type="button"
                                                            onClick={() => setLightbox({ src: img, alt: img.split('/').pop() || 'Attachment image' })}
                                                            className="text-left rounded-xl border border-white/10 bg-gray-900/40 p-2 hover:border-blue-400/40 transition"
                                                        >
                                                            <div className="relative aspect-video rounded-lg overflow-hidden">
                                                                <Image src={img} alt={img.split('/').pop() || 'Attachment image'} fill className="object-cover" />
                                                            </div>
                                                            <span className="inline-block mt-2 text-xs text-blue-300 underline break-all">
                                                                {img.split('/').pop()}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {(attachmentGroups.docs.length > 0 || attachmentGroups.other.length > 0) && (
                                            <div className="space-y-3">
                                                <h3 className="text-sm uppercase tracking-wide text-gray-400">Documents</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {[...attachmentGroups.docs, ...attachmentGroups.other].map((attachment) => (
                                                        <div key={attachment} className="rounded-xl border border-white/10 bg-gray-900/40 p-3">
                                                            <p className="text-sm text-white break-all">{attachment.split('/').pop()}</p>
                                                            <div className="mt-2 flex gap-3 text-xs">
                                                                <a
                                                                    href={attachment}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-blue-300 hover:text-blue-200 underline"
                                                                >
                                                                    Open
                                                                </a>
                                                                <a
                                                                    href={attachment}
                                                                    download
                                                                    className="text-blue-300 hover:text-blue-200 underline"
                                                                >
                                                                    Download
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {item.aiContent && (
                                <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-8 mb-12">
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                                            <path d="M12 6a1 1 0 0 0-1 1v4H7a1 1 0 0 0 0 2h4v4a1 1 0 0 0 2 0v-4h4a1 1 0 0 0 0-2h-4V7a1 1 0 0 0-1-1z" />
                                        </svg>
                                    </div>
                                    <h2 className="flex items-center text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                        <span className="mr-3 text-3xl">✨</span> AI Insights
                                    </h2>
                                    <div className="prose prose-invert prose-blue max-w-none prose-headings:text-blue-300 prose-strong:text-white">
                                        <ReactMarkdown>{item.aiContent}</ReactMarkdown>
                                    </div>
                                </section>
                            )}

                            {item.autoReport && (
                                <section className="rounded-2xl border border-white/10 bg-gray-900/40 p-6">
                                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Auto-Generated Report</h2>
                                    <div className="prose prose-invert prose-blue max-w-none prose-headings:text-blue-300 prose-strong:text-white">
                                        <ReactMarkdown>{item.autoReport}</ReactMarkdown>
                                    </div>
                                </section>
                            )}

                            {item.visualizations && item.visualizations.length > 0 && (
                                <DynamicVisualizations visualizations={item.visualizations} />
                            )}

                            {item.fullText && (
                                <section className="prose prose-invert max-w-none">
                                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">Details</h2>
                                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {item.fullText}
                                    </div>
                                </section>
                            )}
                        </div>

                        <aside className="space-y-8">
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold mb-4 text-blue-400">Knowledge Tags</h3>
                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </aside>
                    </div>
                </div>
            </main >
        </>
    );
}
