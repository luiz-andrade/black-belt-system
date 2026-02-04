'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Store, User, GraduationCap, CalendarCheck, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    const menu = [
        { name: 'Dashboard', href: '/dashboard', icon: Store },
        { name: 'Alunos', href: '/students', icon: User },
        { name: 'Chamada', href: '/attendance', icon: CalendarCheck },
        { name: 'Meu Perfil', href: '/profile', icon: GraduationCap },
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="relative w-10 h-10">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                    />
                </div>
                <h1 className="text-lg font-bold tracking-tight">Black Belt System</h1>
            </div>

            <nav className="flex-1 space-y-1">
                {menu.map(item => {
                    const isActive = pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-muted text-foreground font-medium border-l-2 border-primary'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center gap-3 mb-3 px-2">
                    <Avatar className="w-8 h-8 rounded-full">
                        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                            {session?.user?.name?.[0] || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <div className="text-sm font-medium text-foreground truncate">{session?.user?.name}</div>
                        <div className="text-xs text-muted-foreground truncate capitalize">{session?.user?.role?.toLowerCase()}</div>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="w-full justify-start pl-12 text-xs text-muted-foreground hover:text-destructive"
                >
                    Sair
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 border-r border-border p-6 flex-col sticky top-0 h-screen bg-card">
                <NavContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold">Black Belt</span>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="w-4 h-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[80vw] bg-card border-r-border p-6">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="flex-1 p-4 md:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
