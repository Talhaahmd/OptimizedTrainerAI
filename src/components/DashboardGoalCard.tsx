import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../constants/Theme';
import { GoalRing } from './GoalRing';
import { Target, Utensils, Zap } from 'lucide-react-native';

interface DashboardGoalCardProps {
    targetCalories: number;
    consumedCalories: number;
    exerciseCalories: number;
}

export const DashboardGoalCard: React.FC<DashboardGoalCardProps> = ({
    targetCalories,
    consumedCalories,
    exerciseCalories,
}) => {
    const remaining = targetCalories - consumedCalories + exerciseCalories;
    const progress = Math.min(consumedCalories / (targetCalories + exerciseCalories), 1);

    return (
        <View style={styles.container}>
            <View style={styles.leftContent}>
                <Text style={styles.title}>Your daily balance</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statRow}>
                        <Target size={16} color={Theme.colors.subtext} />
                        <Text style={styles.statLabel}>Goals</Text>
                        <Text style={styles.statValue}>{targetCalories}</Text>
                    </View>

                    <View style={styles.statRow}>
                        <Utensils size={16} color={Theme.colors.subtext} />
                        <Text style={styles.statLabel}>Food</Text>
                        <Text style={styles.statValue}>{consumedCalories}</Text>
                    </View>

                    <View style={styles.statRow}>
                        <Zap size={16} color={Theme.colors.subtext} />
                        <Text style={styles.statLabel}>Exercise</Text>
                        <Text style={styles.statValue}>{exerciseCalories}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.rightContent}>
                <GoalRing
                    progress={progress}
                    label={remaining.toString()}
                    subLabel="kcal"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.card,
        padding: Theme.spacing.cardPadding,
        flexDirection: 'row',
        minHeight: 180,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadow,
    },
    leftContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    statsContainer: {
        gap: 12,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statLabel: {
        color: Theme.colors.subtext,
        fontSize: 14,
        flex: 1,
    },
    statValue: {
        color: Theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    rightContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 12,
    },
});
