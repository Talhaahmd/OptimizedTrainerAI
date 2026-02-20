import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../constants/Theme';

interface StatTileProps {
    label: string;
    value: string;
}

const StatTile: React.FC<StatTileProps> = ({ label, value }) => (
    <View style={styles.tile}>
        <Text style={styles.tileValue}>{value}</Text>
        <Text style={styles.tileLabel}>{label}</Text>
    </View>
);

interface TargetStatsCardProps {
    stats: {
        recovery: string;
        sleep: string;
        strain: string;
        hrv: string;
        rhr: string;
        respiration: string;
    };
}

export const TargetStatsCard: React.FC<TargetStatsCardProps> = ({ stats }) => {
    return (
        <View style={styles.grid}>
            <StatTile label="Recovery" value={stats.recovery} />
            <StatTile label="Sleep" value={stats.sleep} />
            <StatTile label="Strain" value={stats.strain} />
            <StatTile label="HRV" value={stats.hrv} />
            <StatTile label="RHR" value={stats.rhr} />
            <StatTile label="Respiration" value={stats.respiration} />
        </View>
    );
};

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Theme.spacing.gridGapSmall,
    },
    tile: {
        flexBasis: '48%', // Approx 2 columns
        flexGrow: 1,
        backgroundColor: Theme.colors.cardSecondary,
        borderRadius: Theme.borderRadius.tile,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    tileValue: {
        color: Theme.colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    tileLabel: {
        color: Theme.colors.subtext,
        fontSize: 12,
    },
});
