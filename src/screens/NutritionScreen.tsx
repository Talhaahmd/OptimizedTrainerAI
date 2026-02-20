import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { Theme } from '../constants/Theme';
import { useAppContext } from '../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BackButton } from '../components/BackButton';
import { CaloriesCard } from '../components/CaloriesCard';
import { MacroCard } from '../components/MacroCard';
import { FoodLogTable } from '../components/FoodLogTable';
import { NutritionReviewCard } from '../components/NutritionReviewCard';

export default function NutritionScreen() {
    const { todayKey, meals, addMeal, targets } = useAppContext();
    const [showCamera, setShowCamera] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraRef, setCameraRef] = useState<any>(null);

    const todayMeals = meals[todayKey] || [];
    const eatenCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const dailyTarget = targets?.calories || 2400;

    // Aggregate macros for the breakdown card
    const currentMacros = todayMeals.reduce((acc, m) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
    }), { protein: 0, carbs: 0, fat: 0 });

    const macroTargets = {
        protein: targets?.protein || 180,
        carbs: targets?.carbs || 250,
        fat: targets?.fat || 70,
    };

    const handleTakePhoto = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setShowCamera(false);

            // Mocked food data for the new table structure
            const foodItems = ['Grilled Chicken Salad', 'Avocado Toast', 'Protein Shake', 'Salmon & Rice'];
            const randomFood = foodItems[Math.floor(Math.random() * foodItems.length)];

            const estimatedCalories = Math.floor(Math.random() * 500) + 200;
            const protein = Math.floor(estimatedCalories / 10);
            const carbs = Math.floor(estimatedCalories / 20);
            const fat = Math.floor(estimatedCalories / 40);

            await addMeal({
                photoUri: photo.uri,
                foodName: randomFood,
                calories: estimatedCalories,
                protein,
                carbs,
                fat
            });
        }
    };

    const openCamera = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission();
            if (!granted) return;
        }
        setShowCamera(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.title}>Nutrition</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* SECTION 1 — PRIMARY ACTION BUTTON */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.logBtn} onPress={openCamera}>
                        <Text style={styles.logBtnText}>Log my meal</Text>
                    </TouchableOpacity>
                </View>

                {/* SECTION 2 — CALORIES STATUS CARD */}
                <View style={styles.section}>
                    <CaloriesCard consumed={eatenCalories} target={dailyTarget} />
                </View>

                {/* SECTION 3 — MACRONUTRIENT BREAKDOWN */}
                <View style={styles.section}>
                    <MacroCard macros={currentMacros} targets={macroTargets} />
                </View>

                {/* SECTION 4 — FOOD LOG TABLE */}
                <View style={styles.section}>
                    <FoodLogTable meals={todayMeals} />
                </View>

                {/* SECTION 5 — AI FOOD REVIEW */}
                <View style={styles.section}>
                    <NutritionReviewCard
                        score={78}
                        summary="You are currently under your protein target and slightly below your calorie goal. Increasing lean protein intake will help preserve muscle while maintaining fat loss."
                        findings={[
                            "Protein intake below target",
                            "Calories within optimal range",
                            "Fat intake balanced",
                            "Carbohydrates slightly low"
                        ]}
                        recommendations={[
                            "Add 40g protein to your next meal",
                            "Eat one high protein snack",
                            "Maintain calorie intake within 2400 kcal",
                            "Avoid increasing fat intake further today"
                        ]}
                        alignment="On Track"
                    />
                </View>
            </ScrollView>

            {/* Camera Modal */}
            <Modal visible={showCamera} animationType="slide">
                <CameraView
                    style={styles.camera}
                    ref={(ref) => setCameraRef(ref)}
                >
                    <SafeAreaView style={styles.cameraOverlay}>
                        <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.closeBtn}>
                            <ChevronLeft size={32} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleTakePhoto} style={styles.captureBtn}>
                            <View style={styles.captureInner} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </CameraView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        paddingHorizontal: Theme.spacing.screenPadding,
        paddingTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.spacing.sectionGap,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 1.2,
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 28,
    },
    logBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: Theme.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    logBtnText: {
        color: Theme.colors.accent,
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 24,
    },
    closeBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureBtn: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: '#FFF',
        alignSelf: 'center',
        padding: 6,
        marginBottom: 40,
    },
    captureInner: {
        flex: 1,
        borderRadius: 38,
        borderWidth: 2,
        borderColor: '#000',
    },
});
