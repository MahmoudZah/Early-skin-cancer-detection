import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ImagePickerScreen from './src/screens/ImagePickerScreen';
import PreprocessingScreen from './src/screens/PreprocessingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import InfoScreen from './src/screens/InfoScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { theme, isDark } = useTheme();

    const navigationTheme = {
        dark: isDark,
        colors: {
            primary: theme.colors.primary,
            background: theme.colors.background,
            card: theme.colors.surface,
            text: theme.colors.text,
            border: theme.colors.border,
            notification: theme.colors.primary,
        },
    };

    return (
        <NavigationContainer theme={navigationTheme}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.surface,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                        fontWeight: theme.fontWeight.bold,
                        fontSize: theme.fontSize.lg,
                    },
                    headerShadowVisible: true,
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{
                        title: 'Capture Image',
                        headerBackTitle: 'Back',
                    }}
                />

                <Stack.Screen
                    name="ImagePicker"
                    component={ImagePickerScreen}
                    options={{
                        title: 'Upload Image',
                        headerBackTitle: 'Back',
                    }}
                />

                <Stack.Screen
                    name="Preprocessing"
                    component={PreprocessingScreen}
                    options={{
                        title: 'Review & Analyze',
                        headerBackTitle: 'Back',
                    }}
                />

                <Stack.Screen
                    name="Results"
                    component={ResultsScreen}
                    options={{
                        title: 'Analysis Results',
                        headerBackTitle: 'Back',
                        headerLeft: () => null,
                    }}
                />

                <Stack.Screen
                    name="History"
                    component={HistoryScreen}
                    options={{
                        title: 'Scan History',
                        headerBackTitle: 'Back',
                    }}
                />

                <Stack.Screen
                    name="Info"
                    component={InfoScreen}
                    options={{
                        title: 'Information',
                        headerBackTitle: 'Back',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <AppNavigator />
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
