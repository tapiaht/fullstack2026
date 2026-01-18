
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { EntityGrid } from "@/components/core/entity-grid";
import { domainConfig } from "@/config/domain.config";
import { deleteEntity } from "@/core/actions";

export default async function DashboardPage() {
  // @ts-ignore - Dynamic access to prisma model
  const entities = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{domainConfig.app.name} Dashboard</h1>
        <Link href={`/dashboard/add-${domainConfig.entity.name.toLowerCase()}`}>
          <Button>Add New {domainConfig.entity.name}</Button>
        </Link>
      </div>
      
      <EntityGrid
        data={entities}
        config={domainConfig.entity}
        onDelete={deleteEntity}
      />
    </div>
  );
}
