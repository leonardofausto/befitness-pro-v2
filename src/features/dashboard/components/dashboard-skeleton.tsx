"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            {/* Header Skeleton */}
            <header className="flex justify-between items-center max-w-7xl mx-auto mb-12">
                <Skeleton className="h-8 w-40 rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {/* Title Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-64 md:w-96 rounded-2xl" />
                        <Skeleton className="h-6 w-48 rounded-xl" />
                    </div>
                    <Skeleton className="h-12 w-40 rounded-2xl" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="border-none shadow-2xl bg-muted/20 rounded-[2.5rem] p-6">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 p-0 space-y-0">
                                <Skeleton className="h-4 w-24 rounded-full" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </CardHeader>
                            <CardContent className="p-0 mt-4 space-y-2">
                                <Skeleton className="h-10 w-32 rounded-2xl" />
                                <Skeleton className="h-4 w-40 rounded-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chart Skeleton */}
                    <Card className="lg:col-span-2 h-[450px] border-none shadow-2xl bg-muted/20 rounded-[2rem] p-8">
                        <Skeleton className="h-6 w-40 mb-8 rounded-full" />
                        <Skeleton className="h-[300px] w-full rounded-2xl" />
                    </Card>

                    {/* History Skeleton */}
                    <Card className="h-[450px] border-none shadow-2xl bg-muted/20 rounded-[2rem] p-8">
                        <Skeleton className="h-6 w-40 mb-8 rounded-full" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                            ))}
                        </div>
                    </Card>

                    {/* Hydration Skeleton */}
                    <Card className="h-[400px] border-none shadow-2xl bg-muted/20 rounded-[2rem] p-8">
                        <Skeleton className="h-6 w-32 mb-8 rounded-full" />
                        <div className="flex flex-col items-center gap-6">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <Skeleton className="h-8 w-40 rounded-xl" />
                        </div>
                    </Card>

                    {/* Calendar Skeleton */}
                    <Card className="h-[400px] border-none shadow-2xl bg-muted/20 rounded-[2rem] p-8">
                        <Skeleton className="h-6 w-32 mb-8 rounded-full" />
                        <Skeleton className="h-[250px] w-full rounded-2xl" />
                    </Card>

                    {/* Target Skeleton */}
                    <Card className="h-[400px] border-none shadow-2xl bg-muted/20 rounded-[2rem] p-8">
                        <Skeleton className="h-6 w-40 mb-8 rounded-full" />
                        <div className="space-y-6">
                            <div className="flex justify-between">
                                <Skeleton className="h-12 w-24 rounded-xl" />
                                <Skeleton className="h-12 w-24 rounded-xl" />
                            </div>
                            <Skeleton className="h-4 w-full rounded-full" />
                            <Skeleton className="h-[100px] w-full rounded-2xl" />
                        </div>
                    </Card>
                </div>
            </div>
        </main>
    );
}
