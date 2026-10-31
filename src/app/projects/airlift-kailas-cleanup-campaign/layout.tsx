import { itemMetadata } from '@/lib/metadata'

export async function generateMetadata() { return itemMetadata('projects', 'airlift-kailas-cleanup-campaign') }
export default function ProjectLayout({ children }: { children: React.ReactNode }) { return children }
