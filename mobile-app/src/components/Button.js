import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
    const { theme } = useTheme();

    const getVariantStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.colors.primary,
                    borderWidth: 0,
                };
            case 'secondary':
                return {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.primary,
                };
            case 'danger':
                return {
                    backgroundColor: theme.colors.danger,
                    borderWidth: 0,
                };
            case 'success':
                return {
                    backgroundColor: theme.colors.success,
                    borderWidth: 0,
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                };
            default:
                return {
                    backgroundColor: theme.colors.primary,
                    borderWidth: 0,
                };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'small':
                return {
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                };
            case 'medium':
                return {
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                };
            case 'large':
                return {
                    paddingHorizontal: theme.spacing.xl,
                    paddingVertical: theme.spacing.lg,
                };
            default:
                return {
                    paddingHorizontal: theme.spacing.xl,
                    paddingVertical: theme.spacing.lg,
                };
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary':
            case 'danger':
            case 'success':
                return '#fff';
            case 'secondary':
                return theme.colors.primary;
            case 'outline':
                return theme.colors.text;
            default:
                return '#fff';
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'small':
                return theme.fontSize.sm;
            case 'medium':
                return theme.fontSize.md;
            case 'large':
                return theme.fontSize.lg;
            default:
                return theme.fontSize.lg;
        }
    };

    const buttonStyles = [
        styles.button,
        {
            borderRadius: theme.borderRadius.md,
            ...getVariantStyle(),
            ...getSizeStyle(),
        },
        variant !== 'outline' && theme.shadows.sm,
        disabled && styles.disabled,
        style,
    ];

    const textStyles = [
        styles.text,
        {
            color: getTextColor(),
            fontSize: getTextSize(),
            fontWeight: theme.fontWeight.semibold,
        },
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        // Dynamic styles applied inline
    },
});
