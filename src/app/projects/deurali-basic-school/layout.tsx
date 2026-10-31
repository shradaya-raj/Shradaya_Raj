import { itemMetadata } from '@/lib/metadata'

export async function generateMetadata() { return itemMetadata('projects', 'deurali-basic-school') }
export default function ProjectLayout({ children }: { children: React.ReactNode }) { return children }
