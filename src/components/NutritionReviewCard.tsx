import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { ScoreBar } from './ScoreBar';

interface NutritionReviewCardProps {
    score: number;
    summary: string;
    findings: string[];
    recommendations: string[];
    alignment: 'On Track' | 'Needs Improvement' | 'Off Track';
}

export const NutritionReviewCard: React.FC<NutritionReviewCardProps> = ({
    score,
    summary,
    findings,
    recommendations,
    alignment
}) => {
    const getAlignmentColor = () => {
        switch (alignment) {
            case 'On Track': return Theme.colors.accent;
            case 'Needs Improvement': return '#FFD700'; // Yellow
            case 'Off Track': return Theme.colors.error;
            default: return Theme.colors.subtext;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AI Nutrition Review</Text>

            {/* Subsection A: Health Score */}
            <View style={styles.section}>
                <ScoreBar score={score} label="Nutrition score" />
            </View>

            {/* Subsection B: Analysis Summary */}
            <View style={styles.section}>
                <Text style={styles.summaryText}>{summary}</Text>
            </View>

            {/* Subsection C: Key Findings */}
            <View style={styles.section}>
                {findings.map((item, index) => (
                    <Text key={index} style={styles.bulletItem}>• {item}</Text>
                ))}
            </View>

            {/* Subsection D: Actionable Recommendations */}
            <View style={styles.section}>
                <Text style={styles.subTitle}>What to do next</Text>
                {recommendations.map((item, index) => (
                    <View key={index} style={styles.recommendationBox}>
                        <Text style={styles.bulletItem}>• {item}</Text>
                    </View>
                ))}
            </View>

            {/* Subsection E: Goal Alignment */}
            <View style={styles.footer}>
                <Text style={styles.footerLabel}>Goal alignment</Text>
                <View style={[styles.badge, { backgroundColor: `${getAlignmentColor()}20`, borderColor: getAlignmentColor() }]}>
                    <Text style={[styles.badgeText, { color: getAlignmentColor() }]}>{alignment}</Text>
                </View>
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
        ...Theme.shadow,
        marginBottom: 40,
    },
    title: {
        color: Theme.colors.text,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 20,
    },
    summaryText: {
        color: '#9CA3AF',
        fontSize: 14,
        lineHeight: 20,
    },
    bulletItem: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 6,
    },
    subTitle: {
        color: Theme.colors.text,
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 12,
    },
    recommendationBox: {
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
    },
    footerLabel: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
    },
});
