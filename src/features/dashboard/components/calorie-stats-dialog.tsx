"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Flame, Info, Target, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalorieStatsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    calories: number;
    objective: "lose" | "gain" | "maintain";
    weight: number;
    targetWeight: number;
    isVisible?: boolean;
}

export function CalorieStatsDialog({
    open,
    onOpenChange,
    calories,
    objective,
    weight,
    targetWeight,
    isVisible = true
}: CalorieStatsDialogProps) {

    const getObjectiveDetails = () => {
        switch (objective) {
            case "lose":
                return {
                    label: "Perder Peso",
                    icon: TrendingDown,
                    color: "text-red-500",
                    bg: "bg-red-500/10",
                    border: "border-red-500/20",
                    description: "Para perder peso de forma saudável, você deve consumir em média 300 a 500 kcal a menos do que o valor mostrado.",
                    strategy: isVisible ? "Consuma cerca de " + Math.round(calories - 500) + " a " + Math.round(calories - 300) + " kcal/dia." : "Consuma cerca de •••• a •••• kcal/dia.",
                    advice: "Foque em proteínas e vegetais para manter a saciedade mesmo com o déficit calórico."
                };
            case "gain":
                return {
                    label: "Ganhar Peso (Massa)",
                    icon: TrendingUp,
                    color: "text-green-500",
                    bg: "bg-green-500/10",
                    border: "border-green-500/20",
                    description: "Para ganhar massa magra, você deve consumir em média 300 a 500 kcal a mais do que sua manutenção.",
                    strategy: isVisible ? "Consuma cerca de " + Math.round(calories + 300) + " a " + Math.round(calories + 500) + " kcal/dia." : "Consuma cerca de •••• a •••• kcal/dia.",
                    advice: "Priorize treinos de força e garanta uma boa ingestão de carboidratos complexos."
                };
            default:
                return {
                    label: "Manter Peso",
                    icon: Minus,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                    description: "Seu valor de manutenção é o equilíbrio perfeito entre o que você consome e o que você gasta.",
                    strategy: isVisible ? "Consuma cerca de " + Math.round(calories) + " kcal/dia." : "Consuma cerca de •••• kcal/dia.",
                    advice: "Mantenha a constância na sua rotina atual de exercícios e alimentação."
                };
        }
    };

    const details = getObjectiveDetails();
    const ObjectiveIcon = details.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="w-[95vw] sm:w-fit sm:min-w-[600px] sm:max-w-[800px] rounded-[2rem] sm:rounded-[3rem] border border-primary/20 bg-background p-6 sm:p-10 max-h-[95vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20"
            >
                <DialogHeader className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-[#FF6B00]/10 rounded-2xl text-[#FF6B00]">
                            <Flame className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-[#FF6B00]">Gasto Calórico</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-muted-foreground/80">Entenda suas necessidades de energia.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Main Value Card */}
                    <div className="bg-gradient-to-br from-[#FF6B00]/20 via-[#FF6B00]/5 to-transparent rounded-[2.5rem] p-8 border border-[#FF6B00]/10 relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#FF6B00]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 text-center">
                            <span className="text-6xl font-black text-foreground">{isVisible ? calories : "••••"}</span>
                            <span className="text-xl font-bold text-[#FF6B00] ml-2">kcal</span>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-60 mt-2">Sua Manutenção Diária</p>
                        </div>
                    </div>

                    {/* Explanation Section */}
                    <div className="space-y-4">
                        <div className={cn("p-6 rounded-3xl border flex items-start gap-4 transition-all", details.bg, details.border)}>
                            <div className={cn("p-3 rounded-2xl bg-white/10 dark:bg-black/20", details.color)}>
                                <ObjectiveIcon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h4 className={cn("font-bold text-lg", details.color)}>{details.label}</h4>
                                <p className="text-xs text-foreground/80 leading-relaxed mt-1 md:whitespace-nowrap">
                                    {details.description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-3xl p-6 border border-primary/5 space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Estratégia Recomendada</span>
                                </div>
                                <p className="text-lg font-black text-primary md:whitespace-nowrap">{details.strategy}</p>
                            </div>

                            <div className="flex items-start gap-3 bg-background/50 p-4 rounded-2xl border border-primary/10">
                                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-xs italic text-muted-foreground md:whitespace-nowrap">
                                    {details.advice}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Context */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-muted-foreground">Peso Atual</span>
                            <span className="text-lg font-bold">{isVisible ? `${weight} kg` : "••• kg"}</span>
                        </div>
                        <div className="h-px flex-1 bg-primary/10 mx-4" />
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-muted-foreground">Meta</span>
                            <span className="text-lg font-bold text-primary">{isVisible ? `${targetWeight} kg` : "••• kg"}</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-center text-muted-foreground px-4">
                        *Este valor é uma estimativa baseada na fórmula de Harris-Benedict revisada por Mifflin-St Jeor, considerando seu nível de atividade física.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
