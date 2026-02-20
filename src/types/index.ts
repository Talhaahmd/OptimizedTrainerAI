export interface User {
    id: string;
    email: string;
    password?: string;
}

export interface UserProfile {
    fullName: string;
    age: string;
    gender: 'M' | 'F';
    goal: 'Muscle Develop' | 'Fatloss';
    heightCm: string;
    weightKg: string;
    goalWeightKg: string;
}

export interface DailyStats {
    steps: number;
    sleepHours: number;
}

export interface Meal {
    id: string;
    photoUri: string;
    foodName?: string;
    createdAt: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface TargetedStats {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    steps: number;
    sleep: number;
}

export interface AppData {
    users: User[];
    session: { userId: string } | null;
    profile: UserProfile | null;
    dailyStats: Record<string, DailyStats>; // Key: YYYY-MM-DD
    meals: Record<string, Meal[]>; // Key: YYYY-MM-DD
    chats: Message[];
}
