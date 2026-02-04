export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import CheckIn from "./check-in";
import { format, endOfDay, startOfDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { removeCheckIn } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateFilter } from "./date-filter";
import { DownloadAttendanceBtn } from "./download-button";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AttendancePage({ searchParams }: PageProps) {
    const params = await searchParams;
    const dateParam = typeof params.date === 'string' ? params.date : undefined;

    // Default to today if no date provided
    const currentDate = dateParam ? parseISO(dateParam) : new Date();

    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);

    const attendance = await prisma.attendance.findMany({
        where: {
            date: {
                gte: dayStart,
                lte: dayEnd,
            }
        },
        include: { user: true },
        orderBy: { date: 'desc' }
    });

    const students = await prisma.user.findMany({
        where: { role: 'STUDENT', status: true },
        orderBy: { name: 'asc' }
    });

    const presentIds = attendance.map(a => a.userId);
    const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-8rem)] lg:min-h-[600px]">
            <div className="flex flex-col gap-6 h-[500px] lg:h-full overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Frequência</h1>
                        <p className="text-sm text-muted-foreground capitalize flex items-center gap-2 mt-1">
                            Use o filtro para ver histórico.
                        </p>
                    </div>
                    <DateFilter />
                </div>

                <div className="flex-1 overflow-hidden min-h-0">
                    <CheckIn
                        students={students}
                        presentUserIds={presentIds}
                        date={currentDate.toISOString()}
                        dateDisplay={format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                    />
                </div>
            </div>

            <div className="h-[400px] lg:h-full overflow-hidden">
                <Card className="h-full flex flex-col border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
                        <div className="space-y-1">
                            <CardTitle className="text-base md:text-lg font-bold">Alunos Presentes</CardTitle>
                            <p className="text-xs text-muted-foreground capitalize">
                                {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs md:text-sm px-2 md:px-3">{attendance.length}</Badge>
                            <DownloadAttendanceBtn
                                date={currentDate.toISOString()}
                                attendance={JSON.parse(JSON.stringify(attendance))}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto divide-y divide-border custom-scrollbar pr-2">
                        {attendance.map(record => (
                            <div key={record.id} className="py-3 md:py-4 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-border">
                                        <AvatarFallback className="text-xs font-bold uppercase bg-muted">
                                            {record.user.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-base md:text-lg leading-tight truncate">{record.user.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Check-in às {format(record.date, "HH:mm")}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center justify-end ml-4">
                                    <form action={removeCheckIn}>
                                        <input type="hidden" name="id" value={record.id} />
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ))}
                        {attendance.length === 0 && (
                            <div className="text-center py-16 flex flex-col items-center justify-center text-muted-foreground h-full">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                                    <span className="text-2xl opacity-50">📋</span>
                                </div>
                                <p className="text-sm">Nenhuma presença registrada neste dia.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
