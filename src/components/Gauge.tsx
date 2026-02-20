import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Theme } from '../constants/Theme';

interface GaugeProps {
    value: number;
    max: number;
    label: string;
    subLabel?: string;
    size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({
    value,
    max,
    label,
    subLabel,
    size = 200
}) => {
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI; // Semicircle
    const progress = Math.min(value / max, 1);
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <View style={{ width: size, height: size / 1.5, alignItems: 'center' }}>
            <Svg width={size} height={size}>
                {/* Background Arc */}
                <Path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    stroke={Theme.colors.cardSecondary}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Progress Arc */}
                <Path
                    d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
                    stroke={Theme.colors.accent}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                />
            </Svg>
            <View style={[styles.textContainer, { top: size / 4 }]}>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.label}>{label}</Text>
                {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        color: Theme.colors.text,
        fontSize: 36,
        fontWeight: '800',
    },
    label: {
        color: Theme.colors.subtext,
        fontSize: 14,
        marginTop: -4,
    },
    subLabel: {
        color: Theme.colors.accent,
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
});
