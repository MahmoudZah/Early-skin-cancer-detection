import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import apiService from '../services/api-service';

export default function PreprocessingScreen({ route, navigation }) {
    const { theme } = useTheme();
    const { imageUri } = route.params;
    const [currentImageUri, setCurrentImageUri] = useState(imageUri);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isCropping, setIsCropping] = useState(false);

    const handleCrop = async () => {
        setIsCropping(true);
        try {
            // Get image dimensions and crop to center square
            const result = await ImageManipulator.manipulateAsync(
                currentImageUri,
                [
                    { resize: { width: 512, height: 512 } }
                ],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            setCurrentImageUri(result.uri);
        } catch (error) {
            Alert.alert('Error', 'Failed to crop image. Please try again.');
            console.error('Crop error:', error);
        } finally {
            setIsCropping(false);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        try {
            const result = await apiService.predictImage(currentImageUri);

            if (result.success) {
                navigation.navigate('Results', {
                    imageUri: currentImageUri,
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Review Image</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Make sure the lesion is clearly visible and well-lit
                </Text>

                <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }, theme.shadows.md]}>
                    <Image source={{ uri: currentImageUri }} style={styles.image} />
                </View>

                <View style={[styles.tips, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.tipsHeader}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                        <Text style={[styles.tipsTitle, { color: theme.colors.text }]}> Image Quality Tips:</Text>
                    </View>
                    <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Lesion should be in focus</Text>
                    <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Good lighting is essential</Text>
                    <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Avoid shadows and glare</Text>
                    <Text style={[styles.tipItem, { color: theme.colors.textSecondary }]}>• Fill the frame with the lesion</Text>
                </View>

                {isAnalyzing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Analyzing image...</Text>
                        <Text style={[styles.loadingSubtext, { color: theme.colors.textSecondary }]}>
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
                            icon={<Ionicons name="analytics" size={20} color="#fff" />}
                        />

                        <Button
                            title={isCropping ? "Cropping..." : "Crop & Resize"}
                            onPress={handleCrop}
                            variant="secondary"
                            size="medium"
                            disabled={isCropping}
                            icon={<Ionicons name="crop" size={20} color={theme.colors.primary} />}
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
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 24,
    },
    imageContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: 1,
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tips: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    tipItem: {
        fontSize: 14,
        marginBottom: 4,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    loadingSubtext: {
        fontSize: 14,
        marginTop: 4,
    },
    actions: {
        gap: 16,
    },
});
