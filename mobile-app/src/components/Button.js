import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { theme } from '../styles/theme';

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'large',
    disabled = false,
    loading = false,
    icon = null,
    style
}) {
    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        styles[`${size}Text`],
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : theme.colors.primary} />
            ) : (
                <View style={styles.content}>
                    {icon}
                    <Text style={textStyles}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },

    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    danger: {
        backgroundColor: theme.colors.danger,
    },
    success: {
        backgroundColor: theme.colors.success,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.border,
    },

    // Sizes
    small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
    },

    disabled: {
        opacity: 0.5,
    },

    // Text styles
    text: {
        fontWeight: theme.fontWeight.semibold,
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: theme.colors.primary,
    },
    dangerText: {
        color: '#fff',
    },
    successText: {
        color: '#fff',
    },
    outlineText: {
        color: theme.colors.text,
    },
    smallText: {
        fontSize: theme.fontSize.sm,
    },
    mediumText: {
        fontSize: theme.fontSize.md,
    },
    largeText: {
        fontSize: theme.fontSize.lg,
    },
});
