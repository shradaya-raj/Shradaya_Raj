import Image from 'next/image';
import Link from 'next/link';

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
        <Link href={href} className="group block bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
            {image && (
                <div className="relative aspect-[4/3] bg-gray-800">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {featured && (
                        <div className="absolute top-2 left-2 bg-green-500/80 text-xs font-bold px-2 py-1 rounded">Featured</div>
                    )}
                </div>
            )}
            {!image && featured && (
                <div className="bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 inline-block m-4 rounded uppercase tracking-tighter">Featured</div>
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">{title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2 mb-3">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
