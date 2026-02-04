'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function ProjectFilter() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentProject = searchParams.get('project') || 'ALL';

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value && value !== 'ALL') {
            params.set('project', value);
        } else {
            params.delete('project');
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="w-[180px]">
            <Select value={currentProject} onValueChange={handleValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por projeto" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Todos os Projetos</SelectItem>
                    <SelectItem value="K5">K5</SelectItem>
                    <SelectItem value="BNH">BNH</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
