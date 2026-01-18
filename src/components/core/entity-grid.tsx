import { EntityConfig } from "@/config/domain.config";
import { EntityCard } from "./entity-card";

interface EntityGridProps {
    data: any[];
    config: EntityConfig;
    emptyMessage?: string;
    onDelete?: (id: string) => Promise<any>;
    allowEdit?: boolean;
}

export function EntityGrid({ data, config, emptyMessage, onDelete, allowEdit }: EntityGridProps) {
    if (data.length === 0) {
        return (
            <p className="text-center text-gray-500 mt-20">
                {emptyMessage || `No ${config.namePlural.toLowerCase()} found. Add your first one!`}
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((item) => (
                <EntityCard
                    key={item.id}
                    data={item}
                    config={config}
                    onDelete={onDelete}
                    allowEdit={allowEdit}
                />
            ))}
        </div>
    );
}
