"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, parseLocalDate } from "@/lib/utils";

interface WeightChartProps {
    data: {
        date: string;
        weight: number;
    }[];
    isVisible?: boolean;
    className?: string;
}

export function WeightChart({ data, isVisible = true, className }: WeightChartProps) {
    const chartData = [...data].reverse().map((item) => ({
        ...item,
        date: format(parseLocalDate(item.date), "dd/MM", { locale: ptBR }),
    }));

    return (
        <Card className={cn("border-none shadow-2xl bg-card/50 backdrop-blur-xl rounded-[2rem]", className)}>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <span className="p-2 bg-primary/10 rounded-xl">📈</span>
                    Evolução do Peso
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" strokeOpacity={0.1} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={["dataMin - 5", "dataMax + 5"]}
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background/90 backdrop-blur-md border border-border p-3 rounded-2xl shadow-xl">
                                                <p className="text-sm font-bold text-primary">{payload[0].payload.date}</p>
                                                <p className="text-2xl font-black">{isVisible ? `${payload[0].value} kg` : "••••"}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="var(--primary)"
                                strokeWidth={4}
                                dot={{ fill: "var(--primary)", strokeWidth: 2, r: 4, stroke: "var(--background)" }}
                                activeDot={{ r: 6, strokeWidth: 4, stroke: "var(--background)" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
