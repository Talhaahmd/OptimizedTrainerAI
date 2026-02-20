import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Theme } from '../constants/Theme';
import { PillButton } from '../components/PillButton';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from '../types';

export default function OnboardingScreen() {
    const { updateProfile } = useAppContext();
    const [profile, setProfile] = useState<UserProfile>({
        fullName: '',
        age: '',
        gender: 'M',
        goal: 'Muscle Develop',
        heightCm: '',
        weightKg: '',
        goalWeightKg: '',
    });

    const handleSave = async () => {
        if (Object.values(profile).every(v => v !== '')) {
            await updateProfile(profile);
        } else {
            Alert.alert("Missing Information", "Please fill in all fields to complete your profile.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.inner}>
                <Text style={styles.title}>Welcome!</Text>
                <Text style={styles.subtitle}>Let's set up your profile to start optimizing.</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor={Theme.colors.subtext}
                            value={profile.fullName}
                            onChangeText={(v) => setProfile({ ...profile, fullName: v })}
                        />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="25"
                                placeholderTextColor={Theme.colors.subtext}
                                keyboardType="numeric"
                                value={profile.age}
                                onChangeText={(v) => setProfile({ ...profile, age: v })}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Gender</Text>
                            <View style={styles.toggleContainer}>
                                <TouchableOpacity
                                    style={[styles.toggleBtn, profile.gender === 'M' && styles.activeToggle]}
                                    onPress={() => setProfile({ ...profile, gender: 'M' })}
                                >
                                    <Text style={[styles.toggleText, profile.gender === 'M' && styles.activeToggleText]}>M</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.toggleBtn, profile.gender === 'F' && styles.activeToggle]}
                                    onPress={() => setProfile({ ...profile, gender: 'F' })}
                                >
                                    <Text style={[styles.toggleText, profile.gender === 'F' && styles.activeToggleText]}>F</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Your Goal</Text>
                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, profile.goal === 'Muscle Develop' && styles.activeToggle]}
                                onPress={() => setProfile({ ...profile, goal: 'Muscle Develop' })}
                            >
                                <Text style={[styles.toggleText, profile.goal === 'Muscle Develop' && styles.activeToggleText]}>Muscle Develop</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, profile.goal === 'Fatloss' && styles.activeToggle]}
                                onPress={() => setProfile({ ...profile, goal: 'Fatloss' })}
                            >
                                <Text style={[styles.toggleText, profile.goal === 'Fatloss' && styles.activeToggleText]}>Fatloss</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="180"
                                placeholderTextColor={Theme.colors.subtext}
                                keyboardType="numeric"
                                value={profile.heightCm}
                                onChangeText={(v) => setProfile({ ...profile, heightCm: v })}
                            />
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="75"
                                placeholderTextColor={Theme.colors.subtext}
                                keyboardType="numeric"
                                value={profile.weightKg}
                                onChangeText={(v) => setProfile({ ...profile, weightKg: v })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Goal Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="70"
                            placeholderTextColor={Theme.colors.subtext}
                            keyboardType="numeric"
                            value={profile.goalWeightKg}
                            onChangeText={(v) => setProfile({ ...profile, goalWeightKg: v })}
                        />
                    </View>
                </View>

                <PillButton title="Complete Profile" onPress={handleSave} style={styles.button} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    inner: {
        padding: Theme.spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Theme.colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.subtext,
        marginBottom: 32,
    },
    form: {
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        color: Theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        color: Theme.colors.text,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.card,
        borderRadius: Theme.borderRadius.md,
        padding: 4,
        borderWidth: 1,
        borderColor: Theme.colors.border,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: Theme.borderRadius.sm,
    },
    activeToggle: {
        backgroundColor: Theme.colors.cardSecondary,
    },
    toggleText: {
        color: Theme.colors.subtext,
        fontWeight: '600',
    },
    activeToggleText: {
        color: Theme.colors.accent,
    },
    button: {
        marginTop: 16,
    },
});
