export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Calendar } from "lucide-react";
import { ProjectFilter } from "./project-filter";
import { Project } from "@prisma/client";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Dashboard({ searchParams }: PageProps) {
    const session = await getServerSession(authOptions);
    const params = await searchParams;
    const projectFilter = typeof params.project === 'string' ? params.project as Project : undefined;

    // Validate if the project filter is a valid enum value to avoid errors
    const isValidProject = projectFilter && Object.values(Project).includes(projectFilter);
    const whereClause = {
        role: 'STUDENT' as const,
        ...(isValidProject ? { project: projectFilter } : {})
    };

    const studentCount = await prisma.user.count({ where: whereClause });

    const activeStudents = await prisma.user.count({
        where: {
            ...whereClause,
            status: true
        }
    });

    return (
        <div>
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Visão geral do sistema.</p>
                </div>
                <ProjectFilter />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-card to-zinc-900 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total de Alunos</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">{studentCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isValidProject ? `No projeto ${projectFilter}` : 'Cadastrados no sistema'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Alunos Ativos</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-green-500">{activeStudents}</div>
                        <p className="text-xs text-muted-foreground mt-1">Em dia com o treino</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Próximo Treino</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">Hoje, 19:30</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {isValidProject ? projectFilter : 'K5'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
