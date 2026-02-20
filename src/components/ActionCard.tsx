import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated as RNAnimated } from 'react-native';
import { Theme } from '../constants/Theme';
import { LucideIcon } from 'lucide-react-native';

interface ActionCardProps {
    title: string;
    value: string;
    unit: string;
    progress: number; // 0 to 1
    Icon: LucideIcon;
    onPress?: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
    title,
    value,
    unit,
    progress,
    Icon,
    onPress,
}) => {
    const scale = new RNAnimated.Value(1);

    const handlePressIn = () => {
        RNAnimated.spring(scale, {
            toValue: 0.97,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        RNAnimated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={styles.wrapper}
        >
            <RNAnimated.View style={[styles.container, { transform: [{ scale }] }]}>
                <View style={styles.header}>
                    <Icon size={20} color={Theme.colors.accent} />
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.statContainer}>
                    <Text style={styles.value}>{value}</Text>
                    <Text style={styles.unit}>{unit}</Text>
                </View>

                <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
            </RNAnimated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.card,
        padding: 16,
        height: 110,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        justifyContent: 'space-between',
        ...Theme.shadow,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        color: Theme.colors.subtext,
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    statContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    value: {
        color: Theme.colors.text,
        fontSize: 34,
        fontWeight: '700',
    },
    unit: {
        color: Theme.colors.subtext,
        fontSize: 12,
    },
    progressBg: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 3,
        width: '100%',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Theme.colors.accent,
        borderRadius: 3,
    },
});
