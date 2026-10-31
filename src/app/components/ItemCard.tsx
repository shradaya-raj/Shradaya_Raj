import Image from 'next/image';
import Link from 'next/link';
import PortfolioMotion from '@/components/PortfolioMotion';

interface ItemCardProps {
    slug: string;
    title: string;
    description: string;
    image?: string;
    tags?: string[];
    featured?: boolean;
    category: 'projects' | 'achievements' | 'eca';
}

export default function ItemCard({ slug, title, description, image, tags = [], featured = false, category }: ItemCardProps) {
    const href = `/${category}/${slug}`;
    return (
        <PortfolioMotion>
        <Link href={href} className="portfolio-card group block h-full bg-gray-900 rounded-xl overflow-hidden shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400">
            {image && (
                <div className="relative aspect-[4/3] bg-gray-800 overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
                        className="portfolio-card-image object-cover"
                    />
                    {featured && (
                        <div className="absolute top-2 left-2 bg-green-500/80 text-xs font-bold px-2 py-1 rounded">Featured</div>
                    )}
                </div>
            )}
            {!image && featured && (
                <div className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 inline-block m-4 rounded uppercase tracking-tighter">Featured</div>
            )}
            <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-3">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="portfolio-tag px-2.5 py-1 rounded-md text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
        </PortfolioMotion>
    );
}
