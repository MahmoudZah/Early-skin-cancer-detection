import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import apiService from '../services/api-service';

export default function PreprocessingScreen({ route, navigation }) {
    const { imageUri } = route.params;
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        try {
            const result = await apiService.predictImage(imageUri);

            if (result.success) {
                navigation.navigate('Results', {
                    imageUri,
                    prediction: result.data,
                });
            } else {
                Alert.alert('Analysis Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleRetake = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Review Image</Text>
                <Text style={styles.subtitle}>
                    Make sure the lesion is clearly visible and well-lit
                </Text>

                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                <View style={styles.tips}>
                    <Text style={styles.tipsTitle}>✓ Image Quality Tips:</Text>
                    <Text style={styles.tipItem}>• Lesion should be in focus</Text>
                    <Text style={styles.tipItem}>• Good lighting is essential</Text>
                    <Text style={styles.tipItem}>• Avoid shadows and glare</Text>
                    <Text style={styles.tipItem}>• Fill the frame with the lesion</Text>
                </View>

                {isAnalyzing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Analyzing image...</Text>
                        <Text style={styles.loadingSubtext}>
                            This may take a few moments
                        </Text>
                    </View>
                ) : (
                    <View style={styles.actions}>
                        <Button
                            title="Run Analysis"
                            onPress={handleAnalyze}
                            variant="primary"
                            size="large"
                            icon={<Text style={styles.buttonIcon}>🔬</Text>}
                        />

                        <Button
                            title="Retake Photo"
                            onPress={handleRetake}
                            variant="outline"
                            size="medium"
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
    },
    imageContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        aspectRatio: 1,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.md,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tips: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    tipsTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    tipItem: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    loadingText: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginTop: theme.spacing.md,
    },
    loadingSubtext: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    actions: {
        gap: theme.spacing.md,
    },
    buttonIcon: {
        fontSize: 20,
    },
});
