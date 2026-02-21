export interface ProfileData {
    weight_kg: number;
    height_cm: number;
    age: number;
    gender: 'M' | 'F';
    goal: 'muscle' | 'fatloss';
}

export interface CalculatedTargets {
    steps_target: number;
    sleep_target_hours: number;
    calories_target: number;
    protein_g_target: number;
    carbs_g_target: number;
    fat_g_target: number;
    method: string;
}

export function calculateTargets(profile: ProfileData): CalculatedTargets {
    const { weight_kg, height_cm, age, gender, goal } = profile;

    // 1. Mifflin-St Jeor BMR
    let bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age;
    if (gender === 'M') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    // 2. Calories Target
    let calories_target: number;
    if (goal === 'muscle') {
        calories_target = Math.round(bmr * 1.3 + 300);
    } else {
        calories_target = Math.round(bmr * 1.2 - 400);
    }

    // 3. Protein Target
    let protein_g_target: number;
    if (goal === 'muscle') {
        protein_g_target = Math.round(weight_kg * 2.2);
    } else {
        protein_g_target = Math.round(weight_kg * 2.0);
    }

    // 4. Fat Target (25% of calories / 9)
    const fat_g_target = Math.round((calories_target * 0.25) / 9);

    // 5. Carbs Target (remaining calories)
    const protein_calories = protein_g_target * 4;
    const fat_calories = fat_g_target * 9;
    const carbs_g_target = Math.round((calories_target - protein_calories - fat_calories) / 4);

    // 6. Steps Target
    const steps_target = goal === 'muscle' ? 8000 : 10000;

    // 7. Sleep Target
    const sleep_target_hours = 8.0;

    return {
        steps_target,
        sleep_target_hours,
        calories_target,
        protein_g_target,
        carbs_g_target,
        fat_g_target,
        method: 'mifflin_st_jeor_v1',
    };
}
