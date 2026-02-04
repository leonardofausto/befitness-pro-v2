import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Calculator, Flame } from "lucide-react";
import { BmiStatsDialog } from "./bmi-stats-dialog";
import { CalorieStatsDialog } from "./calorie-stats-dialog";
import { motion } from "framer-motion";
import { playSound } from "@/lib/sounds";

interface StatsCardsProps {
    weight: number;
    bmi: number;
    calories: number;
    height: number;
    targetWeight: number;
    objective: "lose" | "gain" | "maintain";
    isVisible?: boolean;
}

export function StatsCards({
    weight,
    bmi,
    calories,
    height,
    targetWeight,
    objective,
    isVisible = true
}: StatsCardsProps) {
    const [isBmiOpen, setIsBmiOpen] = useState(false);
    const [isCaloriesOpen, setIsCaloriesOpen] = useState(false);

    const formatValue = (value: number, unit: string) => {
        return isVisible ? `${value} ${unit}` : "••••••";
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[#6750a4]/20 to-[#6750a4]/5 backdrop-blur-xl rounded-[2.5rem] transition-all">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#6750a4]/10 rounded-full blur-2xl" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-70">Peso Atual</CardTitle>
                        <div className="p-2 bg-white/10 dark:bg-black/20 rounded-xl shadow-inner text-[#6750a4]">
                            <Scale className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black tracking-tight">{formatValue(weight, "kg")}</div>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">Sua última pesagem</p>
                    </CardContent>
                </Card>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                        onClick={() => {
                            playSound('CLICK');
                            setIsBmiOpen(true);
                        }}
                        className="cursor-pointer group relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[#00A3FF]/20 to-[#00A3FF]/5 backdrop-blur-xl rounded-[2.5rem] transition-all hover:shadow-[0_0_30px_rgba(0,163,255,0.2)]"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#00A3FF]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-70">IMC</CardTitle>
                            <div className="p-2 bg-white/10 dark:bg-black/20 rounded-xl shadow-inner text-[#00A3FF]">
                                <Calculator className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tight">{formatValue(bmi, "")}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Índice de Massa Corporal</p>
                            <div className="mt-2 text-[10px] font-bold text-[#00A3FF] opacity-0 group-hover:opacity-100 transition-opacity">CLIQUE PARA DETALHES →</div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card
                        onClick={() => {
                            playSound('CLICK');
                            setIsCaloriesOpen(true);
                        }}
                        className="cursor-pointer group relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-[#FF6B00]/20 to-[#FF6B00]/5 backdrop-blur-xl rounded-[2.5rem] transition-all hover:shadow-[0_0_30px_rgba(255,107,0,0.2)]"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FF6B00]/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider opacity-70">Gasto Calórico</CardTitle>
                            <div className="p-2 bg-white/10 dark:bg-black/20 rounded-xl shadow-inner text-[#FF6B00]">
                                <Flame className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tight">{formatValue(calories, "kcal")}</div>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Manutenção diária estimada</p>
                            <div className="mt-2 text-[10px] font-bold text-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity">CLIQUE PARA DETALHES →</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <BmiStatsDialog
                open={isBmiOpen}
                onOpenChange={setIsBmiOpen}
                bmi={bmi}
                height={height}
                weight={weight}
            />

            <CalorieStatsDialog
                open={isCaloriesOpen}
                onOpenChange={setIsCaloriesOpen}
                calories={calories}
                objective={objective}
                weight={weight}
                targetWeight={targetWeight}
            />
        </>
    );
}
