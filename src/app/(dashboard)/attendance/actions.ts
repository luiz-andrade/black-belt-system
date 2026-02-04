'use server';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkIn(formData: FormData) {
    const userId = parseInt(formData.get('userId') as string);
    const dateStr = formData.get('date') as string;

    let targetDate = new Date();
    if (dateStr) {
        targetDate = new Date(dateStr);
    }

    // Set check-in time to current time if today, otherwise to 19:30 default or just keep the date
    // If it's a back-dated checkin, keep the time of the targetDate (which comes from startOfDay usually in the parent but passed as ISO) or set a default class time.
    // The previous implementation used "today" as the check boundary.

    // We want to save the record for that specific day.
    // Let's ensure the time is set to a reasonable "class time" if it's purely a date string without time context, 
    // or just use "now" time if it is today, or 12:00 if past.
    // Actually, simply using the passed ISO string (which likely has local time or midnight) is fine, 
    // but better to set it to a fixed "class" time if it's not "now", just for consistency? 
    // Let's just use the current time component for the target date if possible, or leave as is.
    // The simplest robust way: use the date provided. If strictly equal to midnight (start of day), maybe add 19h.

    // However, the prisma query needs to check if ALREADY exists *on that day*.
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await prisma.attendance.findFirst({
        where: {
            userId,
            date: {
                gte: dayStart,
                lte: dayEnd
            }
        }
    });

    if (!existing) {
        // If backdating, set time to 19:30 by default if it's exactly midnight (00:00:00) which usually happens when just a date is picked.
        // If it's today, we might want current time.
        // But the input from CheckIn component is `date.toISOString()` where date was `parseISO(param)` or `new Date()`.
        // If it comes from params, it's parsed as local midnight usually.

        const isMidnight = targetDate.getHours() === 0 && targetDate.getMinutes() === 0;
        if (isMidnight) {
            targetDate.setHours(19, 30, 0, 0); // Default class time
        } else if (Math.abs(new Date().getTime() - targetDate.getTime()) < 24 * 60 * 60 * 1000) {
            // It's close to now (today), so maybe use current time?
            // If the user selected "Today" in filter, `date` prop is `new Date()` (with time).
            // If the user selected a date string `2023-01-01`, `parseISO` makes it midnight.
            // So the logic holds: if midnight, set to 19:30. If has time (today), keep it.
        }

        await prisma.attendance.create({
            data: {
                userId,
                date: targetDate
            }
        });
        revalidatePath('/attendance');
    }
}

export async function removeCheckIn(formData: FormData) {
    const attendanceId = parseInt(formData.get('id') as string);
    await prisma.attendance.delete({ where: { id: attendanceId } });
    revalidatePath('/attendance');
}
