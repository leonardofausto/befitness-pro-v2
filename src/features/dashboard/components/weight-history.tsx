"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, getYear, getMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDown, ArrowUp, Minus, History, Search } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface WeightHistoryProps {
    weights: {
        _id: string;
        weight: number;
        date: string;
        difference: number;
        status: string;
    }[];
    isVisible?: boolean;
    className?: string;
}

export function WeightHistory({ weights, isVisible = true, className }: WeightHistoryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<string>("all");
    const [selectedMonth, setSelectedMonth] = useState<string>("all");
    const [selectedWeek, setSelectedWeek] = useState<string>("all");

    const selectTriggerStyles = "h-10 w-full rounded-xl border-primary/20 bg-background focus:ring-2 focus:ring-primary text-foreground font-medium shadow-sm transition-all";
    const selectContentStyles = "w-[var(--radix-select-trigger-width)] rounded-xl border border-primary/20 bg-background shadow-2xl p-1 z-[110] max-h-[160px]";

    const formatValue = (value: number, unit: string) => {
        return isVisible ? `${value} ${unit}` : "••••";
    };

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(weights.map(w => getYear(new Date(w.date)).toString())));
        return uniqueYears.sort((a, b) => b.localeCompare(a));
    }, [weights]);

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

    const weeks = [
        { value: "1", label: "Semana 1 (1-7)" },
        { value: "2", label: "Semana 2 (8-14)" },
        { value: "3", label: "Semana 3 (15-21)" },
        { value: "4", label: "Semana 4 (22-28)" },
        { value: "5", label: "Semana 5 (29+)" },
    ];

    const filteredWeights = useMemo(() => {
        return weights.filter(w => {
            const date = new Date(w.date);
            const dayOfMonth = date.getDate();

            const yearMatch = selectedYear === "all" || getYear(date).toString() === selectedYear;
            const monthMatch = selectedMonth === "all" || getMonth(date).toString() === selectedMonth;

            let weekMatch = true;
            if (selectedWeek !== "all") {
                const weekNum = parseInt(selectedWeek);
                if (weekNum === 1) weekMatch = dayOfMonth >= 1 && dayOfMonth <= 7;
                else if (weekNum === 2) weekMatch = dayOfMonth >= 8 && dayOfMonth <= 14;
                else if (weekNum === 3) weekMatch = dayOfMonth >= 15 && dayOfMonth <= 21;
                else if (weekNum === 4) weekMatch = dayOfMonth >= 22 && dayOfMonth <= 28;
                else if (weekNum === 5) weekMatch = dayOfMonth >= 29;
            }

            return yearMatch && monthMatch && weekMatch;
        });
    }, [weights, selectedYear, selectedMonth, selectedWeek]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "lost":
                return <ArrowDown className="w-4 h-4 text-green-500" />;
            case "gained":
                return <ArrowUp className="w-4 h-4 text-red-500" />;
            default:
                return <Minus className="w-4 h-4 text-blue-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "lost":
                return "Perdeu";
            case "gained":
                return "Ganhou";
            default:
                return "Manteve";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "lost":
                return "bg-green-500/10 text-green-500";
            case "gained":
                return "bg-red-500/10 text-red-500";
            default:
                return "bg-blue-500/10 text-blue-500";
        }
    };

    const WeightEntry = ({ entry }: { entry: any }) => (
        <div
            className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl hover:bg-muted/50 transition-colors group"
        >
            <div className="flex flex-col">
                <span className="font-bold text-lg">{formatValue(entry.weight, "kg")}</span>
                <span className="text-xs text-muted-foreground">
                    {format(new Date(entry.date), "dd 'de' MMMM", { locale: ptBR })}
                </span>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusBg(entry.status)}`}>
                {getStatusIcon(entry.status)}
                <div className="flex flex-col items-end">
                    <span>{getStatusText(entry.status)}</span>
                    {entry.difference !== 0 && (
                        <span className="text-[10px] opacity-80">
                            {formatValue(Math.abs(entry.difference), "kg")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Card className={cn("border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2rem] h-full flex flex-col", className)}>
                <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <span className="p-2 bg-primary/10 rounded-xl">
                            <History className="w-5 h-5 text-primary" />
                        </span>
                        Histórico de Pesagem
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 flex-1">
                        {weights.slice(0, 3).map((entry) => (
                            <WeightEntry key={entry._id} entry={entry} />
                        ))}
                        {weights.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground italic">
                                Nenhuma pesagem registrada.
                            </div>
                        )}
                    </div>

                    {weights.length > 3 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-4 w-full py-3 rounded-xl border border-primary/20 hover:bg-primary/5 transition-colors text-primary font-bold text-sm flex items-center justify-center gap-2"
                        >
                            <History className="w-4 h-4" />
                            Ver Histórico Completo
                        </button>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="sm:max-w-[600px] rounded-[3rem] border border-primary/20 bg-background p-10 h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                >
                    <DialogHeader className="mb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                <History className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black text-primary">Histórico Completo</DialogTitle>
                                <DialogDescription className="text-sm font-medium">Veja toda sua jornada de evolução.</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-3 mb-8">
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
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Semana</span>
                            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                                <SelectTrigger className={selectTriggerStyles}>
                                    <SelectValue placeholder="Semana" />
                                </SelectTrigger>
                                <SelectContent className={selectContentStyles}>
                                    <SelectItem value="all">Todas</SelectItem>
                                    {weeks.map(week => (
                                        <SelectItem key={week.value} value={week.value}>{week.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {filteredWeights.map((entry) => (
                            <WeightEntry key={entry._id} entry={entry} />
                        ))}
                        {filteredWeights.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/10 rounded-3xl border border-dashed border-primary/10">
                                <Search className="w-10 h-10 mb-4 opacity-20" />
                                <p className="italic text-sm">Nenhum registro encontrado para este filtro.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
