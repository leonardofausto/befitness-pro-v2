"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Plus, Trash2, History, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sounds";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { HydrationHistoryDialog } from "./hydration-history-dialog";

interface HydrationCardProps {
    weight: number;
    userId: string;
}

export function HydrationCard({ weight, userId }: HydrationCardProps) {
    const today = new Date().toISOString().split('T')[0];
    const hydrationData = useQuery(api.hydration.getHydrationByDate, { userId, date: today });
    const addWater = useMutation(api.hydration.addWater);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const dailyGoal = Math.round(weight * 35);
    const totalIntake = hydrationData?.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0) ?? 0;
    const progress = Math.min(100, Math.round((totalIntake / dailyGoal) * 100));

    const handleAddWater = async (amount: number) => {
        playSound('CLICK');
        await addWater({ userId, amount, date: today });
    };

    const presets = [200, 250, 350, 500];

    return (
        <>
            <Card className="h-full border-none shadow-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-transparent backdrop-blur-xl rounded-[2rem] p-8 overflow-hidden relative group">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-xl">
                                <Droplets className="w-5 h-5 text-blue-500" />
                            </div>
                            <span className="text-lg font-bold uppercase tracking-widest opacity-60">Hidratação</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-3xl font-black text-blue-500">{progress}%</span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase transition-colors duration-500",
                                totalIntake >= dailyGoal ? "text-green-500 opacity-100" : "opacity-40"
                            )}>
                                {totalIntake >= dailyGoal ? "Meta Batida! 🎉" : "da meta diária"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1">
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-sm font-medium opacity-60">Meta Ideal</p>
                                <p className="text-3xl font-black">{dailyGoal}ml</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm font-medium opacity-60">Ingerido</p>
                                <p className="text-3xl font-black text-blue-500">{totalIntake}ml</p>
                            </div>
                        </div>

                        <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {presets.map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    onClick={() => handleAddWater(amount)}
                                    className="rounded-2xl border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all font-bold group"
                                >
                                    <Plus className="w-4 h-4 mr-1 group-hover:scale-125 transition-transform" />
                                    {amount}ml
                                </Button>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsHistoryOpen(true)}
                                className="w-full h-12 rounded-xl border-blue-500/20 hover:bg-blue-500/5 transition-all text-blue-500 font-bold text-sm flex items-center justify-center gap-2"
                            >
                                <History className="w-4 h-4" />
                                Ver Histórico Completo
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <HydrationHistoryDialog
                open={isHistoryOpen}
                onOpenChange={setIsHistoryOpen}
                userId={userId}
            />
        </>
    );
}
