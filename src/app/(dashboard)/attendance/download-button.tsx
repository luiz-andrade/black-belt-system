'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Student {
    name: string;
    project: string | null;
    belt: string | null;
}

interface AttendanceRecord {
    id: number;
    date: Date | string;
    user: Student;
}

interface DownloadAttendanceBtnProps {
    date: string; // ISO String
    attendance: AttendanceRecord[];
}

export function DownloadAttendanceBtn({ date, attendance }: DownloadAttendanceBtnProps) {
    const handleDownload = async () => {
        const doc = new jsPDF();

        // Fix timezone issue by treating the date string as local date parts if possible, or just add timezone offset
        // The 'date' prop comes as ISO string (e.g., 2026-02-02T00:00:00.000Z) from the server.
        // new Date(date) converts this UTC midnight to local timezone previous day evening (e.g., Feb 1st 20:00)

        // We want to display the date as it is represented in the ISO string (the "server day"), regardless of browser timezone.
        // Since we know the server passes 'currentDate.toISOString()', and currentDate was parsed locally on server or constructed as 'startOfDay'.

        // Simplest fix: append 'T00:00:00' if it's just YYYY-MM-DD but here it is full ISO.
        // Let's parse the UTC components directly to avoid browser timezone shift.

        const dateObj = new Date(date);
        // Correctly handle the date to display the UTC date components
        const utcDate = new Date(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate());

        const formattedDate = format(utcDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

        // Add Logo
        try {
            const logoUrl = window.location.origin + '/logo.png';
            const logoImg = new Image();
            logoImg.src = logoUrl;
            await new Promise((resolve, reject) => {
                logoImg.onload = resolve;
                logoImg.onerror = reject;
            });
            doc.addImage(logoImg, 'PNG', 14, 10, 20, 20); // x, y, w, h
        } catch (e) {
            console.error("Could not load logo", e);
        }

        // Title
        doc.setFontSize(18);
        doc.text("JIU-JITSU - Lista de Presença", 40, 25); // Adjusted X position

        doc.setFontSize(12);
        doc.text(`Data: ${formattedDate}`, 14, 40);
        doc.text(`Total de Alunos: ${attendance.length}`, 14, 46);

        // Belt Translation Map
        const beltMap: { [key: string]: string } = {
            'WHITE': 'Branca',
            'GREY': 'Cinza',
            'YELLOW': 'Amarela',
            'ORANGE': 'Laranja',
            'GREEN': 'Verde',
            'BLUE': 'Azul',
            'PURPLE': 'Roxa',
            'BROWN': 'Marrom',
            'BLACK': 'Preta'
        };

        // Table
        const tableData = attendance.map(record => {
            const checkInDate = new Date(record.date);
            // Use UTC hours/minutes to match server stored time, avoiding browser timezone shift
            const hours = checkInDate.getUTCHours().toString().padStart(2, '0');
            const minutes = checkInDate.getUTCMinutes().toString().padStart(2, '0');
            const timeStr = `${hours}:${minutes}`;

            return [
                record.user.name,
                record.user.project || '-',
                beltMap[record.user.belt || ''] || record.user.belt || '-',
                '19:30' //timeStr
            ];
        });

        autoTable(doc, {
            startY: 55,
            head: [['Nome', 'Projeto', 'Faixa', 'Horário']],
            body: tableData,
        });

        doc.save(`presenca-${format(utcDate, 'yyyy-MM-dd')}.pdf`);
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={attendance.length === 0}
            className="gap-2"
        >
            <Download className="w-4 h-4" />
            PDF
        </Button>
    );
}
