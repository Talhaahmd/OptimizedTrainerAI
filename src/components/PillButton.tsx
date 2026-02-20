import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../constants/Theme';

interface PillButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'secondary';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const PillButton: React.FC<PillButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle
}) => {
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isPrimary && styles.primaryButton,
                isOutline && styles.outlineButton,
                variant === 'secondary' && styles.secondaryButton,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[
                styles.text,
                isPrimary && styles.primaryText,
                isOutline && styles.outlineText,
                textStyle
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: Theme.borderRadius.pill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: Theme.colors.accent,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Theme.colors.accent,
    },
    secondaryButton: {
        backgroundColor: Theme.colors.cardSecondary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    primaryText: {
        color: '#000000',
    },
    outlineText: {
        color: Theme.colors.accent,
    },
});
