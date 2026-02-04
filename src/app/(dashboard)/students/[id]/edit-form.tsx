'use client';

import { updateStudent, deleteStudent } from '../actions';
import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { differenceInYears } from 'date-fns';
import { useState } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto px-8">
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : 'Salvar Alterações'}
        </Button>
    );
}

export default function EditStudentForm({ student }: { student: any }) {
    const updateWithId = updateStudent.bind(null, student.id);
    const deleteWithId = deleteStudent.bind(null, student.id);
    const [isDeleting, setIsDeleting] = useState(false);

    const [birthDate, setBirthDate] = useState(student.birthDate ? new Date(student.birthDate).toISOString().split('T')[0] : '');
    const isMinor = birthDate ? differenceInYears(new Date(), new Date(birthDate)) < 18 : false;

    return (
        <Card>
            <CardContent className="pt-6 relative">
                <form action={updateWithId} className="space-y-8 pb-16 md:pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Personal Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Dados Pessoais</h3>

                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input name="name" required defaultValue={student.name} placeholder="Ex: João Silva" />
                            </div>

                            <div className="space-y-2">
                                <Label>E-mail (Login)</Label>
                                <Input name="email" type="email" required defaultValue={student.email} placeholder="joao@example.com" />
                            </div>

                            <div className="space-y-2">
                                <Label>Data de Nascimento</Label>
                                <Input
                                    name="birthDate"
                                    type="date"
                                    defaultValue={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Nome do Responsável {isMinor && <span className="text-red-500">*</span>}</Label>
                                <Input
                                    name="responsibleName"
                                    required={isMinor}
                                    defaultValue={student.responsibleName || ''}
                                    placeholder={isMinor ? "Obrigatório" : "Opcional"}
                                />
                                {isMinor && <p className="text-xs text-red-500">Aluno menor de idade baseada na data de nascimento.</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Telefone</Label>
                                <Input name="phone" defaultValue={student.phone || ''} placeholder="(00) 00000-0000" />
                            </div>

                            <div className="space-y-2">
                                <Label>Telefone de Emergência</Label>
                                <Input name="emergencyPhone" defaultValue={student.emergencyPhone || ''} placeholder="(00) 00000-0000" />
                            </div>

                            <div className="space-y-2">
                                <Label>Nova Senha</Label>
                                <Input name="password" type="password" placeholder="Deixe em branco para manter a atual" />
                            </div>
                        </div>

                        {/* Jiu-Jitsu Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium border-b pb-2">Dados do Treino</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Peso (kg)</Label>
                                    <Input name="weight" type="number" step="0.1" defaultValue={student.weight || ''} placeholder="00.0" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Início dos Treinos</Label>
                                    <Input name="startDate" type="date" defaultValue={student.startDate ? new Date(student.startDate).toISOString().split('T')[0] : ''} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Faixa</Label>
                                    <Select name="belt" defaultValue={student.belt || "WHITE"}>
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
                                    <Input name="beltDegree" type="number" min="0" max="6" defaultValue={student.beltDegree || 0} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Projeto Vinculado</Label>
                                <Select name="project" defaultValue={student.project || undefined} required>
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
                                <Select name="role" defaultValue={student.role || "STUDENT"}>
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
                                    defaultValue={student.history || ''}
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

                <div className="absolute bottom-6 left-6 md:static md:float-left md:-mt-[58px]">
                    <form action={deleteWithId} onSubmit={() => setIsDeleting(true)}>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={(e) => {
                                if (!confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {isDeleting ? 'Excluindo...' : 'Excluir Aluno'}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}
