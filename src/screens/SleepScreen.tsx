import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Theme } from '../constants/Theme';
import { PillButton } from '../components/PillButton';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon } from 'lucide-react-native';
import { BackButton } from '../components/BackButton';

export default function SleepScreen() {
    const { dailyStats, todayKey, updateDailyStats } = useAppContext();
    const [hours, setHours] = useState(dailyStats[todayKey]?.sleepHours.toString() || '0');

    const handleSave = async () => {
        await updateDailyStats({ sleepHours: parseFloat(hours) || 0 });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.title}>Sleep</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Moon size={48} color={Theme.colors.accent} />
                </View>

                <Text style={styles.label}>Hours Slept</Text>
                <TextInput
                    style={styles.input}
                    value={hours}
                    onChangeText={setHours}
                    keyboardType="decimal-pad"
                    placeholder="0.0"
                    placeholderTextColor={Theme.colors.subtext}
                    autoFocus
                />
                <Text style={styles.unit}>HOURS</Text>

                <PillButton title="Save Sleep" onPress={handleSave} style={styles.button} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: Theme.colors.text,
    },
    content: {
        flex: 1,
        padding: Theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Theme.colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    label: {
        color: Theme.colors.subtext,
        fontSize: 16,
        marginBottom: 16,
        fontWeight: '600',
    },
    input: {
        fontSize: 72,
        fontWeight: '900',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    unit: {
        color: Theme.colors.accent,
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 4,
        marginTop: 8,
        marginBottom: 64,
    },
    button: {
        width: '100%',
    },
});
