
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { updateEntity } from '@/core/actions';
import { EntityForm } from '@/components/core';
import { domainConfig } from '@/config/domain.config';

export default async function EditEntityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // @ts-ignore - Dynamic access to prisma model
    const entity = await prisma.post.findUnique({
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
