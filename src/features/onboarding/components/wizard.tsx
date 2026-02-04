"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { onboardingSchema, OnboardingData } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { getLocalDate } from "@/lib/utils";


export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
    const { user } = useUser();
    const [isPending, setIsPending] = useState(false);
    const saveProfile = useMutation(api.profiles.saveProfile);

    const form = useForm<OnboardingData>({
        resolver: zodResolver(onboardingSchema) as any,
        defaultValues: {
            name: "",
            age: undefined as any,
            gender: undefined as any,
            weight: undefined as any,
            weightDate: getLocalDate(),
            height: undefined as any,
            activityLevel: undefined as any,
            goal: undefined as any,
            targetWeight: undefined as any,
        },
    });

    const onSubmit = async (data: OnboardingData) => {
        if (!user) return;
        setIsPending(true);
        try {
            await saveProfile({
                ...data,
                userId: user.id,
            });
            onComplete();
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
        } finally {
            setIsPending(false);
        }
    };

    const inputStyles = "w-full rounded-xl h-12 bg-background border-border focus:ring-2 focus:ring-primary font-medium transition-all shadow-sm";
    const selectTriggerStyles = "w-full h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary font-medium text-left shadow-sm transition-all";
    const selectContentStyles = "rounded-xl border-border bg-popover/95 backdrop-blur-xl shadow-2xl";

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
            <Card className="w-full max-w-4xl border-none shadow-2xl bg-card/50 backdrop-blur-xl flex flex-col p-6 sm:p-10">
                <CardHeader className="px-0 pt-0 mb-8 border-b border-border/50 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary/10 rounded-[1.5rem] text-3xl shadow-inner">
                            🎯
                        </div>
                        <div>
                            <CardTitle className="text-4xl font-black tracking-tighter text-primary">
                                Configurar Perfil
                            </CardTitle>
                            <CardDescription className="text-lg font-medium opacity-70">Conte-nos um pouco sobre você para personalizarmos sua experiência.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0 flex-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 flex flex-col h-full">
                            <div className="space-y-8">
                                {/* Row 1: Nome, Idade, Gênero */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Nome</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Seu nome" {...field} className={inputStyles} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="age"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Idade</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="ex: 25"
                                                        {...field}
                                                        className={inputStyles}
                                                        value={field.value ?? ""}
                                                        onChange={e => field.onChange(e.target.value === "" ? "" : parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Gênero</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={selectTriggerStyles}>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent position="popper" className={selectContentStyles} sideOffset={4}>
                                                        <SelectItem value="male" className="rounded-lg py-3 font-medium focus:bg-primary/20">Masculino</SelectItem>
                                                        <SelectItem value="female" className="rounded-lg py-3 font-medium focus:bg-primary/20">Feminino</SelectItem>
                                                        <SelectItem value="other" className="rounded-lg py-3 font-medium focus:bg-primary/20">Outro</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Row 2: Início da Jornada, Nível de Atividade, Objetivo */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control as any}
                                        name="weightDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Início da Jornada</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                        className={inputStyles}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="activityLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Atividade</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={selectTriggerStyles}>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent position="popper" className={selectContentStyles + " max-h-[300px]"} sideOffset={4}>
                                                        <SelectItem value="sedentary" className="rounded-lg py-3 font-medium focus:bg-primary/20">Sedentário</SelectItem>
                                                        <SelectItem value="lightly_active" className="rounded-lg py-3 font-medium focus:bg-primary/20">Leve</SelectItem>
                                                        <SelectItem value="moderately_active" className="rounded-lg py-3 font-medium focus:bg-primary/20">Moderado</SelectItem>
                                                        <SelectItem value="very_active" className="rounded-lg py-3 font-medium focus:bg-primary/20">Ativo</SelectItem>
                                                        <SelectItem value="extra_active" className="rounded-lg py-3 font-medium focus:bg-primary/20">Atleta</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="goal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Objetivo</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className={selectTriggerStyles}>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent position="popper" className={selectContentStyles} sideOffset={4}>
                                                        <SelectItem value="lose" className="rounded-lg py-3 font-medium focus:bg-primary/20">Perder Peso</SelectItem>
                                                        <SelectItem value="maintain" className="rounded-lg py-3 font-medium focus:bg-primary/20">Manter Peso</SelectItem>
                                                        <SelectItem value="gain" className="rounded-lg py-3 font-medium focus:bg-primary/20">Ganhar Peso</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Row 3: Altura, Peso Atual, Peso Alvo */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="height"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Altura (cm)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="ex: 175"
                                                        {...field}
                                                        className={inputStyles}
                                                        value={field.value ?? ""}
                                                        onChange={e => field.onChange(e.target.value === "" ? "" : parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="weight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Peso Atual (kg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        placeholder="ex: 70,5"
                                                        {...field}
                                                        className={inputStyles}
                                                        value={field.value ?? ""}
                                                        onChange={e => {
                                                            const val = e.target.value.replace(',', '.');
                                                            if (val === "" || !isNaN(Number(val)) || val.endsWith('.')) {
                                                                field.onChange(val);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="targetWeight"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-bold text-foreground/80">Peso Alvo (kg)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        inputMode="decimal"
                                                        placeholder="ex: 65,0"
                                                        {...field}
                                                        className={inputStyles}
                                                        value={field.value ?? ""}
                                                        onChange={e => {
                                                            const val = e.target.value.replace(',', '.');
                                                            if (val === "" || !isNaN(Number(val)) || val.endsWith('.')) {
                                                                field.onChange(val);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="pt-10 mt-auto">
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                                >
                                    {isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            Começar Minha Jornada <Check className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
