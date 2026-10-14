import PageEditor from '@/components/PageEditor';

export default async function AdminPageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return <PageEditor page={page} />;
}
