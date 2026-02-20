import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Theme } from '../constants/Theme';

interface RingChartProps {
    size?: number;
    strokeWidth?: number;
    rings: {
        progress: number;
        color: string;
    }[];
}

export const RingChart: React.FC<RingChartProps> = ({
    size = 120,
    strokeWidth = 10,
    rings
}) => {
    const center = size / 2;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {rings.map((ring, index) => {
                    const radius = center - strokeWidth / 2 - (index * (strokeWidth + 4));
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference * (1 - ring.progress);

                    return (
                        <React.Fragment key={index}>
                            {/* Background Ring */}
                            <Circle
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={Theme.colors.cardSecondary}
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            {/* Progress Ring */}
                            <Circle
                                cx={center}
                                cy={center}
                                r={radius}
                                stroke={ring.color}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                transform={`rotate(-90 ${center} ${center})`}
                            />
                        </React.Fragment>
                    );
                })}
            </Svg>
        </View>
    );
};
