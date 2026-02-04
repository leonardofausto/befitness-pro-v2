"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Scale, Save } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sounds";
import { LottieAnimation } from "@/components/lottie-animation";
import successAnim from "../../../../public/animations/success.json";

import { getLocalDate } from "@/lib/utils";

export function AddWeightDialog() {
    const { user } = useUser();
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState(getLocalDate());
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const addWeight = useMutation(api.weights.addWeight).withOptimisticUpdate((localStore, args) => {
        const { userId, weight, date } = args;
        const currentData = localStore.getQuery(api.weights.getWeights, { userId });
        if (currentData !== undefined) {
            const existingIndex = currentData.findIndex(w => w.date === date);
            let updatedData = [...currentData];

            const optimisticEntry = {
                _id: `optimistic_${Date.now()}` as any,
                _creationTime: Date.now(),
                userId,
                weight,
                date,
                bmi: 0,
                calories: 0,
                difference: 0,
                status: "maintained"
            };

            if (existingIndex !== -1) {
                updatedData[existingIndex] = { ...currentData[existingIndex], weight };
            } else {
                updatedData = [optimisticEntry, ...updatedData].sort((a, b) => b.date.localeCompare(a.date));
            }

            localStore.setQuery(api.weights.getWeights, { userId }, updatedData);
        }
    });

    const handleNumberChange = (val: string) => {
        // Strip leading zeros unless it's just "0" or "0.something"
        let processed = val.replace(/^0+(?=\d)/, '');
        if (processed === '') processed = '0';
        setWeight(processed);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsPending(true);
        try {
            await addWeight({
                userId: user.id,
                weight: parseFloat(weight),
                date,
            });
            playSound('SUCCESS');
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setOpen(false);
                setWeight("");
            }, 2000);
        } catch (error) {
            console.error("Erro ao adicionar peso:", error);
        } finally {
            setIsPending(false);
        }
    };

    const inputStyles = "w-full rounded-xl h-10 bg-background border-primary/20 focus-visible:ring-primary text-foreground font-medium shadow-sm transition-all focus:ring-primary";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playSound('CLICK');
                        setOpen(true);
                    }}
                    className="group relative flex items-center gap-2 rounded-full bg-primary px-8 h-14 font-bold text-primary-foreground shadow-[0_0_20px_rgba(103,80,164,0.3)] transition-all hover:shadow-[0_0_30px_rgba(103,80,164,0.5)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <Plus className="h-5 w-5" />
                    <span>Registrar Peso</span>
                </motion.button>
            </DialogTrigger>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="w-[95vw] sm:max-w-[500px] rounded-[2rem] sm:rounded-[3rem] border border-primary/20 shadow-2xl bg-background max-h-[95vh] overflow-y-auto p-6 sm:p-10"
            >
                <DialogHeader className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-primary/10 rounded-2xl text-2xl text-primary">
                            <Scale className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-primary">
                                Registrar Peso
                            </DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-muted-foreground/80">
                                Insira seu peso atual para atualizar seu progresso.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {showSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 scale-150">
                        <LottieAnimation
                            animationData={successAnim}
                            loop={false}
                            className="w-48 h-48"
                        />
                        <h3 className="text-2xl font-black text-primary animate-bounce mt-4">Peso Registrado!</h3>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="weight" className="text-foreground/90 font-bold ml-1">Peso (kg)</Label>
                                <Input
                                    id="weight"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="ex: 70,5"
                                    value={weight}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(',', '.');
                                        if (val === "" || !isNaN(Number(val))) {
                                            setWeight(val);
                                        }
                                    }}
                                    className={inputStyles}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-foreground/90 font-bold ml-1">Data da Pesagem</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={inputStyles}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-sm font-bold shadow-lg transition-all active:scale-[0.98] mt-2"
                        >
                            {isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            Salvar Registro
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
