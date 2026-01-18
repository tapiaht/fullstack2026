'use client';

import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id, onDelete }: { id: string, onDelete: (id: string) => Promise<any> }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this item?')) {
            startTransition(async () => {
                const result = await onDelete(id);
                if (result.error) {
                    alert(result.error);
                }
            });
        }
    };

    return (
        <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}
