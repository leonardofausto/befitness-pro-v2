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

export function AddWeightDialog() {
    const { user } = useUser();
    const [weight, setWeight] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [open, setOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const addWeight = useMutation(api.weights.addWeight);

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
            setOpen(false);
            setWeight("");
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-foreground/90 font-bold ml-1">Peso (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="0.0"
                                value={weight}
                                onChange={(e) => handleNumberChange(e.target.value)}
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
            </DialogContent>
        </Dialog>
    );
}
