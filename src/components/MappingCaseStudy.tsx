import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Navigation from '@/components/Navigation';
import PortfolioMotion from '@/components/PortfolioMotion';
import { getPrimaryImagePath, getAttachmentPaths, isVideoFile } from '@/lib/media';
import DeferredVideo from '@/components/DeferredVideo';
import type { Item } from '@/lib/types';

const shell = 'relative overflow-hidden rounded-2xl border border-blue-900/35 bg-gradient-to-br from-gray-950 via-gray-950/85 to-gray-900/70 shadow-[0_22px_70px_rgba(0,0,0,0.35)]';
const border = 'absolute inset-px rounded-[15px] border border-blue-500/10 pointer-events-none';

export default function MappingCaseStudy({ item, landscapeMaps = false, fieldAssessment = false }: { item: Item; landscapeMaps?: boolean; fieldAssessment?: boolean }) {
    const cover = getPrimaryImagePath(item);
    const period = /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? new Date(`${item.date}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : /^\d{4}-\d{2}$/.test(item.date) ? new Date(`${item.date}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }) : item.date.slice(0, 4);
    const videos = getAttachmentPaths(item).filter(isVideoFile);
    const facts = (item.dataPointsRaw || '').split('\n').filter(line => line.includes(':')).map(line => {
        const colon = line.indexOf(':');
        return { label: line.slice(0, colon), value: line.slice(colon + 1).trim() };
    });
    const chapters = (item.fullText || '').split(/^## /m).filter(Boolean).map((block, index) => {
        const newline = block.indexOf('\n');
        const title = index === 0 ? 'Project overview' : block.slice(0, newline).trim();
        let body = index === 0 ? block : block.slice(newline + 1);
        const photos: { src: string; alt: string }[] = [];
        body = body.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
            photos.push({ src, alt });
            return '';
        });
        return { title, body: body.trim(), photos };
    });
    const firstMap = chapters.findIndex(chapter => chapter.photos.length > 0);
    const trainingSection = chapters.findIndex(chapter => /APF/i.test(chapter.title));
    const hasOverviewVideo = landscapeMaps && videos.length > 0 && !fieldAssessment;

    return <>
        <Navigation />
        <main id="main-content" tabIndex={-1} className="min-h-screen bg-black text-white py-20">
            <article className={`max-w-6xl mx-auto px-4 ${landscapeMaps ? 'space-y-8 sm:space-y-10' : 'space-y-12 sm:space-y-16'}`}>
                <header className={shell}>
                    <div className={border} />
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {cover && <a href={cover} target="_blank" rel="noreferrer" aria-label="View project cover image" className="order-2 lg:order-1 lg:col-span-3 flex items-center justify-center bg-black/20 p-4 sm:p-6">
                            <Image src={cover} alt={`${item.title}: project overview`} width={landscapeMaps ? 2200 : 740} height={landscapeMaps ? 1555 : 676} priority sizes="(min-width: 1152px) 640px, (min-width: 1024px) 60vw, 100vw" className="w-full h-auto max-h-[440px] lg:max-h-[600px] object-contain rounded-xl" />
                        </a>}
                        <div className="relative order-1 lg:order-2 lg:col-span-2 p-6 sm:p-8 flex flex-col justify-center gap-5 min-w-0">
                            <p className="text-xs uppercase tracking-widest text-blue-300">{item.tags[0]} · {period}</p>
                            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">{item.title}</h1>
                            <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                            <ul aria-label="Project topics" className="flex flex-wrap gap-2">{item.tags.map(tag => <li key={tag} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs text-blue-50">{tag}</li>)}</ul>
                            {!landscapeMaps && <dl className="grid grid-cols-2 gap-3 text-sm">{facts.map(fact => <div key={fact.label} className="rounded-xl border border-blue-900/35 bg-black/30 px-4 py-3">
                                <dt className="text-gray-400 text-xs">{fact.label}</dt><dd className="mt-1 text-blue-200 font-semibold">{fact.value}</dd>
                            </div>)}</dl>}
                            <div className="flex flex-wrap gap-3 text-sm">
                                <a href="#mapping-section-1" className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">My role ↓</a>
                                {videos.length > 0 && <a href="#mapping-videos" className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">Watch project video ↓</a>}
                                {trainingSection >= 0 && <a href={`#mapping-section-${trainingSection}`} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">APF training ↓</a>}
                                {firstMap >= 0 && <a href={`#mapping-section-${firstMap}`} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-200 hover:bg-blue-500/20">{fieldAssessment ? 'Explore field views ↓' : 'Explore the maps ↓'}</a>}
                            </div>
                        </div>
                    </div>
                    {landscapeMaps && facts.length > 0 && <dl className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-blue-500/15 bg-black/10 p-5 sm:p-6">
                        {facts.map(fact => <div key={fact.label} className="min-w-0 rounded-xl border border-blue-500/15 bg-blue-500/5 px-4 py-4">
                            <dt className="text-xs leading-relaxed text-gray-400">{fact.label}</dt>
                            <dd className="mt-2 text-base sm:text-lg font-semibold text-blue-200">{fact.value}</dd>
                        </div>)}
                    </dl>}
                </header>
                {!hasOverviewVideo && videos.length > 0 && <section id="mapping-videos" className={`${shell} p-6 sm:p-8 scroll-mt-24`} aria-labelledby="mapping-video-heading">
                    <div className={border} />
                    <div className="relative">
                        <h2 id="mapping-video-heading" className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6">{fieldAssessment ? 'Field clips' : 'Project video'}</h2>
                        <div className={videos.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' : 'space-y-6'}>{videos.map(video => <figure key={video} className="overflow-hidden rounded-xl border border-blue-500/15 bg-black/20">
                            <DeferredVideo controls playsInline preload="none" pauseOthersOnPlay poster={video.replace(/\.mp4$/i, '.webp')} aria-label={(video.split('/').pop() || 'Project video').replace(/\.[^.]+$/, '').replace(/-/g, ' ')} className="w-full aspect-video object-contain bg-black">
                                <source src={video} type="video/mp4" />Your browser does not support video. <a href={video}>Open video</a>.
                            </DeferredVideo>
                            <figcaption className="px-4 py-3 text-center text-sm text-gray-300 capitalize">{(video.split('/').pop() || 'Project video').replace(/\.[^.]+$/, '').replace(/-/g, ' ')}</figcaption>
                        </figure>)}</div>
                    </div>
                </section>}
                {chapters.map((chapter, index) => <PortfolioMotion key={`${index}-${chapter.title}`}>
                    <section id={`mapping-section-${index}`} aria-labelledby={`mapping-heading-${index}`} className={`${shell} scroll-mt-24`}>
                        <div className={border} />
                        <div className="relative p-6 sm:p-8">
                            <h2 id={`mapping-heading-${index}`} className="text-2xl sm:text-3xl font-bold text-blue-400 mb-6">{chapter.title}</h2>
                            <div className={hasOverviewVideo && index === 0 ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start' : chapter.photos.length && (!landscapeMaps || fieldAssessment) ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-start' : 'space-y-6'}>
                                <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-300 prose-strong:text-white prose-li:text-gray-300">
                                    <ReactMarkdown components={{
                                        ul: ({ children }) => <ul className="!list-none !p-0 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:[&>li:last-child:nth-child(odd)]:col-span-2">{children}</ul>,
                                        ol: ({ children }) => <ol className="!list-none !p-0 grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</ol>,
                                        li: ({ children }) => <li className="!m-0 rounded-xl border border-blue-400/15 bg-blue-500/5 !p-4 text-sm [&_strong]:block [&_strong]:mb-1 [&_strong]:text-blue-200">{children}</li>,
                                    }}>{chapter.body}</ReactMarkdown>
                                </div>
                                {hasOverviewVideo && index === 0 && <div id="mapping-videos" className="scroll-mt-24 overflow-hidden rounded-xl border border-blue-500/20 bg-black/30">
                                    <h3 className="px-4 py-3 text-sm font-semibold text-blue-200">Project video</h3>
                                    {videos.map(video => <DeferredVideo key={video} controls playsInline preload="none" pauseOthersOnPlay poster={video.replace(/\.mp4$/i, '.webp')} aria-label={(video.split('/').pop() || 'Project video').replace(/\.[^.]+$/, '').replace(/-/g, ' ')} className="w-full aspect-video object-contain bg-black">
                                        <source src={video} type="video/mp4" />Your browser does not support video. <a href={video}>Open video</a>.
                                    </DeferredVideo>)}
                                </div>}
                                {chapter.photos.length > 0 && <div className="space-y-6">{chapter.photos.map(photo => <figure key={photo.src} className={`overflow-hidden rounded-xl border border-blue-500/15 ${fieldAssessment ? 'bg-black/20' : 'bg-white'}`}>
                                    <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`View full ${fieldAssessment ? 'image' : 'map'}: ${photo.alt}`}>
                                        <Image src={photo.src} alt={photo.alt} width={landscapeMaps ? 2200 : 1414} height={landscapeMaps ? 1555 : 2000} sizes={landscapeMaps && !fieldAssessment ? '(min-width: 1152px) 1056px, calc(100vw - 84px)' : '(min-width: 1152px) 520px, (min-width: 1024px) calc(50vw - 56px), calc(100vw - 84px)'} className="w-full h-auto max-h-[680px] object-contain" />
                                    </a>
                                </figure>)}</div>}
                            </div>
                        </div>
                    </section>
                </PortfolioMotion>)}
            </article>
        </main>
    </>;
}
