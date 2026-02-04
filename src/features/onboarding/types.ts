import { z } from "zod";

export const onboardingSchema = z.object({
    // Step 1
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    age: z.coerce.number().min(1, "Idade inválida").max(120),
    gender: z.enum(["male", "female", "other"]),
    weight: z.coerce.number().min(20, "Peso muito baixo").max(500, "Peso muito alto"),
    weightDate: z.string().min(1, "Data é obrigatória"),
    height: z.coerce.number().min(50, "Altura muito baixa").max(250, "Altura muito alta"),

    // Step 2
    activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extra_active"]),
    goal: z.enum(["lose", "maintain", "gain"]),
    targetWeight: z.coerce.number().min(20).max(500),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
