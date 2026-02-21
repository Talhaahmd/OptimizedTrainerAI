import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Theme } from '../constants/Theme';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { BackButton } from '../components/BackButton';
import { CaloriesCard } from '../components/CaloriesCard';
import { MacroCard } from '../components/MacroCard';
import { FoodLogTable } from '../components/FoodLogTable';
import { NutritionReviewCard } from '../components/NutritionReviewCard';
import { useNavigation } from '@react-navigation/native';

export default function NutritionScreen() {
    const { todayKey, meals, targets } = useAppContext();
    const navigation = useNavigation<any>();

    const todayMeals = meals[todayKey] || [];
    const eatenCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const dailyTarget = targets?.calories || 2400;

    // Aggregate macros for the breakdown card
    const currentMacros = todayMeals.reduce((acc, m) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
    }), { protein: 0, carbs: 0, fat: 0 });

    const macroTargets = {
        protein: targets?.protein || 180,
        carbs: targets?.carbs || 250,
        fat: targets?.fat || 70,
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.title}>Nutrition</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* SECTION 1 — PRIMARY ACTION BUTTON */}
                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.logBtn}
                        onPress={() => navigation.navigate('Optimize')}
                    >
                        <Text style={styles.logBtnText}>Log my meal via AI Chat</Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION 2 — CALORIES STATUS CARD */}
                <View style={styles.section}>
                    <CaloriesCard consumed={eatenCalories} target={dailyTarget} />
                </View>

                {/* SECTION 3 — MACRONUTRIENT BREAKDOWN */}
                <View style={styles.section}>
                    <MacroCard macros={currentMacros} targets={macroTargets} />
                </View>

                {/* SECTION 4 — FOOD LOG TABLE */}
                <View style={styles.section}>
                    <FoodLogTable meals={todayMeals} />
                </View>

                {/* SECTION 5 — AI FOOD REVIEW */}
                <View style={styles.section}>
                    <NutritionReviewCard
                        score={78}
                        summary="You are currently under your protein target and slightly below your calorie goal. I'll help you optimize your next meal in the chat."
                        findings={[
                            "Protein intake below target",
                            "Calories within optimal range",
                            "Fat intake balanced",
                            "Carbohydrates slightly low"
                        ]}
                        recommendations={[
                            "Ask me for a high-protein recipe in chat",
                            "Add 40g protein to your next meal",
                            "Maintain calorie intake within 2400 kcal",
                            "Avoid increasing fat intake further today"
                        ]}
                        alignment="On Track"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        paddingHorizontal: Theme.spacing.screenPadding,
        paddingTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sectionGap,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 28,
    },
    logBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: Theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    logBtnText: {
        color: Theme.colors.accent,
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
