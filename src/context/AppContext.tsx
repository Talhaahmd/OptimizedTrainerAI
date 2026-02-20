import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, AppData, DailyStats, Meal, Message, TargetedStats } from '../types';
import { Storage } from '../utils/Storage';
import { format } from 'date-fns';

interface AppContextType {
    user: User | null;
    profile: UserProfile | null;
    dailyStats: Record<string, DailyStats>;
    meals: Record<string, Meal[]>;
    chats: Message[];
    loading: boolean;
    login: (email: string) => Promise<void>;
    signUp: (email: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (profile: UserProfile) => Promise<void>;
    updateDailyStats: (stats: Partial<DailyStats>) => Promise<void>;
    addMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => Promise<void>;
    addChatMessage: (content: string, role: 'user' | 'assistant') => Promise<void>;
    todayKey: string;
    targets: TargetedStats | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const todayKey = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const storedData = await Storage.getData();
        setData(storedData);
        setLoading(false);
    };

    const login = async (email: string) => {
        if (!data) return;
        const user = data.users.find(u => u.email === email);
        if (user) {
            const newData = { ...data, session: { userId: user.id } };
            setData(newData);
            await Storage.saveData(newData);
        }
    };

    const signUp = async (email: string) => {
        if (!data) return;
        const newUser: User = { id: Math.random().toString(36).substr(2, 9), email };
        const newData: AppData = {
            ...data,
            users: [...data.users, newUser],
            session: { userId: newUser.id },
        };
        setData(newData);
        await Storage.saveData(newData);
    };

    const logout = async () => {
        if (!data) return;
        const newData = { ...data, session: null };
        setData(newData);
        await Storage.saveData(newData);
    };

    const updateProfile = async (profile: UserProfile) => {
        if (!data) return;
        const newData = { ...data, profile };
        setData(newData);
        await Storage.saveData(newData);
    };

    const updateDailyStats = async (stats: Partial<DailyStats>) => {
        if (!data) return;
        const currentStats = data.dailyStats[todayKey] || { steps: 0, sleepHours: 0 };
        const newData = {
            ...data,
            dailyStats: {
                ...data.dailyStats,
                [todayKey]: { ...currentStats, ...stats },
            },
        };
        setData(newData);
        await Storage.saveData(newData);
    };

    const addMeal = async (mealData: Omit<Meal, 'id' | 'createdAt'>) => {
        if (!data) return;
        const newMeal: Meal = {
            ...mealData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        const currentMeals = data.meals[todayKey] || [];
        const newData = {
            ...data,
            meals: {
                ...data.meals,
                [todayKey]: [...currentMeals, newMeal],
            },
        };
        setData(newData);
        await Storage.saveData(newData);
    };

    const addChatMessage = async (content: string, role: 'user' | 'assistant') => {
        if (!data) return;
        const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            content,
            role,
            timestamp: new Date().toISOString(),
        };
        const newData = {
            ...data,
            chats: [...data.chats, newMessage],
        };
        setData(newData);
        await Storage.saveData(newData);
    };

    const calculateTargets = (profile: UserProfile | null): TargetedStats | null => {
        if (!profile) return null;

        const weight = parseFloat(profile.weightKg);
        const height = parseFloat(profile.heightCm);
        const age = parseInt(profile.age);

        if (isNaN(weight) || isNaN(height) || isNaN(age)) return null;

        // Mifflin St Jeor
        let bmr = (10 * weight) + (6.25 * height) - (5 * age);
        if (profile.gender === 'M') {
            bmr += 5;
        } else {
            bmr -= 161;
        }

        let calories = 0;
        let protein = 0;
        let steps = 0;

        if (profile.goal === 'Muscle Develop') {
            calories = Math.round(bmr * 1.3 + 300);
            protein = Math.round(weight * 2.2);
            steps = 8000;
        } else {
            calories = Math.round(bmr * 1.2 - 400);
            protein = Math.round(weight * 2.0);
            steps = 10000;
        }

        const fat = Math.round((calories * 0.25) / 9);
        const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

        return {
            calories,
            protein,
            carbs,
            fat,
            steps,
            sleep: 8
        };
    };

    const targets = calculateTargets(data?.profile || null);

    return (
        <AppContext.Provider
            value={{
                user: data?.session ? data.users.find(u => u.id === data.session?.userId) || null : null,
                profile: data?.profile || null,
                dailyStats: data?.dailyStats || {},
                meals: data?.meals || {},
                chats: data?.chats || [],
                loading,
                login,
                signUp,
                logout,
                updateProfile,
                updateDailyStats,
                addMeal,
                addChatMessage,
                todayKey,
                targets,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
