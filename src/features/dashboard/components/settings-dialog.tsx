"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Sun, Monitor, Bell, Volume2, Eye, Trash2, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/lib/store";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { playSound } from "@/lib/sounds";
import { useUser } from "@clerk/nextjs";

const MySwal = withReactContent(Swal);

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();
    const {
        isValuesVisible, setIsValuesVisible,
        isSoundEnabled, setIsSoundEnabled,
        isNotificationsEnabled, setIsNotificationsEnabled
    } = useAppStore();
    const [isResetting, setIsResetting] = useState(false);
    const resetData = useMutation(api.profiles.resetUserData);

    const handleReset = async () => {
        const result = await MySwal.fire({
            title: "Tem certeza?",
            text: "Isso irá deletar permanentemente todo o seu histórico de peso e perfil. Você não poderá desfazer essa ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sim, deletar tudo!",
            cancelButtonText: "Cancelar",
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
            target: '#settings-modal-content',
            customClass: {
                popup: 'rounded-[2rem] border border-primary/20 shadow-2xl',
                confirmButton: 'rounded-xl font-bold px-6 py-3',
                cancelButton: 'rounded-xl font-bold px-6 py-3',
            }
        });

        if (result.isConfirmed) {
            setIsResetting(true);
            try {
                if (user?.id) {
                    await resetData({ userId: user.id });
                    await MySwal.fire({
                        title: "Dados Resetados!",
                        text: "Sua conta foi limpa com sucesso. Vamos configurar seu perfil novamente.",
                        icon: "success",
                        background: theme === 'dark' ? '#1f2937' : '#fff',
                        color: theme === 'dark' ? '#fff' : '#000',
                        customClass: {
                            popup: 'rounded-[2rem] border border-primary/20 shadow-2xl',
                        }
                    });
                    window.location.reload();
                }
            } catch (error) {
                console.error(error);
                MySwal.fire("Erro!", "Ocorreu um erro ao resetar seus dados.", "error");
            } finally {
                setIsResetting(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                id="settings-modal-content"
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[700px] rounded-[3rem] border border-primary/20 shadow-2xl bg-background p-10 max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent hover:scrollbar-thumb-primary/20"
            >
                <DialogHeader className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                            <Settings className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-3xl font-black tracking-tight text-primary">Configurações</DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-muted-foreground/80">Customize sua experiência no beFitness PRO.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-8">
                    {/* Theme Section */}
                    <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Tema do Sistema</Label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'light', icon: Sun, label: 'Claro' },
                                { id: 'dark', icon: Moon, label: 'Escuro' },
                                { id: 'system', icon: Monitor, label: 'Sistema' }
                            ].map((t) => (
                                <Button
                                    key={t.id}
                                    variant={theme === t.id ? "default" : "outline"}
                                    onClick={() => {
                                        playSound('CLICK');
                                        setTheme(t.id);
                                    }}
                                    className={`h-14 flex flex-col gap-1 rounded-2xl border-primary/10 transition-all ${theme === t.id ? 'bg-primary shadow-lg shadow-primary/20 border-none' : 'hover:bg-primary/5 hover:border-primary/30'}`}
                                >
                                    <t.icon className={`w-4 h-4 ${theme === t.id ? 'text-white' : 'text-primary'}`} />
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${theme === t.id ? 'text-white/90' : 'text-muted-foreground'}`}>{t.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-sm font-black uppercase tracking-widest opacity-60 ml-1">Preferências</Label>
                        <div className="bg-muted/30 rounded-[2rem] p-4 border border-primary/5 space-y-2">
                            <div className="flex items-center justify-between p-1.5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg shadow-sm">
                                        <Eye className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold">Esconder Valores</p>
                                        <p className="text-[9px] text-muted-foreground">Ocultar pesos e calorias no dashboard</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={!isValuesVisible}
                                    onCheckedChange={(val) => {
                                        playSound('CLICK');
                                        setIsValuesVisible(!val);
                                    }}
                                    className="scale-90"
                                />
                            </div>

                            <div className="flex items-center justify-between p-1.5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg shadow-sm">
                                        <Volume2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold">Efeitos Sonoros</p>
                                        <p className="text-[9px] text-muted-foreground">Sons ao registrar peso e interações</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={isSoundEnabled}
                                    onCheckedChange={(val) => {
                                        // Sound enabled is set AFTER playing the click sound if it was already enabled
                                        // or we play it anyway to show it's enabled now.
                                        setIsSoundEnabled(val);
                                        if (val) playSound('CLICK');
                                    }}
                                    className="scale-90"
                                />
                            </div>

                            <div className="flex items-center justify-between p-1.5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-lg shadow-sm">
                                        <Bell className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold">Notificações Push</p>
                                        <p className="text-[9px] text-muted-foreground">Lembretes diários para pesagem</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={isNotificationsEnabled}
                                    onCheckedChange={(val) => {
                                        playSound('CLICK');
                                        setIsNotificationsEnabled(val);
                                    }}
                                    className="scale-90"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="space-y-4 pt-4">
                        <Label className="text-sm font-black uppercase tracking-widest text-destructive opacity-80 ml-1">Zona Crítica</Label>
                        <div className="bg-destructive/5 rounded-[2.5rem] p-6 border border-destructive/20 group hover:bg-destructive/10 transition-all duration-300">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black text-destructive uppercase tracking-tight">Resetar Todos os Dados</h4>
                                    <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">Esta ação é irreversível. Todas as suas pesagens, metas e informações de perfil serão apagadas permanentemente.</p>
                                </div>
                                <Button
                                    variant="destructive"
                                    onClick={handleReset}
                                    disabled={isResetting}
                                    className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-destructive/20 active:scale-[0.98] transition-all"
                                >
                                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                    Apagar Minha Jornada
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
