'use server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return;

    const phone = formData.get('phone') as string;
    const emergencyPhone = formData.get('emergencyPhone') as string;
    const weight = parseFloat(formData.get('weight') as string);

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            phone,
            emergencyPhone,
            weight: weight || undefined,
        }
    });

    revalidatePath('/profile');
}
