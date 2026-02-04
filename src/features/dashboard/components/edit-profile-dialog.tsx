"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sounds";

const profileSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    age: z.coerce.number().min(1, "Idade é obrigatória"),
    gender: z.string().min(1, "Selecione o gênero"),
    height: z.coerce.number().min(50, "Altura é obrigatória"),
    activityLevel: z.string().min(1, "Selecione o nível de atividade"),
    goal: z.string().min(1, "Selecione seu objetivo"),
    targetWeight: z.coerce.number().min(20, "Peso alvo é obrigatório"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: any;
    currentWeight: number;
}

export function EditProfileDialog({ open, onOpenChange, initialData, currentWeight }: EditProfileDialogProps) {
    const [isPending, setIsPending] = useState(false);
    const updateProfile = useMutation(api.profiles.updateProfile);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema) as any,
        values: {
            name: initialData?.name || "",
            age: initialData?.age || 0,
            gender: initialData?.gender || "",
            height: initialData?.height || 0,
            activityLevel: initialData?.activityLevel || "",
            goal: initialData?.goal || "",
            targetWeight: initialData?.targetWeight || 0,
        },
    });

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: number) => void) => {
        const val = e.target.value;
        let processed = val.replace(/^0+(?=\d)/, '');
        if (processed === '') processed = '0';
        onChange(Number(processed));
    };

    async function onSubmit(values: ProfileFormValues) {
        setIsPending(true);
        try {
            await updateProfile({
                id: initialData?._id as any,
                name: values.name,
                age: values.age,
                gender: values.gender,
                height: values.height,
                activityLevel: values.activityLevel,
                goal: values.goal,
                targetWeight: values.targetWeight,
            });
            playSound('SUCCESS');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsPending(false);
        }
    }

    const selectTriggerStyles = "h-10 w-full rounded-xl border-primary/20 bg-background focus:ring-2 focus:ring-primary text-foreground font-medium shadow-sm transition-all";
    const selectContentStyles = "w-[var(--radix-select-trigger-width)] rounded-b-xl rounded-t-none border-x border-b border-primary/20 bg-background shadow-2xl mt-[-1px] p-1";
    const inputStyles = "w-full rounded-xl h-10 bg-background border-primary/20 focus-visible:ring-primary text-foreground font-medium shadow-sm transition-all focus:ring-primary";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="w-[95vw] sm:max-w-[500px] rounded-[2rem] sm:rounded-[3rem] border border-primary/20 shadow-2xl bg-background max-h-[95vh] overflow-y-auto p-6 sm:p-10"
            >
                <DialogHeader className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-primary/10 rounded-2xl text-2xl text-primary">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-primary">
                                Editar Perfil
                            </DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-muted-foreground/80">Mantenha seus dados atualizados para cálculos precisos.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Nome e Gênero */}
                            <FormField
                                control={form.control as any}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} className={inputStyles} placeholder="Nome" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Gênero</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={selectTriggerStyles}>
                                                    <SelectValue placeholder="Gênero" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={selectContentStyles} position="popper" sideOffset={0}>
                                                <SelectItem value="male" className="rounded-lg focus:bg-primary/20 font-medium py-3">Masculino</SelectItem>
                                                <SelectItem value="female" className="rounded-lg focus:bg-primary/20 font-medium py-3">Feminino</SelectItem>
                                                <SelectItem value="other" className="rounded-lg focus:bg-primary/20 font-medium py-3">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Idade e Altura */}
                            <FormField
                                control={form.control as any}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Idade</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => handleNumberChange(e, field.onChange)}
                                                className={inputStyles}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Altura (cm)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => handleNumberChange(e, field.onChange)}
                                                className={inputStyles}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nível de Atividade e Objetivo */}
                            <FormField
                                control={form.control as any}
                                name="activityLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Nível de Atividade</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={selectTriggerStyles}>
                                                    <SelectValue placeholder="Nível" className="truncate" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={selectContentStyles + " max-h-[300px]"} position="popper" sideOffset={0}>
                                                <SelectItem value="sedentary" className="rounded-lg focus:bg-primary/20 py-3 font-medium">Sedentário</SelectItem>
                                                <SelectItem value="lightly_active" className="rounded-lg focus:bg-primary/20 py-3 font-medium">Leve</SelectItem>
                                                <SelectItem value="moderately_active" className="rounded-lg focus:bg-primary/20 py-3 font-medium">Moderado</SelectItem>
                                                <SelectItem value="very_active" className="rounded-lg focus:bg-primary/20 py-3 font-medium">Ativo</SelectItem>
                                                <SelectItem value="extra_active" className="rounded-lg focus:bg-primary/20 py-3 font-medium">Atleta</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as any}
                                name="goal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Objetivo</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={selectTriggerStyles}>
                                                    <SelectValue placeholder="Objetivo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className={selectContentStyles} position="popper" sideOffset={0}>
                                                <SelectItem value="lose" className="rounded-lg focus:bg-primary/20 font-medium py-3">Perder Peso</SelectItem>
                                                <SelectItem value="maintain" className="rounded-lg focus:bg-primary/20 font-medium py-3">Manter Peso</SelectItem>
                                                <SelectItem value="gain" className="rounded-lg focus:bg-primary/20 font-medium py-3">Ganhar Peso</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Peso Atual e Peso Alvo */}
                            <FormItem>
                                <FormLabel className="text-foreground/90 font-bold">Peso Atual (kg)</FormLabel>
                                <FormControl>
                                    <div className={inputStyles + " flex items-center px-4 bg-muted/20 border-dashed opacity-70 cursor-not-allowed"}>
                                        {currentWeight}
                                    </div>
                                </FormControl>
                            </FormItem>
                            <FormField
                                control={form.control as any}
                                name="targetWeight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground/90 font-bold">Peso Alvo (kg)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.1"
                                                {...field}
                                                onChange={(e) => handleNumberChange(e, field.onChange)}
                                                className={inputStyles}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-sm font-bold shadow-lg transition-all active:scale-[0.98] mt-2"
                        >
                            {isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            Salvar Alterações
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
