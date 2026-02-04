"use client";

import { useState, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { History, Search, Droplets, Trash2, Calendar } from "lucide-react";
import { format, getYear, getMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { playSound } from "@/lib/sounds";

interface HydrationHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

export function HydrationHistoryDialog({ open, onOpenChange, userId }: HydrationHistoryDialogProps) {
    const allHydration = useQuery(api.hydration.getAllHydration, { userId });
    const removeWater = useMutation(api.hydration.removeWater);

    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");

    const selectTriggerStyles = "h-10 w-full rounded-xl border-blue-500/20 bg-background focus:ring-2 focus:ring-blue-500 text-foreground font-medium shadow-sm transition-all";
    const selectContentStyles = "w-[var(--radix-select-trigger-width)] rounded-xl border border-blue-500/20 bg-background shadow-2xl p-1 z-[110] max-h-[160px]";

    const years = useMemo(() => {
        if (!allHydration) return [];
        const uniqueYears = Array.from(new Set(allHydration.map(h => getYear(new Date(h.date)).toString())));
        return uniqueYears.sort((a, b) => b.localeCompare(a));
    }, [allHydration]);

    const months = [
        { value: "0", label: "Janeiro" },
        { value: "1", label: "Fevereiro" },
        { value: "2", label: "Março" },
        { value: "3", label: "Abril" },
        { value: "4", label: "Maio" },
        { value: "5", label: "Junho" },
        { value: "6", label: "Julho" },
        { value: "7", label: "Agosto" },
        { value: "8", label: "Setembro" },
        { value: "9", label: "Outubro" },
        { value: "10", label: "Novembro" },
        { value: "11", label: "Dezembro" },
    ];

    const filteredHydration = useMemo(() => {
        if (!allHydration) return [];
        return allHydration.filter(h => {
            const date = new Date(h.date);
            const yearMatch = selectedYear === "all" || getYear(date).toString() === selectedYear;
            const monthMatch = selectedMonth === "all" || getMonth(date).toString() === selectedMonth;
            return yearMatch && monthMatch;
        });
    }, [allHydration, selectedYear, selectedMonth]);

    const handleRemoveWater = async (id: Id<"hydration">) => {
        playSound('CLICK');
        await removeWater({ id });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="w-[95vw] sm:max-w-[600px] rounded-[2rem] sm:rounded-[3rem] border border-blue-500/20 bg-background p-6 sm:p-10 h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
                <DialogHeader className="mb-6">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                            <Droplets className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-black text-blue-500">Histórico de Hidratação</DialogTitle>
                            <DialogDescription className="text-sm font-medium">Veja todos os seus registros de consumo de água.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Ano</span>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className={selectTriggerStyles}>
                                <SelectValue placeholder="Ano" />
                            </SelectTrigger>
                            <SelectContent className={selectContentStyles}>
                                <SelectItem value="all">Todos</SelectItem>
                                {years.map(year => (
                                    <SelectItem key={year} value={year}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Mês</span>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className={selectTriggerStyles}>
                                <SelectValue placeholder="Mês" />
                            </SelectTrigger>
                            <SelectContent className={selectContentStyles}>
                                <SelectItem value="all">Todos</SelectItem>
                                {months.map(month => (
                                    <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                    {filteredHydration.length > 0 ? (
                        filteredHydration.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center justify-between p-4 bg-blue-500/5 rounded-2xl hover:bg-blue-500/10 transition-colors group"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg text-blue-500">{item.amount}ml</span>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(item.date), "dd 'de' MMMM", { locale: ptBR })}
                                        <span className="opacity-40">•</span>
                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRemoveWater(item._id)}
                                    className="p-2 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                    title="Remover registro"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-blue-500/5 rounded-3xl border border-dashed border-blue-500/10">
                            <Search className="w-10 h-10 mb-4 opacity-20 text-blue-500" />
                            <p className="italic text-sm">Nenhum registro encontrado para este filtro.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
