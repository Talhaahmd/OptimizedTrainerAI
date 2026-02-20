import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

interface MacroItemProps {
    label: string;
    value: number;
    target: number;
}

const MacroItem: React.FC<MacroItemProps> = ({ label, value, target }) => {
    const progress = Math.min(value / target, 1);
    return (
        <View style={styles.item}>
            <Text style={styles.value}>{value}g</Text>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
            </View>
        </View>
    );
};

interface MacroCardProps {
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    targets: {
        protein: number;
        carbs: number;
        fat: number;
    };
}

export const MacroCard: React.FC<MacroCardProps> = ({ macros, targets }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Macronutrient breakdown</Text>
            <View style={styles.grid}>
                <MacroItem label="Protein" value={macros.protein} target={targets.protein} />
                <MacroItem label="Carbs" value={macros.carbs} target={targets.carbs} />
                <MacroItem label="Fat" value={macros.fat} target={targets.fat} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.card,
        padding: Theme.spacing.cardPadding,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        marginTop: Theme.spacing.gridGap,
        ...Theme.shadow,
    },
    title: {
        color: Theme.colors.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    item: {
        flex: 1,
    },
    value: {
        color: Theme.colors.text,
        fontSize: 20,
        fontWeight: '700',
    },
    label: {
        color: Theme.colors.subtext,
        fontSize: 12,
        marginBottom: 8,
    },
    barBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 3,
    },
    barFill: {
        height: '100%',
        backgroundColor: Theme.colors.accent,
        borderRadius: 3,
    },
});
