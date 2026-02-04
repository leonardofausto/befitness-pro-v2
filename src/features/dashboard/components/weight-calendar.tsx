"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface WeightEntry {
    date: string;
    status: string; // "gained", "lost", "maintained"
}

interface WeightCalendarProps {
    entries: WeightEntry[];
    hydrationEntries?: { date: string; total: number; goal: number }[];
    className?: string;
}

export function WeightCalendar({ entries, hydrationEntries, className }: WeightCalendarProps) {
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        setDate(new Date());
    }, []);

    const getStatusColor = (d: Date) => {
        const dateStr = format(d, "yyyy-MM-dd");
        const entry = entries.find((e) => e.date === dateStr);
        if (!entry) return null;

        switch (entry.status) {
            case "gained": return "status-gain";
            case "lost": return "status-loss";
            case "maintained": return "status-maintain";
            default: return null;
        }
    };

    if (!mounted) {
        return <div className="h-[300px] w-full flex items-center justify-center bg-card/50 rounded-[2rem] animate-pulse">Carregando calendário...</div>;
    }

    return (
        <Card className={cn("border-none shadow-2xl bg-gradient-to-br from-purple-500/20 via-purple-500/5 to-transparent backdrop-blur-xl rounded-[2rem]", className)}>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-purple-500/20 rounded-xl">📅</span>
                    Calendário
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between py-6">
                <div className="flex-1 flex items-center justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        locale={ptBR}
                        className="p-0 border-none scale-110"
                        modifiers={{
                            hasEntry: (d) => !!entries.find(e => e.date === format(d, "yyyy-MM-dd"))
                        }}
                        modifiersClassNames={{
                            hasEntry: "font-bold"
                        }}
                        components={{
                            DayButton: ({ day, modifiers, ...props }: any) => {
                                const statusColor = getStatusColor(day.date);
                                const dateStr = format(day.date, "yyyy-MM-dd");

                                // Group hydration by date
                                const dailyTotal = hydrationEntries
                                    ?.filter((h: { date: string; total: number }) => h.date === dateStr)
                                    .reduce((acc: number, curr: { total: number }) => acc + curr.total, 0) || 0;
                                const goal = hydrationEntries?.find((h: { date: string; goal: number }) => h.date === dateStr)?.goal || (entries[0] ? Math.round(180 * 35) : 2000); // Fallback
                                const isHydrated = dailyTotal >= goal && dailyTotal > 0;

                                return (
                                    <button
                                        {...props}
                                        className={`relative flex h-9 w-9 items-center justify-center p-0 font-medium rounded-full transition-all duration-300 ${statusColor ? `${statusColor} text-white shadow-lg` : "hover:bg-accent hover:text-accent-foreground"}`}
                                    >
                                        <time dateTime={dateStr}>
                                            {format(day.date, "d")}
                                        </time>
                                        {isHydrated && (
                                            <Star className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_2px_rgba(234,179,8,0.5)]" />
                                        )}
                                    </button>
                                );
                            }
                        }}
                    />
                </div>
                <div className="mt-8 flex flex-wrap gap-4 text-[9px] font-bold uppercase tracking-widest justify-center border-t border-border/50 pt-6">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full status-gain shadow-sm" /> <span className="opacity-60">Peso ↑</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full status-loss shadow-sm" /> <span className="opacity-60">Peso ↓</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full status-maintain shadow-sm" /> <span className="opacity-60">Igual</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> <span className="opacity-60 text-yellow-500">Água ✓</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
