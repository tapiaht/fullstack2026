'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { EntityConfig, FieldDefinition } from '@/config/domain.config';

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Processing...' : label}
        </Button>
    );
}

interface EntityFormProps {
    config: EntityConfig;
    action: (state: any, payload: FormData) => Promise<any>;
    initialData?: any;
    mode: 'create' | 'edit';
}

export function EntityForm({ config, action, initialData, mode }: EntityFormProps) {
    const [state, formAction] = useActionState(action, { errors: {} });
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            alert(`${config.name} ${mode === 'create' ? 'created' : 'updated'} successfully!`);
            if (mode === 'create') {
                formRef.current?.reset();
            }
        }
    }, [state, config.name, mode]);

    const editableFields = config.fields.filter(field =>
        !field.prismaType?.includes('@id') &&
        !field.prismaType?.includes('@updatedAt') &&
        !field.prismaType?.includes('@default(now())') &&
        field.name !== 'createdAt' &&
        field.name !== 'updatedAt' &&
        field.name !== 'id'
    );

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{mode === 'create' ? `Add New ${config.name}` : `Edit ${config.name}`}</CardTitle>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-6">
                    {editableFields.map((field) => (
                        <div key={field.name}>
                            <Label htmlFor={field.name} className="capitalize">{field.name}</Label>
                            {field.type === 'image' ? (
                                <div className="space-y-2">
                                    {initialData?.[field.name] && (
                                        <div className="relative w-full h-40 mb-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={initialData[field.name]}
                                                alt="Current"
                                                className="w-full h-full object-contain rounded-md border bg-slate-50"
                                            />
                                        </div>
                                    )}
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="file"
                                        accept="image/png, image/jpeg, image/webp, image/gif"
                                    // File inputs cannot be controlled with a value/defaultValue string
                                    />
                                </div>
                            ) : field.type === 'text' ? (
                                <Textarea
                                    id={field.name}
                                    name={field.name}
                                    defaultValue={initialData ? initialData[field.name] : field.defaultValue}
                                    className="min-h-[120px]"
                                />
                            ) : (
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type === 'number' ? 'number' : 'text'}
                                    defaultValue={initialData ? initialData[field.name] : field.defaultValue}
                                />
                            )}
                            {state.errors?.[field.name] && <p className="text-red-500 text-sm mt-1">{state.errors[field.name][0]}</p>}
                        </div>
                    ))}
                    <SubmitButton label={mode === 'create' ? `Add ${config.name}` : `Update ${config.name}`} />
                    {state.errors?._form && <p className="text-red-500 text-sm mt-1">{state.errors._form[0]}</p>}
                </form>
            </CardContent>
        </Card>
    );
}
