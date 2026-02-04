'use client';

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";

export function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default to today if no param, or parse the param
    const paramDate = searchParams.get('date');
    // We add 'T00:00:00' to ensure local time interpretation if just yyyy-mm-dd passed,
    // though new Date(yyyy-mm-dd) usually works as UTC, which might be off for local display.
    // Better to just handle it simple.
    const date = paramDate ? new Date(paramDate + 'T12:00:00') : new Date();

    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (paramDate) {
            setSelectedDate(new Date(paramDate + 'T12:00:00'));
        } else {
            setSelectedDate(new Date());
        }
    }, [paramDate])

    const handleSelect = (newDate: Date | undefined) => {
        setSelectedDate(newDate);
        setOpen(false);
        if (newDate) {
            router.push(`/attendance?date=${format(newDate, 'yyyy-MM-dd')}`);
        } else {
            router.push('/attendance');
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full md:w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleSelect}
                    initialFocus
                    locale={ptBR}
                />
            </PopoverContent>
        </Popover>
    );
}
