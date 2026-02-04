"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Calculator, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BmiStatsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bmi: number;
    height: number;
    weight: number;
}

export function BmiStatsDialog({ open, onOpenChange, bmi, height, weight }: BmiStatsDialogProps) {
    const getBmiCategory = (bmi: number) => {
        if (bmi < 18.5) return { label: "Abaixo do peso", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", description: "Você está abaixo do peso ideal para sua altura.", icon: AlertTriangle };
        if (bmi < 25) return { label: "Peso Normal", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", description: "Parabéns! Você está na faixa de peso saudável.", icon: CheckCircle2 };
        if (bmi < 30) return { label: "Sobrepeso", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", description: "Você está um pouco acima do peso ideal.", icon: AlertTriangle };
        if (bmi < 35) return { label: "Obesidade Grau I", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", description: "Atenção: Seu peso está aumentando o risco de problemas de saúde.", icon: AlertTriangle };
        if (bmi < 40) return { label: "Obesidade Grau II", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", description: "Risco alto: É importante buscar orientação profissional.", icon: AlertTriangle };
        return { label: "Obesidade Grau III", color: "text-red-700", bg: "bg-red-700/10", border: "border-red-700/20", description: "Risco muito alto: Busque ajuda médica imediatamente.", icon: AlertTriangle };
    };

    const category = getBmiCategory(bmi);
    const CategoryIcon = category.icon;

    // Calculate rotation for the gauge (0 to 180 degrees)
    // BMI range typically 15 to 45 for the gauge
    const minBmi = 15;
    const maxBmi = 45;
    const percentage = Math.min(Math.max((bmi - minBmi) / (maxBmi - minBmi), 0), 1);
    const rotation = percentage * 180 - 90; // -90 to 90 degrees

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="w-[95vw] sm:w-fit sm:min-w-[600px] sm:max-w-[900px] rounded-[3rem] border border-primary/20 bg-background p-10 max-h-[95vh] overflow-y-auto shadow-2xl scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20"
            >
                <DialogHeader className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-[#00A3FF]/10 rounded-2xl text-[#00A3FF]">
                            <Calculator className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-[#00A3FF]">Detalhes do IMC</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-muted-foreground/80">Entenda o que este número diz sobre sua saúde.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* 3D Gauge Visual */}
                    <div className="relative flex flex-col items-center justify-center -mt-6 py-6">
                        <div className="relative w-72 h-36 overflow-hidden" style={{ perspective: "1000px" }}>
                            {/* Base 3D Shadow Layer */}
                            <div className="absolute top-1 left-0 w-72 h-72 rounded-full border-[18px] border-black/10 blur-[2px]" />

                            {/* Main Gauge Background */}
                            <div className="absolute top-0 left-0 w-72 h-72 rounded-full border-[18px] border-muted/20 shadow-inner" />

                            {/* Color Segments with Gradient and Depth */}
                            <svg className="absolute top-0 left-0 w-72 h-72 -rotate-180 drop-shadow-lg" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="41"
                                    fill="none"
                                    stroke="url(#bmi-gradient-3d)"
                                    strokeWidth="8"
                                    strokeDasharray="128.8 257.6"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="bmi-gradient-3d" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="33%" stopColor="#22c55e" />
                                        <stop offset="66%" stopColor="#eab308" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Needle Container for 3D effect */}
                            <motion.div
                                className="absolute bottom-0 left-1/2 w-1.5 h-28 bg-foreground rounded-full origin-bottom -ml-0.75 shadow-xl"
                                initial={{ rotate: -90 }}
                                animate={{ rotate: rotation }}
                                transition={{ type: "spring", stiffness: 40, damping: 12 }}
                                style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-foreground to-foreground/40 rounded-full" />
                            </motion.div>

                            {/* Needle Center 3D */}
                            <div className="absolute bottom-[-8px] left-1/2 -ml-3 w-6 h-6 rounded-full bg-foreground border-[4px] border-background shadow-2xl z-20" />
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-2">
                            <span className="text-5xl font-black text-foreground tracking-tighter drop-shadow-sm">{bmi.toFixed(2)}</span>

                            {/* Enhanced Alerta Badge below value */}
                            <div className={cn(
                                "flex items-center gap-2 px-4 py-1.5 rounded-2xl border-2 font-bold text-xs shadow-sm",
                                category.bg, category.color, category.border
                            )}>
                                <category.icon className="w-3.5 h-3.5 fill-current" />
                                {category.label.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-muted/30 rounded-[2.5rem] p-8 border border-primary/5">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Info className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-xl mb-1">O que significa?</h4>
                                <p className="text-sm text-muted-foreground leading-snug md:whitespace-nowrap">
                                    {category.description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-background/50 rounded-2xl p-4 border border-primary/10">
                            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Como calculamos</p>
                            <div className="flex items-center justify-between">
                                <code className="text-xs font-bold text-primary">IMC = Peso / (Altura)²</code>
                                <span className="text-[10px] text-muted-foreground">{weight}kg / ({height / 100}m)²</span>
                            </div>
                        </div>
                    </div>

                    {/* BMI Table */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 bg-blue-500/10 rounded-2xl flex justify-between items-center border border-blue-500/10 group hover:bg-blue-500/20 transition-all">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">Abaixo de 18.5</span>
                            <span className="text-xs font-black text-blue-700 dark:text-blue-400">Abaixo do peso</span>
                        </div>
                        <div className="p-4 bg-green-500/20 rounded-2xl flex justify-between items-center font-bold text-green-700 dark:text-green-400 border-2 border-green-500/30 shadow-sm shadow-green-500/10">
                            <span className="text-[10px] font-bold uppercase tracking-wider">18.5 - 24.9</span>
                            <span className="text-xs font-black">Normal</span>
                        </div>
                        <div className="p-4 bg-yellow-500/10 rounded-2xl flex justify-between items-center border border-yellow-500/10 group hover:bg-yellow-500/20 transition-all">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">25.0 - 29.9</span>
                            <span className="text-xs font-black">Sobrepeso</span>
                        </div>
                        <div className="p-4 bg-red-500/10 rounded-2xl flex justify-between items-center border border-red-500/10 group hover:bg-red-500/20 transition-all">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">30.0+</span>
                            <span className="text-xs font-black">Obesidade</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
