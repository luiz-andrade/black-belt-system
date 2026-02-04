'use client';
import { useState } from 'react';
import { checkIn } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Search, CheckCircle2 } from "lucide-react";


export default function CheckIn({
    students,
    presentUserIds,
    date,
    dateDisplay
}: {
    students: any[],
    presentUserIds: number[],
    date: string,
    dateDisplay: string
}) {
    const [search, setSearch] = useState('');

    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Card className="h-full flex flex-col border-border">
            <CardHeader className="shrink-0">
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Registrar Presença
                </CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                    {dateDisplay}
                </p>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 overflow-hidden p-4 md:p-6">
                <div className="relative mb-4 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-10 h-10 md:h-11"
                        placeholder="Buscar aluno por nome..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filtered.map(s => {
                        const isPresent = presentUserIds.includes(s.id);

                        return (
                            <div key={s.id} className="flex justify-between items-center p-3 md:p-4 hover:bg-muted/50 rounded-lg border border-border transition-colors gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className={`w-3 h-3 md:w-4 md:h-4 shrink-0 rounded-full belt-bg-${s.belt?.toLowerCase()} ring-1 ring-white/20`}></div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold text-base md:text-lg leading-tight truncate">{s.name}</span>
                                        <span className="text-xs md:text-sm text-muted-foreground truncate">{s.project}</span>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    {isPresent ? (
                                        <span className="text-green-500 text-xs font-bold px-2 md:px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 whitespace-nowrap inline-block">
                                            Confirmado
                                        </span>
                                    ) : (
                                        <form action={checkIn}>
                                            <input type="hidden" name="userId" value={s.id} />
                                            <input type="hidden" name="date" value={date} />
                                            <Button size="sm" type="submit" variant="secondary" className="h-8 md:h-9 text-xs px-3 md:px-4">
                                                Confirmar
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )
                    })}

                    {filtered.length === 0 && <p className="text-muted-foreground text-center py-8 text-sm">Nenhum aluno encontrado.</p>}
                </div>
            </CardContent>
        </Card>
    )
}
