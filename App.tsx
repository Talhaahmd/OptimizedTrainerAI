import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import React from 'react';
import { AppProvider } from './src/context/AppContext';
import { AppNavigation } from './src/navigation/AppNavigation';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AppNavigation />
      </SafeAreaProvider>
    </AppProvider>
  );
}

export default registerRootComponent(App);
