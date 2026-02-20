import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { GoalRing } from './GoalRing';

interface CaloriesCardProps {
    consumed: number;
    target: number;
}

export const CaloriesCard: React.FC<CaloriesCardProps> = ({ consumed, target }) => {
    const remaining = Math.max(target - consumed, 0);
    const progress = Math.min(consumed / target, 1);

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text style={styles.consumedNumber}>{consumed}</Text>
                <Text style={styles.consumedLabel}>Calories consumed</Text>

                <View style={styles.remainingBox}>
                    <Text style={styles.remainingValue}>{remaining} remaining</Text>
                </View>
            </View>

            <View style={styles.right}>
                <GoalRing
                    size={110}
                    strokeWidth={12}
                    progress={progress}
                    label=""
                    subLabel=""
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
        height: 160,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Theme.shadow,
    },
    left: {
        flex: 1,
        justifyContent: 'center',
    },
    consumedNumber: {
        color: Theme.colors.text,
        fontSize: 36,
        fontWeight: '700',
    },
    consumedLabel: {
        color: Theme.colors.subtext,
        fontSize: 14,
        marginTop: 4,
    },
    remainingBox: {
        marginTop: 16,
    },
    remainingValue: {
        color: Theme.colors.accent,
        fontSize: 18,
        fontWeight: '600',
    },
    right: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
