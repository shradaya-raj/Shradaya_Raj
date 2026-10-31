import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/Navigation';
import PortfolioMotion from '@/components/PortfolioMotion';
import { Item } from '@/lib/types';
import { getAttachmentPaths, getPrimaryImagePath, isVideoFile } from '@/lib/media';
import FieldVideo from '@/components/FieldVideo';

const sectionShell = 'relative overflow-hidden rounded-2xl border border-blue-900/35 bg-gradient-to-br from-gray-950 via-gray-950/85 to-gray-900/70 shadow-[0_22px_70px_rgba(0,0,0,0.35)]';
const innerBorder = 'absolute inset-px rounded-[15px] border border-blue-500/10 pointer-events-none';
const prose = 'prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-300 prose-strong:text-white prose-em:text-gray-400 prose-li:text-gray-300';

export default function RasuwaCaseStudy({ item }: { item: Item }) {
    const featuredPhoto = getPrimaryImagePath(item);
    const videos = getAttachmentPaths(item).filter(isVideoFile);
    const date = new Date(`${item.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const facts = (item.dataPointsRaw || '').split('\n').filter(Boolean).map(line => {
        const colon = line.indexOf(':');
        return { label: line.slice(0, colon), value: line.slice(colon + 1).trim() };
    });
    const chapters = (item.fullText || '').split(/^## /m).filter(Boolean).map((block, index) => {
        const newline = block.indexOf('\n');
        const title = index === 0 ? 'Field overview' : block.slice(0, newline).trim();
        let body = index === 0 ? block : block.slice(newline + 1);
        const photos: { alt: string; src: string; caption: string }[] = [];
        body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\s*\n\s*\*([^*\n]+)\*)?/g, (_match, alt, src, caption) => {
            photos.push({ alt, src, caption: caption || '' });
            return '';
        });
        return { title, body: body.trim(), photos };
    });

    const impactIndex = chapters.findIndex(chapter => chapter.title === 'The difference our work made');
    const renderChapter = (chapter: typeof chapters[number], index: number) => (
        <PortfolioMotion key={`${index}-${chapter.title}`}>
            <section id={index === impactIndex ? 'field-impact' : undefined} className={`${sectionShell} scroll-mt-28 ${index === impactIndex ? 'ring-1 ring-blue-400/35' : ''}`} aria-labelledby={`chapter-${index}`}>
                <div className={innerBorder} />
                <div className="relative p-6 sm:p-8">
                    <h2 id={`chapter-${index}`} className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6">{chapter.title}</h2>
                    <div className={chapter.photos.length ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-start' : ''}>
                        <div className={prose}><ReactMarkdown components={index === impactIndex ? {
                            ul: ({ children }) => <ul className="!list-none !p-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:[&>li:last-child:nth-child(odd)]:col-span-2">{children}</ul>,
                            li: ({ children }) => <li className="!m-0 rounded-xl border border-blue-400/20 bg-blue-500/5 !p-5 [&_strong]:block [&_strong]:mb-2 [&_strong]:text-lg [&_strong]:text-blue-200">{children}</li>,
                        } : chapter.photos.length > 0 || /^### /m.test(chapter.body) ? {
                            ol: ({ children }) => <ol className="!list-none !p-0 grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</ol>,
                            ul: ({ children }) => <ul className="!list-none !p-0 grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</ul>,
                            li: ({ children }) => <li className="!m-0 rounded-xl border border-blue-400/15 bg-blue-500/5 !p-4 text-sm [&_strong]:block [&_strong]:mb-1 [&_strong]:text-blue-200">{children}</li>,
                        } : undefined}>{chapter.body}</ReactMarkdown></div>
                        {chapter.photos.length > 0 && (
                            <div className="space-y-6">
                                {chapter.photos.map(photo => (
                                    <figure key={photo.src} className="overflow-hidden rounded-xl border border-blue-500/15 bg-black/20">
                                        <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`View full image: ${photo.alt}`}>
                                            <Image src={photo.src} alt={photo.alt} width={1600} height={1200} sizes="(min-width: 1152px) 520px, (min-width: 1024px) calc(50vw - 56px), calc(100vw - 84px)" className="w-full h-auto max-h-[560px] object-contain" />
                                        </a>
                                        {photo.caption && <figcaption className="px-4 py-3 text-center text-xs leading-relaxed text-gray-300">{photo.caption}</figcaption>}
                                    </figure>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PortfolioMotion>
    );

    return (
        <>
            <Navigation />
            <main id="main-content" tabIndex={-1} className="min-h-screen bg-black text-white py-20">
                <article className="max-w-6xl mx-auto px-4">
                    <div>
                        <header className={`${sectionShell} mb-12`}>
                            <div className={innerBorder} />
                            <div className="grid grid-cols-1 lg:grid-cols-5">
                                {featuredPhoto && (
                                    <figure className="order-2 lg:order-1 lg:col-span-3 flex flex-col bg-black/20 min-w-0">
                                        <a href={featuredPhoto} target="_blank" rel="noreferrer" aria-label="View featured field photograph at full size" className="flex flex-1 items-center justify-center p-4 sm:p-6">
                                            <Image src={featuredPhoto} alt="Field team member with a cargo drone and helicopter during the Rasuwa response" width={960} height={1280} sizes="(min-width: 1152px) 672px, (min-width: 1024px) 60vw, 100vw" priority className="w-full h-auto max-h-[420px] sm:max-h-[600px] object-contain rounded-xl" />
                                        </a>
                                    </figure>
                                )}
                                <div className="relative order-1 lg:order-2 lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center gap-5 min-w-0">
                                    <p className="text-xs uppercase tracking-widest text-blue-300">Rasuwa, Nepal · {date}</p>
                                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{item.title}</h1>
                                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                                    <ul className="flex flex-wrap gap-2" aria-label="Project topics">
                                        {item.tags.map(tag => <li key={tag} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs text-blue-50">{tag}</li>)}
                                    </ul>
                                    {facts.length > 0 && <dl className="grid grid-cols-2 gap-3 text-sm">
                                        {facts.map(fact => <div key={fact.label} className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                                            <dt className="text-gray-400 text-xs">{fact.label}</dt>
                                            <dd className="mt-1 text-blue-200 font-semibold">{fact.value}</dd>
                                        </div>)}
                                    </dl>}
                                    <div className="flex flex-wrap gap-3 text-sm">
                                        <a href="#field-story" className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">Read the field story ↓</a>
                                        {impactIndex >= 0 && <a href="#field-impact" className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">Our impact ↓</a>}
                                        {videos.length > 0 && <a href="#field-videos" className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">Watch the field videos ↓</a>}
                                    </div>
                                </div>
                            </div>
                        </header>
                    </div>
                    <div id="field-story" className="scroll-mt-28 space-y-12 sm:space-y-16">
                        {chapters.length > 0 && renderChapter(chapters[0], 0)}
                        {impactIndex > 0 && renderChapter(chapters[impactIndex], impactIndex)}
                        {videos.length > 0 && (
                            <PortfolioMotion>
                                <section id="field-videos" aria-labelledby="field-videos-heading" className={`${sectionShell} scroll-mt-28`}>
                                    <div className={innerBorder} />
                                    <div className="relative p-6 sm:p-8">
                                        <h2 id="field-videos-heading" className="text-2xl sm:text-3xl font-bold text-blue-400">From the field</h2>
                                        <p className="mt-3 mb-8 text-gray-300 leading-relaxed">Watch scenes from the Rasuwa deployment.</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                            {videos.map(video => {
                                                const label = (video.split('/').pop() || 'Field video').replace(/\.[^.]+$/, '').replace(/-/g, ' ');
                                                return <figure key={video} className="overflow-hidden rounded-xl border border-blue-500/15 bg-black/30">
                                                    <FieldVideo src={video} label={label} />
                                                    <figcaption className="px-4 py-3 text-center text-sm text-gray-300 capitalize">{label}</figcaption>
                                                </figure>;
                                            })}
                                        </div>
                                    </div>
                                </section>
                            </PortfolioMotion>
                        )}
                        {chapters.map((chapter, index) => index > 0 && index !== impactIndex ? renderChapter(chapter, index) : null)}
                    </div>
                </article>
            </main>
        </>
    );
}
