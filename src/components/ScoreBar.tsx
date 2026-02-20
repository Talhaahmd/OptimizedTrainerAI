import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme } from '../constants/Theme';

interface ScoreBarProps {
    score: number;
    max?: number;
    label?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ score, max = 100, label }) => {
    const percentage = Math.min(Math.max((score / max) * 100, 0), 100);

    let color = Theme.colors.error;
    if (score >= 75) {
        color = Theme.colors.accent;
    } else if (score >= 50) {
        color = '#FFD700'; // Yellow
    }

    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.labelRow}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.score}>{score} / {max}</Text>
                </View>
            )}
            <View style={styles.barBg}>
                <View
                    style={[
                        styles.barFill,
                        { width: `${percentage}%`, backgroundColor: color }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        color: Theme.colors.subtext,
        fontSize: 14,
        fontWeight: '600',
    },
    score: {
        color: Theme.colors.text,
        fontSize: 14,
        fontWeight: '700',
    },
    barBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
});
