import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="grid place-items-center min-h-screen bg-background p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
            <div className="w-full max-w-[420px] space-y-8 flex flex-col items-center">
                <div className="text-center space-y-2 w-full">
                    <h1 className="text-5xl font-black tracking-tight text-primary">
                        beFitness <span className="text-foreground">PRO</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Bem-vindo de volta! Faça login para continuar.</p>
                </div>
                <div className="w-full flex justify-center">
                    <SignIn
                        appearance={{
                            layout: {
                                socialButtonsPlacement: "top",
                                socialButtonsVariant: "blockButton",
                            },
                            elements: {
                                rootBox: "w-full flex justify-center",
                                card: 'border-none shadow-2xl bg-card/60 backdrop-blur-2xl rounded-3xl w-full m-0',
                                cardBox: "w-full",
                                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm normal-case h-12 rounded-2xl',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                socialButtons: 'flex flex-row gap-4 w-full justify-center',
                                socialButtonsBlockButton: 'flex flex-row items-center justify-center gap-2 rounded-2xl border-border hover:bg-accent h-12 transition-all flex-1 min-w-0',
                                socialButtonsBlockButtonText: 'text-[10px] font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden',
                                formFieldInput: 'rounded-2xl border-border bg-background/50 h-12 focus:ring-2 focus:ring-primary',
                                footerActionLink: 'text-primary hover:text-primary/90 font-bold',
                                identityPreviewText: 'text-foreground',
                                identityPreviewEditButtonIcon: 'text-primary'
                            }
                        }}
                        path="/login"
                    />
                </div>
            </div>
        </div>
    );
}
