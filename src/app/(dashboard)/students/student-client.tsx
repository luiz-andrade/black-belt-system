'use client';

import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function StudentSearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    // Initialize from URL but manage local state for input
    const [term, setTerm] = useState(searchParams.get('q')?.toString() || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const currentQuery = params.get('q') || '';

            // Only update if changed
            if (term !== currentQuery) {
                if (term) {
                    params.set('q', term);
                } else {
                    params.delete('q');
                }
                replace(`${pathname}?${params.toString()}`);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [term, replace, pathname, searchParams]);

    return (
        <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Buscar por nome..."
                className="w-full pl-9"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
        </div>
    );
}

export function SortableHeader({
    column,
    label,
    className = ""
}: {
    column: string,
    label: string,
    className?: string
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const currentSort = searchParams.get('sort');
    const currentOrder = searchParams.get('order');

    const isSorted = currentSort === column;
    const isAsc = currentOrder === 'asc';

    const handleClick = () => {
        const params = new URLSearchParams(searchParams);

        if (isSorted) {
            // Toggle order
            params.set('order', isAsc ? 'desc' : 'asc');
        } else {
            // New sort
            params.set('sort', column);
            params.set('order', 'asc');
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Button
            variant="ghost"
            onClick={handleClick}
            className={`h-8 text-xs font-semibold uppercase hover:bg-transparent px-0 ${className} ${isSorted ? 'text-primary' : 'text-muted-foreground'}`}
        >
            {label}
            {isSorted ? (
                isAsc ? <ArrowUp className="ml-2 h-3 w-3" /> : <ArrowDown className="ml-2 h-3 w-3" />
            ) : (
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
            )}
        </Button>
    );
}
