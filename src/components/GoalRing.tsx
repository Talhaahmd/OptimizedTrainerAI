import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
    Easing
} from 'react-native-reanimated';
import { Theme } from '../constants/Theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GoalRingProps {
    size?: number;
    strokeWidth?: number;
    progress: number; // 0 to 1
    label: string;
    subLabel: string;
}

export const GoalRing: React.FC<GoalRingProps> = ({
    size = 120,
    strokeWidth = 12,
    progress,
    label,
    subLabel,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const animatedProgress = useSharedValue(0);

    useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 800,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
        });
    }, [progress]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - animatedProgress.value),
    }));

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background Ring */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress Ring */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={Theme.colors.accent}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${circumference} ${circumference}`}
                        animatedProps={animatedProps}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.centerText}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.subLabel}>{subLabel}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centerText: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: Theme.colors.text,
        fontSize: 34,
        fontWeight: '700',
    },
    subLabel: {
        color: Theme.colors.subtext,
        fontSize: 13,
        marginTop: -2,
    },
});
