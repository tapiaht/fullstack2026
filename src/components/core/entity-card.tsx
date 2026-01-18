import Link from "next/link";
import Image from "next/image";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/delete-button";
import { EntityConfig } from "@/config/domain.config";

interface EntityCardProps {
    data: any;
    config: EntityConfig;
    onDelete?: (id: string) => Promise<any>;
    allowEdit?: boolean;
}

export function EntityCard({ data, config, onDelete, allowEdit }: EntityCardProps) {
    const displayValue = data[config.displayField || 'name'];
    const imageUrl = config.imageField ? data[config.imageField] : null;

    // Find fields to display (excluding ID, image, and display field)
    const fieldsToDisplay = config.fields.filter(field =>
        field.name !== 'id' &&
        field.name !== config.imageField &&
        field.name !== config.displayField &&
        field.type !== 'array' &&
        field.type !== 'json' &&
        !field.name.endsWith('At') // Skip timestamps by default
    ).slice(0, 3); // Show max 3 fields

    const editRoute = `/dashboard/edit-${config.name.toLowerCase()}/${data.id}`;

    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 flex flex-col h-full">
            {imageUrl && (
                <div className="relative aspect-[3/4] mb-4 w-full">
                    <Image
                        src={imageUrl}
                        alt={displayValue || 'Entity image'}
                        fill
                        className="rounded-md object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            )}

            <h2 className="text-xl font-semibold text-center mb-2">{displayValue}</h2>

            <div className="flex-grow">
                <p className="text-sm text-gray-500 text-center mb-4 uppercase">
                    {fieldsToDisplay.map((field, index) => (
                        <span key={field.name}>
                            {index > 0 && ' - '}
                            {data[field.name]}
                        </span>
                    ))}
                </p>
            </div>

            <div className="flex justify-center space-x-2 mt-auto pt-4">
                {allowEdit && (
                    <Link href={editRoute}>
                        <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                )}
                {onDelete && <DeleteButton id={data.id} onDelete={onDelete} />}
            </div>
        </div>
    );
}
