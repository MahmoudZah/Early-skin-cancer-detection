import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Card({ children, style }) {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
            },
            theme.shadows.sm,
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
    },
});
