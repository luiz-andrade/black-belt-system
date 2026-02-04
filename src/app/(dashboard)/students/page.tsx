export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StudentSearch, SortableHeader } from "./student-client";

const BELT_TRANSLATIONS: Record<string, string> = {
    WHITE: 'Branca',
    GREY: 'Cinza',
    YELLOW: 'Amarela',
    ORANGE: 'Laranja',
    GREEN: 'Verde',
    BLUE: 'Azul',
    PURPLE: 'Roxa',
    BROWN: 'Marrom',
    BLACK: 'Preta'
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const q = typeof params.q === 'string' ? params.q : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : 'name';
    const order = typeof params.order === 'string' ? params.order : 'asc';

    const students = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            ...(q ? {
                OR: [
                    { name: { contains: q } },
                    { email: { contains: q } }
                ]
            } : {})
        },
        orderBy: {
            [sort]: order
        }
    });

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
                    <p className="text-muted-foreground">Gerencie os alunos do projeto.</p>
                </div>
                <Button asChild>
                    <Link href="/students/new">
                        <Plus className="mr-2 h-4 w-4" /> Novo Aluno
                    </Link>
                </Button>
            </div>

            <div className="mb-6">
                <StudentSearch />
            </div>

            <div className="rounded-md border bg-card">
                {/* Mobile View: Cards */}
                <div className="md:hidden divide-y divide-border">
                    {students.map(student => (
                        <div key={student.id} className="p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg">{student.name}</p>
                                    <p className="text-sm text-muted-foreground">{student.project} • {student.weight || '-'}kg</p>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${student.status ? "bg-green-500" : "bg-red-500"}`} />
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                {student.belt && (
                                    <span className={`belt-badge belt-${student.belt.toLowerCase()}`}>
                                        {BELT_TRANSLATIONS[student.belt] || student.belt} {student.beltDegree}º
                                    </span>
                                )}
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/students/${student.id}`}>Editar</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                    {students.length === 0 && <p className="p-4 text-center text-muted-foreground">Nenhum aluno encontrado.</p>}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">
                                    <SortableHeader column="name" label="Nome" />
                                </th>
                                <th className="px-6 py-3">
                                    <SortableHeader column="belt" label="Faixa" />
                                </th>
                                <th className="px-6 py-3 text-center">
                                    <SortableHeader column="beltDegree" label="Grau" className="justify-center w-full" />
                                </th>
                                <th className="px-6 py-3 text-center">
                                    <SortableHeader column="weight" label="Peso (kg)" className="justify-center w-full" />
                                </th>
                                <th className="px-6 py-3 text-center">
                                    <SortableHeader column="project" label="Projeto" className="justify-center w-full" />
                                </th>
                                <th className="px-6 py-3 text-center">
                                    <SortableHeader column="status" label="Status" className="justify-center w-full" />
                                </th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map(student => (
                                <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{student.name}</td>
                                    <td className="px-6 py-4">
                                        {student.belt && (
                                            <span className={`belt-badge belt-${student.belt.toLowerCase()} inline-block min-w-[80px] text-center`}>
                                                {BELT_TRANSLATIONS[student.belt] || student.belt}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center font-mono">{student.beltDegree}</td>
                                    <td className="px-6 py-4 text-center">{student.weight || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 rounded bg-secondary text-xs font-medium">
                                            {student.project || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`w-2.5 h-2.5 rounded-full mx-auto ${student.status ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500"}`} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/students/${student.id}`} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                                            Editar
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
