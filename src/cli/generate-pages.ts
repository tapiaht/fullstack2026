
import * as fs from 'fs';
import * as path from 'path';
import { domainConfig } from '../config/domain.config';

function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function generateDashboardPage() {
    const entityName = domainConfig.entity.name;
    const entityNameLower = entityName.toLowerCase();

    // We need to know the Prisma model name. Usually it matches entity name or lowercase.
    // Assuming lowercase for the prisma client property based on previous convention.
    const prismaModel = entityNameLower;

    const content = `
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { EntityGrid } from "@/components/core/entity-grid";
import { domainConfig } from "@/config/domain.config";
import { deleteEntity } from "@/core/actions";

export default async function DashboardPage() {
  // @ts-ignore - Dynamic access to prisma model
  const entities = await prisma.${prismaModel}.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{domainConfig.app.name} Dashboard</h1>
        <Link href={\`/dashboard/add-\${domainConfig.entity.name.toLowerCase()}\`}>
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
`;
    return content;
}

function generateAddPage() {
    const content = `
'use client';

import { createEntity } from '@/core/actions';
import { EntityForm } from '@/components/core';
import { domainConfig } from '@/config/domain.config';

export default function AddEntityPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <EntityForm 
        config={domainConfig.entity}
        action={createEntity}
        mode="create"
      />
    </div>
  );
}
`;
    return content;
}

function generateEditPage() {
    const entityName = domainConfig.entity.name;
    const entityNameLower = entityName.toLowerCase();
    const prismaModel = entityNameLower;

    const content = `
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { updateEntity } from '@/core/actions';
import { EntityForm } from '@/components/core';
import { domainConfig } from '@/config/domain.config';

export default async function EditEntityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // @ts-ignore - Dynamic access to prisma model
    const entity = await prisma.${prismaModel}.findUnique({
        where: { id },
    });

    if (!entity) {
        notFound();
    }

    const updateAction = updateEntity.bind(null, id);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <EntityForm 
              config={domainConfig.entity}
              action={updateAction}
              initialData={entity}
              mode="edit"
            />
        </div>
    );
}
`;
    return content;
}

export function generatePages() {
    const entityNameLower = domainConfig.entity.name.toLowerCase();
    const baseDir = path.join(process.cwd(), 'src/app/dashboard');

    // 1. Generate Dashboard Page
    const dashboardPath = path.join(baseDir, 'page.tsx');
    fs.writeFileSync(dashboardPath, generateDashboardPage());
    console.log(`✅ Generated ${dashboardPath}`);

    // 2. Generate Add Page
    const addPageDir = path.join(baseDir, `add-${entityNameLower}`);
    ensureDirectoryExistence(path.join(addPageDir, 'page.tsx'));
    fs.writeFileSync(path.join(addPageDir, 'page.tsx'), generateAddPage());
    console.log(`✅ Generated ${path.join(addPageDir, 'page.tsx')}`);

    // 3. Generate Edit Page
    const editPageDir = path.join(baseDir, `edit-${entityNameLower}`, '[id]');
    ensureDirectoryExistence(path.join(editPageDir, 'page.tsx'));
    fs.writeFileSync(path.join(editPageDir, 'page.tsx'), generateEditPage());
    console.log(`✅ Generated ${path.join(editPageDir, 'page.tsx')}`);
}

// Execute if run directly
if (require.main === module) {
    generatePages();
}
