'use server';

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Role, Belt, Project } from "@prisma/client";

export async function createStudent(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const rawBirthDate = formData.get('birthDate') as string;
    const rawStartDate = formData.get('startDate') as string;

    const hashedPassword = await hash(password || '123456', 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: (formData.get('role') as Role) || Role.STUDENT,
            birthDate: rawBirthDate ? new Date(rawBirthDate) : null,
            weight: parseFloat(formData.get('weight') as string) || null,
            phone: formData.get('phone') as string,
            emergencyPhone: formData.get('emergencyPhone') as string,
            responsibleName: formData.get('responsibleName') as string,
            belt: (formData.get('belt') as Belt) || Belt.WHITE,
            beltDegree: parseInt(formData.get('beltDegree') as string) || 0,
            project: (formData.get('project') as Project) || undefined,
            startDate: rawStartDate ? new Date(rawStartDate) : new Date(),
            history: formData.get('history') as string,
            status: true,
        }
    });

    revalidatePath('/students');
    redirect('/students');
}

export async function updateStudent(id: number, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const rawBirthDate = formData.get('birthDate') as string;
    const rawStartDate = formData.get('startDate') as string;

    const data: any = {
        name,
        email,
        role: (formData.get('role') as Role),
        birthDate: rawBirthDate ? new Date(rawBirthDate) : null,
        weight: parseFloat(formData.get('weight') as string) || null,
        phone: formData.get('phone') as string,
        emergencyPhone: formData.get('emergencyPhone') as string,
        responsibleName: formData.get('responsibleName') as string,
        belt: (formData.get('belt') as Belt),
        beltDegree: parseInt(formData.get('beltDegree') as string) || 0,
        project: (formData.get('project') as Project) || undefined,
        startDate: rawStartDate ? new Date(rawStartDate) : undefined,
        history: formData.get('history') as string,
        // status: true, // Typically we don't reset status on edit unless specified
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
        data.password = await hash(password, 10);
    }

    await prisma.user.update({
        where: { id },
        data
    });

    revalidatePath('/students');
    revalidatePath(`/students/${id}`);
    redirect('/students');
}

export async function deleteStudent(id: number) {
    await prisma.user.delete({
        where: { id }
    });

    revalidatePath('/students');
    redirect('/students');
}
