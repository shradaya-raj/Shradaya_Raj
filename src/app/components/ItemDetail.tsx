import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Item } from '@/lib/types';
import { formatDate } from '@/lib/dateFormatter';
import Navigation from '@/components/Navigation';

interface ItemDetailProps {
    item: Item;
}

export default function ItemDetail({ item }: ItemDetailProps) {
    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-black text-white pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="mb-12">
                        {item.featured && (
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
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

                    {item.images && item.images.length > 0 && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-12 ring-1 ring-white/10">
                            <Image
                                src={item.images[0].startsWith('/')
                                    ? item.images[0]
                                    : `/images/${item.category}/${item.slug}/${item.images[0]}`}
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

                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                                <h3 className="text-lg font-semibold mb-2 text-blue-400">Attachments</h3>
                                <p className="text-sm text-gray-400 mb-4">Original document is available for reference.</p>
                                {item.images.map((img) => (
                                    <a
                                        key={img}
                                        href={img.startsWith('/') ? img : `/images/${item.category}/${item.slug}/${img}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm text-blue-300 truncate"
                                    >
                                        📄 {img.split('/').pop()}
                                    </a>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </main >
        </>
    );
}
