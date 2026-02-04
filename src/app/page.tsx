"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { OnboardingWizard } from "@/features/onboarding/components/wizard";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { WeightCalendar } from "@/features/dashboard/components/weight-calendar";
import { AddWeightDialog } from "@/features/dashboard/components/add-weight-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User as UserIcon, Loader2, Target, TrendingUp, Settings, Moon, Sun, Monitor, Eye, EyeOff } from "lucide-react";
import { WeightChart } from "@/features/dashboard/components/weight-chart";
import { WeightHistory } from "@/features/dashboard/components/weight-history";
import { EditProfileDialog } from "@/features/dashboard/components/edit-profile-dialog";
import { SettingsDialog } from "@/features/dashboard/components/settings-dialog";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAppStore } from "@/lib/store";

import { playSound } from "@/lib/sounds";

const MOTIVATIONAL_QUOTES = [
  { text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.", author: "Robert Collier" },
  { text: "Sua única competição é quem você foi ontem.", author: "Anônimo" },
  { text: "Não pare até se orgulhar.", author: "Anônimo" },
  { text: "A disciplina é a ponte entre metas e realizações.", author: "Jim Rohn" },
  { text: "Cuide do seu corpo, é o único lugar que você tem para viver.", author: "Jim Rohn" },
  { text: "Grandes coisas nunca vêm de zonas de conforto.", author: "Anônimo" },
  { text: "Seja mais forte que sua melhor desculpa.", author: "Anônimo" },
  { text: "O corpo alcança o que a mente acredita.", author: "Anônimo" },
  { text: "A saúde não é sobre o peso que você perde, mas sobre a vida que você ganha.", author: "Anônimo" },
  { text: "Não é sobre ter tempo, é sobre fazer tempo.", author: "Anônimo" },
  { text: "O segredo de progredir é começar.", author: "Mark Twain" },
  { text: "A persistência é o caminho do êxito.", author: "Charles Chaplin" },
  { text: "Motivação é o que faz você começar. Hábito é o que faz você continuar.", author: "Jim Ryun" },
  { text: "Transforme sua dor em poder.", author: "Anônimo" },
  { text: "Cada gota de suor é um passo para sua meta.", author: "Anônimo" },
  { text: "Dê o seu melhor todos os dias, mesmo que o seu melhor mude a cada dia.", author: "Anônimo" },
  { text: "Você não precisa ser ótimo para começar, mas precisa começar para ser ótimo.", author: "Joe Sabah" },
  { text: "A força de vontade é como um músculo: quanto mais você usa, mais forte ela fica.", author: "Anônimo" },
  { text: "Seja a sua própria inspiração.", author: "Anônimo" },
  { text: "A jornada de mil milhas começa com um único passo.", author: "Lao Tzu" }
];

export default function Home() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isValuesVisible, setIsValuesVisible } = useAppStore();
  const [currentQuote, setCurrentQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  useEffect(() => {
    // Pick a truly random quote on mount
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setCurrentQuote(MOTIVATIONAL_QUOTES[randomIndex]);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real profile query
  const profile = useQuery(api.profiles.getProfile, user ? { userId: user.id } : "skip");
  const weights = useQuery(api.weights.getWeights, user ? { userId: user.id } : "skip");

  const isLoaded = isUserLoaded && profile !== undefined;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If profile doesn't exist or wizard isn't completed
  if (!profile || !profile.isWizardCompleted) {
    return (
      <main className="min-h-screen bg-background p-4 md:p-8">
        <header className="flex justify-between items-center max-w-7xl mx-auto mb-8">
          <h1 className="text-2xl font-bold text-primary">beFitness PRO</h1>
          <div className="flex items-center gap-2">
            {mounted && (
              <>
                <Button variant="ghost" size="icon" onClick={() => signOut()} className="h-10 w-10 rounded-xl hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-5 w-5 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </header>
        <OnboardingWizard onComplete={() => window.location.reload()} />
      </main>
    );
  }

  const latestWeight = weights?.[0];
  const currentWeight = latestWeight?.weight ?? profile.initialWeight;
  const currentBMI = latestWeight?.bmi ?? 0;
  const currentCalories = latestWeight?.calories ?? 0;

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 text-foreground transition-colors duration-300 relative">


      <header className="flex justify-between items-center max-w-7xl mx-auto mb-12 relative z-50">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary tracking-tighter">beFitness PRO</h1>
        </div>
        <div className="flex items-center gap-2">
          {mounted && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditProfileOpen(true)}
                className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors"
                title="Editar Perfil"
              >
                <UserIcon className="h-5 w-5 text-primary" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  playSound('CLICK');
                  setIsSettingsOpen(true);
                }}
                className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors"
                title="Configurações"
              >
                <Settings className="h-5 w-5 text-primary" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="h-10 w-10 rounded-xl hover:bg-destructive/10 transition-colors"
                title="Sair"
              >
                <LogOut className="h-5 w-5 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Olá, {profile.name}! 👋</h2>
            <p className="text-muted-foreground mt-2 text-xl font-medium">Aqui está seu progresso de hoje.</p>
          </div>
          <AddWeightDialog />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCards
            weight={currentWeight}
            bmi={currentBMI}
            calories={currentCalories}
            height={profile.height}
            targetWeight={profile.targetWeight}
            objective={profile.goal as any}
            isVisible={isValuesVisible}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Linha 1: Gráfico + Meu Objetivo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <WeightChart data={weights ?? []} isVisible={isValuesVisible} className="h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full border-none shadow-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent backdrop-blur-xl rounded-[2rem] p-8 overflow-hidden relative group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-xl">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg font-bold uppercase tracking-widest opacity-60">Meu Objetivo</span>
                  </div>
                  <span className="text-3xl font-black text-primary">
                    {isValuesVisible ? `${Math.round(Math.abs((profile.initialWeight - currentWeight) / (profile.initialWeight - profile.targetWeight)) * 100) || 0}%` : "••%"}
                  </span>
                </div>

                <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden mb-8">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round(Math.abs((profile.initialWeight - currentWeight) / (profile.initialWeight - profile.targetWeight)) * 100) || 0)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(103,80,164,0.5)]"
                  />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-sm font-medium opacity-60">Peso Meta</p>
                      <p className="text-4xl font-black">{isValuesVisible ? `${profile.targetWeight} kg` : "••••"}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium opacity-60">Diferença</p>
                      <div className="flex items-center gap-2 text-2xl font-bold">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span>{isValuesVisible ? `${Math.abs(currentWeight - profile.targetWeight).toFixed(1)} kg` : "••••"}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-8 text-sm bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-white/5 font-medium italic relative">
                    <span className="text-primary text-xl absolute -top-2 -left-1 opacity-50">"</span>
                    {currentQuote.text}
                    {currentQuote.author && (
                      <span className="block text-[10px] mt-2 text-muted-foreground not-italic">— {currentQuote.author}</span>
                    )}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Linha 2: Calendário + Histórico */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <WeightCalendar entries={weights ?? []} className="h-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <WeightHistory
              weights={weights ?? []}
              isVisible={isValuesVisible}
              className="h-full"
            />
          </motion.div>
        </div>
      </div>

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        initialData={profile}
        currentWeight={currentWeight}
      />

      <SettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </main>
  );
}
