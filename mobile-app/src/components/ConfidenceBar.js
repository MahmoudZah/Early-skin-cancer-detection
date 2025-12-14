import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export default function ConfidenceBar({ confidence, label }) {
    const percentage = Math.round(confidence * 100);
    const barColor = getColorForConfidence(confidence);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={styles.percentage}>{percentage}%</Text>
        </View>
    );
}

function getColorForConfidence(confidence) {
    if (confidence >= 0.8) return theme.colors.success;
    if (confidence >= 0.6) return theme.colors.warning;
    return theme.colors.danger;
}

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing.sm,
    },
    label: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        fontWeight: theme.fontWeight.medium,
    },
    barContainer: {
        height: 24,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        marginBottom: theme.spacing.xs,
    },
    bar: {
        height: '100%',
        borderRadius: theme.borderRadius.full,
        transition: 'width 0.3s ease',
    },
    percentage: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
    },
});
