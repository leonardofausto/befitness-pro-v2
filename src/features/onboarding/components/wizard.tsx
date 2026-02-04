"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
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

const steps = [
    { id: 1, title: "Dados Pessoais", description: "Conte-nos um pouco sobre você.", icon: "👤" },
    { id: 2, title: "Objetivos & Atividade", description: "O que você deseja alcançar?", icon: "🎯" },
];

export function OnboardingWizard({ onComplete }: { onComplete: () => void }) {
    const { user } = useUser();
    const [currentStep, setCurrentStep] = useState(1);
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

    const nextStep = async () => {
        const fieldsToValidate = currentStep === 1
            ? ["name", "age", "gender", "weight", "weightDate", "height"]
            : ["activityLevel", "goal", "targetWeight"];

        const isValid = await form.trigger(fieldsToValidate as any);
        if (isValid) {
            if (currentStep < steps.length) {
                setCurrentStep((s) => s + 1);
            } else {
                form.handleSubmit(onSubmit)();
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep((s) => s - 1);
    };

    const onSubmit = async (data: OnboardingData) => {
        if (!user) return;
        try {
            await saveProfile({
                ...data,
                userId: user.id,
            });
            onComplete();
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
            <Card className="w-full max-w-2xl min-h-[500px] border-none shadow-2xl bg-card/50 backdrop-blur-xl flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        {steps.map((step) => (
                            <div
                                key={step.id}
                                className={`h-2 flex-1 mx-1 rounded-full transition-all duration-500 ${currentStep >= step.id ? "bg-primary" : "bg-muted"
                                    }`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-primary/10 rounded-2xl text-2xl">
                            {steps[currentStep - 1].icon}
                        </div>
                        <div>
                            <CardTitle className="text-3xl font-black tracking-tight text-primary">
                                {steps[currentStep - 1].title}
                            </CardTitle>
                            <CardDescription className="text-base font-medium">{steps[currentStep - 1].description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Seu nome" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="age"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Idade</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="ex: 25"
                                                                {...field}
                                                                value={field.value ?? ""}
                                                                onChange={e => {
                                                                    const val = e.target.value === "" ? "" : parseInt(e.target.value);
                                                                    field.onChange(val);
                                                                }}
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
                                                        <FormLabel>Gênero</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary">
                                                                    <SelectValue placeholder="Selecione" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)] rounded-xl border-border bg-popover/95 backdrop-blur-xl">
                                                                <SelectItem value="male" className="rounded-lg focus:bg-primary/20">Masculino</SelectItem>
                                                                <SelectItem value="female" className="rounded-lg focus:bg-primary/20">Feminino</SelectItem>
                                                                <SelectItem value="other" className="rounded-lg focus:bg-primary/20">Outro</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Peso Atual (kg)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                inputMode="decimal"
                                                                placeholder="ex: 70,5"
                                                                {...field}
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
                                                control={form.control as any}
                                                name="weightDate"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Data do Peso</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="date"
                                                                {...field}
                                                                className="w-full h-12 rounded-xl border-border bg-background"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="height"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Altura (cm)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="ex: 175"
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            onChange={e => {
                                                                const val = e.target.value === "" ? "" : parseInt(e.target.value);
                                                                field.onChange(val);
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="activityLevel"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Atividade</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary text-left">
                                                                    <SelectValue placeholder="Selecione" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent position="popper" className="rounded-xl border-border bg-popover/95 backdrop-blur-xl max-h-[300px]">
                                                                <SelectItem value="sedentary" className="rounded-lg focus:bg-primary/20 py-3">Sedentário</SelectItem>
                                                                <SelectItem value="lightly_active" className="rounded-lg focus:bg-primary/20 py-3">Leve</SelectItem>
                                                                <SelectItem value="moderately_active" className="rounded-lg focus:bg-primary/20 py-3">Moderado</SelectItem>
                                                                <SelectItem value="very_active" className="rounded-lg focus:bg-primary/20 py-3">Ativo</SelectItem>
                                                                <SelectItem value="extra_active" className="rounded-lg focus:bg-primary/20 py-3">Atleta</SelectItem>
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
                                                        <FormLabel>Objetivo</FormLabel>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-full h-12 rounded-xl border-border bg-background focus:ring-2 focus:ring-primary">
                                                                    <SelectValue placeholder="Selecione" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent position="popper" className="rounded-xl border-border bg-popover/95 backdrop-blur-xl">
                                                                <SelectItem value="lose" className="rounded-lg focus:bg-primary/20">Perder Peso</SelectItem>
                                                                <SelectItem value="maintain" className="rounded-lg focus:bg-primary/20">Manter Peso</SelectItem>
                                                                <SelectItem value="gain" className="rounded-lg focus:bg-primary/20">Ganhar Peso</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="targetWeight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Meta (kg)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="text"
                                                                inputMode="decimal"
                                                                placeholder="ex: 65,0"
                                                                {...field}
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="rounded-full"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
                    </Button>
                    <Button
                        onClick={nextStep}
                        className="rounded-full px-8 bg-primary hover:bg-primary/90"
                    >
                        {currentStep === steps.length ? (
                            <>Concluir <Check className="ml-2 h-4 w-4" /></>
                        ) : (
                            <>Próximo <ChevronRight className="ml-2 h-4 w-4" /></>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
