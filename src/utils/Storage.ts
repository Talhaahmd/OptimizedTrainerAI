import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, User, UserProfile, DailyStats, Meal, Message } from '../types';

const STORAGE_KEY = '@optimize_me_data';

const INITIAL_DATA: AppData = {
    users: [],
    session: null,
    profile: null,
    dailyStats: {},
    meals: {},
    chats: [],
};

export const Storage = {
    async getData(): Promise<AppData> {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : INITIAL_DATA;
        } catch (e) {
            console.error('Error reading storage', e);
            return INITIAL_DATA;
        }
    },

    async saveData(data: AppData): Promise<void> {
        try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error('Error saving storage', e);
        }
    },

    async clearSession(): Promise<void> {
        const data = await this.getData();
        data.session = null;
        await this.saveData(data);
    },

    async getTodayStats(dateKey: string): Promise<DailyStats> {
        const data = await this.getData();
        return data.dailyStats[dateKey] || { steps: 0, sleepHours: 0 };
    },

    async saveDailyStats(dateKey: string, stats: Partial<DailyStats>): Promise<void> {
        const data = await this.getData();
        const currentStats = data.dailyStats[dateKey] || { steps: 0, sleepHours: 0 };
        data.dailyStats[dateKey] = { ...currentStats, ...stats };
        await this.saveData(data);
    },

    async addMeal(dateKey: string, meal: Meal): Promise<void> {
        const data = await this.getData();
        if (!data.meals[dateKey]) {
            data.meals[dateKey] = [];
        }
        data.meals[dateKey].push(meal);
        await this.saveData(data);
    },

    async getMeals(dateKey: string): Promise<Meal[]> {
        const data = await this.getData();
        return data.meals[dateKey] || [];
    },

    async addChatMessage(message: Message): Promise<void> {
        const data = await this.getData();
        data.chats.push(message);
        await this.saveData(data);
    }
};
