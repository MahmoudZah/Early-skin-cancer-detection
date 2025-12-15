import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';

export default function Disclaimer() {
    const { theme, isDark } = useTheme();

    return (
        <Card style={[styles.disclaimer, {
            backgroundColor: isDark ? '#3D3522' : '#FFF9E6',
            borderLeftColor: theme.colors.warning,
        }]}>
            <View style={styles.titleContainer}>
                <Ionicons name="alert-circle" size={20} color={theme.colors.warning} />
                <Text style={[styles.title, { color: theme.colors.text }]}> Important Medical Disclaimer</Text>
            </View>
            <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                This app is NOT a substitute for professional medical advice, diagnosis, or treatment.
                The AI predictions are for educational purposes only and should not be used to make medical decisions.
            </Text>
            <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
                If you notice any suspicious skin lesions, please consult a qualified dermatologist or healthcare provider immediately.
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    disclaimer: {
        borderLeftWidth: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 8,
    },
});
