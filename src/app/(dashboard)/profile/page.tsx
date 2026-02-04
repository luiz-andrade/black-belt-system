export const dynamic = 'force-dynamic';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Info, UserCog, Medal } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <div>Acesso negado</div>;
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return <div>Usuário não encontrado</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <Avatar className="w-24 h-24 border-4 border-card ring-2 ring-primary">
                    <AvatarFallback className="text-3xl font-bold bg-muted">
                        {user.name[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold mt-2">{user.name}</h1>
                    <p className="text-muted-foreground capitalize flex items-center justify-center md:justify-start gap-2">
                        <Medal className="w-4 h-4 text-primary" />
                        {user.role.toLowerCase()}
                    </p>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={updateProfile} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-border">
                                    <Info className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-medium">Informações do Dojô</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Faixa Atual</Label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                                        <span className={`w-4 h-4 rounded-full belt-bg-${user.belt?.toLowerCase()} ring-1 ring-white/10`}></span>
                                        <span className="font-bold">{user.belt}</span>
                                        <span className="text-sm text-muted-foreground">• {user.beltDegree}º Grau</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Projeto Vinculado</Label>
                                    <div className="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                                        {user.project || 'Não vinculado'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Data de Início</Label>
                                    <div className="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50 cursor-not-allowed">
                                        {user.startDate ? new Date(user.startDate).toLocaleDateString('pt-BR') : '-'}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Email de Acesso</Label>
                                    <div className="flex w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-50 cursor-not-allowed truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2 pb-2 border-b border-border">
                                    <UserCog className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-medium">Dados Editáveis</h3>
                                </div>

                                <div className="space-y-2">
                                    <Label>Telefone de Contato</Label>
                                    <Input name="phone" defaultValue={user.phone || ''} placeholder="(00) 00000-0000" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Contato de Emergência</Label>
                                    <Input name="emergencyPhone" defaultValue={user.emergencyPhone || ''} placeholder="Nome e Telefone" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Peso Atual (kg)</Label>
                                    <div className="relative">
                                        <Input name="weight" type="number" step="0.1" defaultValue={user.weight || ''} className="pr-8" />
                                        <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">kg</span>
                                    </div>
                                    <CardDescription className="text-xs">Mantenha seu peso atualizado para competições.</CardDescription>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border flex justify-end">
                            <Button type="submit" className="w-full md:w-auto font-bold">
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
