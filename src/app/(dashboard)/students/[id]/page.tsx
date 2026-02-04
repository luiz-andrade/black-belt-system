import { prisma } from "@/lib/prisma";
import EditStudentForm from "./edit-form";
import { notFound } from "next/navigation";
import StudentAttendanceHistory from "./attendance-history";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: PageProps) {
    const { id: idString } = await params;
    const id = parseInt(idString);

    if (isNaN(id)) {
        notFound();
    }

    const student = await prisma.user.findUnique({
        where: { id: id },
        include: {
            attendance: {
                orderBy: { date: 'desc' }
            }
        }
    });

    if (!student) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Editar Aluno</h1>
                <p className="text-muted-foreground">Atualize os dados do aluno ou professor.</p>
            </div>

            <EditStudentForm student={student} />

            <StudentAttendanceHistory attendance={student.attendance} />
        </div>
    );
}
