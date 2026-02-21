import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile, DailyStats, Meal, Message, TargetedStats } from '../types';
import { Storage } from '../utils/Storage';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
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
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [dailyStats, setDailyStats] = useState<Record<string, DailyStats>>({});
    const [meals, setMeals] = useState<Record<string, Meal[]>>({});
    const [chats, setChats] = useState<Message[]>([]);
    const [targets, setTargets] = useState<TargetedStats | null>(null);
    const [loading, setLoading] = useState(true);
    const todayKey = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email || '' });
                await loadBackendData();
            } else {
                setUser(null);
                setProfile(null);
                setTargets(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadBackendData = async () => {
        try {
            const data = await api.get('/me');
            if (data.profile) {
                setProfile({
                    fullName: data.profile.full_name || '',
                    age: data.profile.age?.toString() || '',
                    gender: data.profile.gender || 'M',
                    goal: data.profile.goal === 'muscle' ? 'Muscle Develop' : 'Fatloss',
                    heightCm: data.profile.height_cm?.toString() || '',
                    weightKg: data.profile.weight_kg?.toString() || '',
                    goalWeightKg: '', // Backend doesn't store this yet
                });
            }
            if (data.targets) {
                setTargets({
                    calories: data.targets.calories_target,
                    protein: data.targets.protein_g_target,
                    carbs: data.targets.carbs_g_target,
                    fat: data.targets.fat_g_target,
                    steps: data.targets.steps_target,
                    sleep: data.targets.sleep_target_hours,
                });
            }
            if (data.todaySummary) {
                setDailyStats({ [todayKey]: { steps: data.todaySummary.steps, sleepHours: data.todaySummary.sleep_hours } });
            }
        } catch (err) {
            console.error('Failed to load backend data', err);
        }
    };

    const login = async (email: string) => {
        // For simplicity in this demo, we'll assume a password or use OTP
        // Real implementation would need a password field or magic link
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
    };

    const signUp = async (email: string) => {
        const { error } = await supabase.auth.signUp({ email, password: 'temporary-password' });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const updateProfile = async (newProfile: UserProfile) => {
        setProfile(newProfile);
        try {
            const result = await api.post('/profile', {
                full_name: newProfile.fullName,
                age: parseInt(newProfile.age),
                gender: newProfile.gender,
                goal: newProfile.goal === 'Muscle Develop' ? 'muscle' : 'fatloss',
                height_cm: parseInt(newProfile.heightCm),
                weight_kg: parseFloat(newProfile.weightKg),
            });
            if (result.targets) {
                setTargets({
                    calories: result.targets.calories_target,
                    protein: result.targets.protein_g_target,
                    carbs: result.targets.carbs_g_target,
                    fat: result.targets.fat_g_target,
                    steps: result.targets.steps_target,
                    sleep: result.targets.sleep_target_hours,
                });
            }
        } catch (err) {
            console.error('Profile update failed', err);
        }
    };

    const updateDailyStats = async (stats: Partial<DailyStats>) => {
        const current = dailyStats[todayKey] || { steps: 0, sleepHours: 0 };
        const updated = { ...current, ...stats };
        setDailyStats({ ...dailyStats, [todayKey]: updated });

        try {
            if (stats.steps !== undefined) await api.post('/stats/steps', { steps: stats.steps });
            if (stats.sleepHours !== undefined) await api.post('/stats/sleep', { hours: stats.sleepHours });
        } catch (err) {
            console.error('Stats update failed', err);
        }
    };

    const addMeal = async (mealData: Omit<Meal, 'id' | 'createdAt'>) => {
        // Keep local for now, but in a real app, this would hit the backend
        const newMeal: Meal = {
            ...mealData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
        };
        const currentMeals = meals[todayKey] || [];
        setMeals({ ...meals, [todayKey]: [...currentMeals, newMeal] });
    };

    const addChatMessage = async (content: string, role: 'user' | 'assistant') => {
        const newMessage: Message = {
            id: Math.random().toString(36).substr(2, 9),
            content,
            role,
            timestamp: new Date().toISOString(),
        };
        setChats(prev => [...prev, newMessage]);

        if (role === 'user') {
            try {
                const response = await api.post('/chat/message', { message: content });
                if (response.assistantText) {
                    const aiMsg: Message = {
                        id: Math.random().toString(36).substr(2, 9),
                        content: response.assistantText,
                        role: 'assistant',
                        timestamp: new Date().toISOString(),
                    };
                    setChats(prev => [...prev, aiMsg]);
                }
                // Sync latest data returned by AI tool calls
                if (response.todaySummary) {
                    setDailyStats({ [todayKey]: { steps: response.todaySummary.steps, sleepHours: response.todaySummary.sleep_hours } });
                }
                if (response.targets) {
                    setTargets({
                        calories: response.targets.calories_target,
                        protein: response.targets.protein_g_target,
                        carbs: response.targets.carbs_g_target,
                        fat: response.targets.fat_g_target,
                        steps: response.targets.steps_target,
                        sleep: response.targets.sleep_target_hours,
                    });
                }
            } catch (err) {
                console.error('Chat failed', err);
                const errorMsg: Message = {
                    id: 'err',
                    content: "Sorry, I'm having trouble connecting to the brain center. Please check your connection.",
                    role: 'assistant',
                    timestamp: new Date().toISOString(),
                };
                setChats(prev => [...prev, errorMsg]);
            }
        }
    };

    return (
        <AppContext.Provider
            value={{
                user,
                profile,
                dailyStats,
                meals,
                chats,
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
