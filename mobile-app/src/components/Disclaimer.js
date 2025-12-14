import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import Card from './Card';

export default function Disclaimer() {
    return (
        <Card style={styles.disclaimer}>
            <Text style={styles.title}>⚠️ Important Medical Disclaimer</Text>
            <Text style={styles.text}>
                This app is NOT a substitute for professional medical advice, diagnosis, or treatment.
                The AI predictions are for educational purposes only and should not be used to make medical decisions.
            </Text>
            <Text style={styles.text}>
                If you notice any suspicious skin lesions, please consult a qualified dermatologist or healthcare provider immediately.
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    disclaimer: {
        backgroundColor: '#FFF9E6',
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.warning,
    },
    title: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    text: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: theme.spacing.sm,
    },
});
