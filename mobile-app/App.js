import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/styles/theme';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import CameraScreen from './src/screens/CameraScreen';
import ImagePickerScreen from './src/screens/ImagePickerScreen';
import PreprocessingScreen from './src/screens/PreprocessingScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import InfoScreen from './src/screens/InfoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <StatusBar style="dark" />
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
                        headerLeft: () => null, // Prevent going back from results
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
