
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
