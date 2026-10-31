export const metadata = { robots: { index: false, follow: false } };
import AdminNavigation from '@/components/AdminNavigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><AdminNavigation /><div id="main-content" tabIndex={-1} className="pt-16">{children}</div></>;
}
