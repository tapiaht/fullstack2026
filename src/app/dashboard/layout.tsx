import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const header_obj: { [key: string]: string } = {};
  for (const [key, value] of (await headersList).entries()) {
    header_obj[key] = value;
  }
  const session = await auth.api.getSession({ headers: header_obj });

  if (!session) {
    redirect('/login');
  }

  return <>{children}</>;
}
