import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';
import { Meal } from '../types';
import { format } from 'date-fns';

interface FoodLogTableProps {
    meals: Meal[];
}

export const FoodLogTable: React.FC<FoodLogTableProps> = ({ meals }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Today's Food Log</Text>

            {meals.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No meals logged yet</Text>
                </View>
            ) : (
                <View style={styles.table}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCell, { flex: 0.8 }]}>Time</Text>
                        <Text style={[styles.headerCell, { flex: 1.5 }]}>Food</Text>
                        <Text style={styles.headerCell}>Cal</Text>
                        <Text style={styles.headerCell}>P</Text>
                        <Text style={styles.headerCell}>C</Text>
                        <Text style={styles.headerCell}>F</Text>
                    </View>

                    {meals.map((meal) => (
                        <View key={meal.id} style={styles.row}>
                            <Text style={[styles.cell, { flex: 0.8 }]}>
                                {format(new Date(meal.createdAt), 'HH:mm')}
                            </Text>
                            <Text style={[styles.cell, { flex: 1.5 }]} numberOfLines={1}>
                                {meal.foodName || 'Unknown'}
                            </Text>
                            <Text style={styles.cell}>{meal.calories}</Text>
                            <Text style={styles.cell}>{meal.protein || 0}</Text>
                            <Text style={styles.cell}>{meal.carbs || 0}</Text>
                            <Text style={styles.cell}>{meal.fat || 0}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Theme.spacing.sectionGap,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 20,
        textTransform: 'uppercase',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.card,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    table: {
        gap: 8,
    },
    headerRow: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        marginBottom: 4,
    },
    headerCell: {
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.card,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.04)',
        alignItems: 'center',
    },
    cell: {
        color: Theme.colors.text,
        fontSize: 13,
        flex: 1,
        textAlign: 'center',
    },
});
