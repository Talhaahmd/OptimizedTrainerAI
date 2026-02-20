import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
    title: string;
    value: string;
    unit?: string;
    icon?: LucideIcon;
    onPress?: () => void;
    style?: ViewStyle;
    large?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    unit,
    icon: Icon,
    onPress,
    style,
    large = false
}) => {
    const CardContent = (
        <View style={[styles.card, large && styles.largeCard, style]}>
            <View style={styles.header}>
                {Icon && <Icon size={20} color={Theme.colors.accent} />}
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.value, large && styles.largeValue]}>{value}</Text>
                {unit && <Text style={styles.unit}>{unit}</Text>}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        minHeight: 100,
    },
    largeCard: {
        minHeight: 160,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Theme.spacing.sm,
    },
    title: {
        color: Theme.colors.subtext,
        fontSize: 14,
        fontWeight: '500',
        marginLeft: Theme.spacing.xs,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    value: {
        color: Theme.colors.text,
        fontSize: 32,
        fontWeight: '800',
    },
    largeValue: {
        fontSize: 42,
    },
    unit: {
        color: Theme.colors.subtext,
        fontSize: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
        fontWeight: '700',
    },
});
