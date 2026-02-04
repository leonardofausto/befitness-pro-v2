"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface WeightEntry {
    date: string;
    status: string; // "gained", "lost", "maintained"
}

interface WeightCalendarProps {
    entries: WeightEntry[];
    className?: string;
}

export function WeightCalendar({ entries, className }: WeightCalendarProps) {
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
        <Card className={cn("border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2rem]", className)}>
            <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-xl">📅</span>
                    Calendário de Peso
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
                                return (
                                    <button
                                        {...props}
                                        className={`relative flex h-9 w-9 items-center justify-center p-0 font-medium rounded-full transition-all duration-300 ${statusColor ? `${statusColor} text-white shadow-lg` : "hover:bg-accent hover:text-accent-foreground"}`}
                                    >
                                        <time dateTime={format(day.date, "yyyy-MM-dd")}>
                                            {format(day.date, "d")}
                                        </time>
                                    </button>
                                );
                            }
                        }}
                    />
                </div>
                <div className="mt-8 flex gap-6 text-[10px] font-bold uppercase tracking-widest justify-center border-t border-border/50 pt-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full status-gain shadow-sm" /> <span className="text-muted-foreground">Ganhou</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full status-loss shadow-sm" /> <span className="text-muted-foreground">Perdeu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full status-maintain shadow-sm" /> <span className="text-muted-foreground">Manteve</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
