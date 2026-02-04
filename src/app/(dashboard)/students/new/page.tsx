'use client';
import { createStudent } from '../actions';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from 'react';
import { differenceInYears } from 'date-fns';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto px-8">
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar Aluno'}
        </Button>
    );
}

export default function NewStudentPage() {
    const [birthDate, setBirthDate] = useState('');
    const isMinor = birthDate ? differenceInYears(new Date(), new Date(birthDate)) < 18 : false;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Novo Aluno</h1>
                <p className="text-muted-foreground">Preencha os dados para cadastrar um novo aluno ou professor.</p>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <form action={createStudent} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium border-b pb-2">Dados Pessoais</h3>

                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <Input name="name" required placeholder="Ex: João Silva" />
                                </div>

                                <div className="space-y-2">
                                    <Label>E-mail (Login)</Label>
                                    <Input name="email" type="email" required placeholder="joao@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Data de Nascimento</Label>
                                    <Input
                                        name="birthDate"
                                        type="date"
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        value={birthDate}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Nome do Responsável {isMinor && <span className="text-red-500">*</span>}</Label>
                                    <Input
                                        name="responsibleName"
                                        required={isMinor}
                                        placeholder={isMinor ? "Obrigatório" : "Opcional"}
                                    />
                                    {isMinor && <p className="text-xs text-red-500">Aluno menor de idade baseada na data de nascimento.</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Telefone</Label>
                                    <Input name="phone" placeholder="(00) 00000-0000" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Telefone de Emergência</Label>
                                    <Input name="emergencyPhone" placeholder="(00) 00000-0000" />
                                </div>

                                <div className="space-y-2">
                                    <Label>Senha Inicial</Label>
                                    <Input name="password" type="password" placeholder="Opcional (Padrão: 123456)" />
                                </div>
                            </div>

                            {/* Jiu-Jitsu Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium border-b pb-2">Dados do Treino</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Peso (kg)</Label>
                                        <Input name="weight" type="number" step="0.1" placeholder="00.0" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Início dos Treinos</Label>
                                        <Input name="startDate" type="date" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Faixa</Label>
                                        <Select name="belt" defaultValue="WHITE">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="WHITE">Branca</SelectItem>
                                                <SelectItem value="GREY">Cinza</SelectItem>
                                                <SelectItem value="YELLOW">Amarela</SelectItem>
                                                <SelectItem value="ORANGE">Laranja</SelectItem>
                                                <SelectItem value="GREEN">Verde</SelectItem>
                                                <SelectItem value="BLUE">Azul</SelectItem>
                                                <SelectItem value="PURPLE">Roxa</SelectItem>
                                                <SelectItem value="BROWN">Marrom</SelectItem>
                                                <SelectItem value="BLACK">Preta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Grau</Label>
                                        <Input name="beltDegree" type="number" min="0" max="6" defaultValue="0" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Projeto Vinculado</Label>
                                    <Select name="project" defaultValue='BNH' required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="K5">K5</SelectItem>
                                            <SelectItem value="BNH">BNH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Perfil de Acesso</Label>
                                    <Select name="role" defaultValue="STUDENT">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STUDENT">Aluno</SelectItem>
                                            <SelectItem value="PROFESSOR">Professor</SelectItem>
                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Histórico / Observações</Label>
                                    <textarea
                                        name="history"
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Histórico de lesões, campeonatos, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex justify-end">
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
