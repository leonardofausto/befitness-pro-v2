export function calculateBMI(weight: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return parseFloat((weight / (heightM * heightM)).toFixed(2));
}

export function calculateTDEE(
    weight: number,
    heightCm: number,
    age: number,
    gender: string,
    activityLevel: string
): number {
    // Mifflin-St Jeor Equation
    let bmr = 10 * weight + 6.25 * heightCm - 5 * age;
    if (gender === "male") {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    const activityMultipliers: Record<string, number> = {
        sedentary: 1.2,
        lightly_active: 1.375,
        moderately_active: 1.55,
        very_active: 1.725,
        extra_active: 1.9,
    };

    const multiplier = activityMultipliers[activityLevel] || 1.2;
    return Math.round(bmr * multiplier);
}
