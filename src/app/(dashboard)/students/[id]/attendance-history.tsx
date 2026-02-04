'use client';

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ptBR } from "date-fns/locale";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function StudentAttendanceHistory({ attendance }: { attendance: { date: Date | string }[] }) {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

    const allDates = React.useMemo(() =>
        attendance.map(a => new Date(a.date)),
        [attendance]);

    const filteredDates = React.useMemo(() => {
        if (!dateRange?.from) return allDates;

        const start = startOfDay(dateRange.from);
        const end = endOfDay(dateRange.to || dateRange.from);

        return allDates.filter(d => isWithinInterval(d, { start, end }));
    }, [allDates, dateRange]);

    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Histórico de Presença</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Carregando calendário...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-8">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>Histórico de Presença</CardTitle>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] justify-start text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "dd/MM/y", { locale: ptBR })} -{" "}
                                            {format(dateRange.to, "dd/MM/y", { locale: ptBR })}
                                        </>
                                    ) : (
                                        format(dateRange.from, "dd/MM/y", { locale: ptBR })
                                    )
                                ) : (
                                    <span>Filtrar por data</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                locale={ptBR}
                            />
                        </PopoverContent>
                    </Popover>
                    {dateRange && (
                        <Button
                            variant="ghost"
                            onClick={() => setDateRange(undefined)}
                            className="text-xs h-8"
                        >
                            Limpar
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
                <div>
                    <Calendar
                        mode="multiple"
                        selected={allDates} // Always show all dots/selections on the main view? Or should we only show filtered? 
                        // The user request is "mostrar quantidade de dias". Visualizing the filter on the calendar might be confusing if we hide the others.
                        // However, highlighting the range might be nice. 
                        // But since 'selected' in mode='multiple' expects an array of dates to highlight, let's keep showing ALL history visually, 
                        // as the filter is primarily for the COUNT stats.
                        locale={ptBR}
                        className="rounded-md border pointer-events-none opacity-80"
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        * O calendário exibe todo o histórico.
                    </p>
                </div>
                <div className="flex-1">
                    <h4 className="font-medium mb-4">Resumo {dateRange ? "(Filtrado)" : "(Total)"}</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg text-center border border-border">
                            <span className="text-3xl font-bold block text-primary">{filteredDates.length}</span>
                            <span className="text-sm text-muted-foreground">Presenças no Período</span>
                        </div>
                        <div className="bg-muted p-4 rounded-lg text-center border border-border">
                            <span className="text-3xl font-bold block">
                                {filteredDates.length > 0
                                    ? format(new Date(Math.max(...filteredDates.map(d => d.getTime()))), "d MMM", { locale: ptBR })
                                    : "-"
                                }
                            </span>
                            <span className="text-sm text-muted-foreground">Último Treino (Período)</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
