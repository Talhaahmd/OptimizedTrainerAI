import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../constants/Theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'primary', style }) => {
    return (
        <View style={[
            styles.card,
            variant === 'secondary' ? styles.secondary : styles.primary,
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Theme.borderRadius.lg,
        padding: Theme.spacing.md,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    primary: {
        backgroundColor: Theme.colors.card,
    },
    secondary: {
        backgroundColor: Theme.colors.cardSecondary,
    },
});
