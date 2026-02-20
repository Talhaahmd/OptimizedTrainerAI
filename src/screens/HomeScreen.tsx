import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Theme } from '../constants/Theme';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { DashboardGoalCard } from '../components/DashboardGoalCard';
import { ActionCard } from '../components/ActionCard';
import { TargetStatsCard } from '../components/TargetStatsCard';
import { Footprints, Utensils, Zap, Brain } from 'lucide-react-native';

export default function HomeScreen() {
    const { profile, todayKey, dailyStats, meals, targets } = useAppContext();
    const navigation = useNavigation<any>();

    const stats = dailyStats[todayKey] || { steps: 0, sleepHours: 0 };
    const todayMeals = meals[todayKey] || [];
    const consumedCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);

    // Mocked for body comp matching the prompt requirements
    const bodyComp = useMemo(() => ([
        { label: 'Weight', value: `${profile?.weightKg || 75}kg` },
        { label: 'Lean Muscle', value: '32.4kg' },
        { label: 'Fat %', value: '18.2%' },
    ]), [profile]);

    // Mocked for targeted stats matching prompt requirements
    const targetStats = {
        recovery: '82%',
        sleep: '7h 20m',
        strain: '12.4',
        hrv: '64 ms',
        rhr: '58 bpm',
        respiration: '14/m',
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Greeting */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Hi, {profile?.fullName || 'Athlete'}</Text>
                </View>

                {/* Daily Goal Card */}
                <View style={styles.section}>
                    <DashboardGoalCard
                        targetCalories={targets?.calories || 2400}
                        consumedCalories={consumedCalories}
                        exerciseCalories={0} // To be implemented with dynamic tracking
                    />
                </View>

                {/* Action Cards */}
                <View style={styles.section}>
                    <View style={styles.actionGrid}>
                        <ActionCard
                            title="Steps"
                            value={stats.steps.toString()}
                            unit="steps"
                            progress={Math.min(stats.steps / (targets?.steps || 10000), 1)}
                            Icon={Footprints}
                            onPress={() => navigation.navigate('Movement')}
                        />
                        <ActionCard
                            title="Food"
                            value={consumedCalories.toString()}
                            unit="kcal"
                            progress={Math.min(consumedCalories / (targets?.calories || 2400), 1)}
                            Icon={Utensils}
                            onPress={() => navigation.navigate('Nutrition')}
                        />
                    </View>
                </View>

                {/* Body Composition */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Body Composition</Text>
                    <View style={styles.bodyCompCard}>
                        {bodyComp.map((item, index) => (
                            <View
                                key={item.label}
                                style={[
                                    styles.bodyCompCol,
                                    index < bodyComp.length - 1 && styles.divider
                                ]}
                            >
                                <Text style={styles.labelSmall}>{item.label}</Text>
                                <Text style={styles.compValue}>{item.value}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Targeted Stats */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Targeted Stats</Text>
                    <TargetStatsCard stats={targetStats} />
                </View>

                {/* Optimize Me CTA */}
                <View style={[styles.section, { marginBottom: 40 }]}>
                    <TouchableOpacity
                        style={styles.optimizeBtn}
                        onPress={() => navigation.navigate('Optimize')}
                    >
                        <Brain size={24} color={Theme.colors.accent} style={{ marginRight: 12 }} />
                        <Text style={styles.optimizeText}>Optimize me</Text>
                    </TouchableOpacity>
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
        marginBottom: Theme.spacing.sectionGap,
    },
    greeting: {
        color: Theme.colors.text,
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: Theme.spacing.sectionGap,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: Theme.colors.subtext,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: Theme.spacing.gridGap,
    },
    bodyCompCard: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.card,
        padding: Theme.spacing.cardPadding,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadow,
    },
    bodyCompCol: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        borderRightWidth: 1,
        borderRightColor: 'rgba(255,255,255,0.06)',
    },
    labelSmall: {
        fontSize: 10,
        color: Theme.colors.subtext,
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 4,
    },
    compValue: {
        fontSize: 18,
        color: Theme.colors.text,
        fontWeight: '700',
    },
    optimizeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.accent,
        borderRadius: Theme.borderRadius.pill,
        paddingVertical: 16,
        backgroundColor: 'rgba(185, 255, 44, 0.05)',
    },
    optimizeText: {
        color: Theme.colors.accent,
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
