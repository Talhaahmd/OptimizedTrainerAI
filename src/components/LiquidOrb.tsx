import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSpring,
    Easing,
    interpolate
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Theme } from '../constants/Theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LiquidOrbProps {
    size?: number;
    active?: boolean; // When user is typing
    responding?: boolean; // When AI is responding
}

export const LiquidOrb: React.FC<LiquidOrbProps> = ({
    size = 200,
    active = false,
    responding = false
}) => {
    const scale = useSharedValue(1);
    const pulse = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        if (responding) {
            scale.value = withSpring(0.6);
            translateY.value = withSpring(-150);
        } else {
            scale.value = withSpring(active ? 1.2 : 1);
            translateY.value = withSpring(0);
        }
    }, [active, responding]);

    const animatedProps = useAnimatedProps(() => {
        const r = (size / 2) * (1 + pulse.value * 0.05);
        return {
            r: r,
        };
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: translateY.value },
                { scale: scale.value }
            ],
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={animatedStyle}>
                <Svg width={size} height={size}>
                    <Defs>
                        <RadialGradient
                            id="grad"
                            cx="50%"
                            cy="50%"
                            rx="50%"
                            ry="50%"
                            fx="50%"
                            fy="50%"
                        >
                            <Stop offset="0%" stopColor={Theme.colors.accent} stopOpacity="1" />
                            <Stop offset="70%" stopColor={Theme.colors.accent} stopOpacity="0.4" />
                            <Stop offset="100%" stopColor={Theme.colors.accent} stopOpacity="0" />
                        </RadialGradient>
                    </Defs>
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        fill="url(#grad)"
                        animatedProps={animatedProps}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
