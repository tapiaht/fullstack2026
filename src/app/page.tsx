import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignOutButton } from '@/components/sign-out-button';
import { UserCircle } from 'lucide-react';
import { domainConfig } from '@/config/domain.config';
import { EntityGrid } from '@/components/core/entity-grid';

export default async function Home() {
  const headersList = await headers();
  const header_obj: { [key: string]: string } = {};
  for (const [key, value] of headersList.entries()) {
    header_obj[key] = value;
  }
  const session = await auth.api.getSession({ headers: header_obj });
  const user = session?.user;

  // Dynamic entity access
  const modelName = domainConfig.entity.name.toLowerCase();
  // @ts-ignore
  const entities = await prisma[modelName].findMany();

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">{domainConfig.app.name}</h1>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <UserCircle className="h-6 w-6" />
              <p>Welcome, {user.email}!</p>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <SignOutButton />
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <EntityGrid
        data={entities}
        config={domainConfig.entity}
      // No delete action on public home page
      />
    </div>
  );
}
