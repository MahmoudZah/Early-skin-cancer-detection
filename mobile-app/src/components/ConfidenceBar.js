import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ConfidenceBar({ confidence, label }) {
    const { theme } = useTheme();
    const percentage = Math.round(confidence * 100);

    const getColorForConfidence = (conf) => {
        if (conf >= 0.8) return theme.colors.success;
        if (conf >= 0.6) return theme.colors.warning;
        return theme.colors.danger;
    };

    const barColor = getColorForConfidence(confidence);

    return (
        <View style={styles.container}>
            {label && <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>}
            <View style={[styles.barContainer, { backgroundColor: theme.colors.border }]}>
                <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: barColor }]} />
            </View>
            <Text style={[styles.percentage, { color: theme.colors.text }]}>{percentage}%</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '500',
    },
    barContainer: {
        height: 24,
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 4,
    },
    bar: {
        height: '100%',
        borderRadius: 999,
    },
    percentage: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
});
