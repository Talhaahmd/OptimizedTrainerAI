import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppContext } from '../context/AppContext';
import { Theme } from '../constants/Theme';
import { Home, ChartBar as Chart, PlusCircle, Calendar, User, Brain } from 'lucide-react-native';

// Import Screens (we will create these next)
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import NutritionScreen from '../screens/NutritionScreen';
import OptimizeScreen from '../screens/OptimizeScreen';
import MovementScreen from '../screens/MovementScreen';
import SleepScreen from '../screens/SleepScreen';

const Stack = createNativeStackNavigator();

export const AppNavigation = () => {
    const { user, profile, loading } = useAppContext();

    if (loading) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    contentStyle: { backgroundColor: Theme.colors.background }
                }}
            >
                {!user ? (
                    <Stack.Screen name="Auth" component={LoginScreen} />
                ) : !profile ? (
                    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Optimize" component={OptimizeScreen} />
                        <Stack.Screen name="Movement" component={MovementScreen} />
                        <Stack.Screen name="Sleep" component={SleepScreen} />
                        <Stack.Screen name="Nutrition" component={NutritionScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
