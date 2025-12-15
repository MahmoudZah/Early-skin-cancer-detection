import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfidenceBar from '../components/ConfidenceBar';
import Disclaimer from '../components/Disclaimer';
import storageService from '../services/storage-service';

export default function ResultsScreen({ route, navigation }) {
    const { theme } = useTheme();
    const { imageUri, prediction } = route.params;
    const { predicted_class, confidence, all_probabilities } = prediction;
    const hasSaved = useRef(false);

    // Auto-save to history on mount
    useEffect(() => {
        const autoSave = async () => {
            if (!hasSaved.current) {
                hasSaved.current = true;
                try {
                    await storageService.saveScan({
                        imageUri,
                        predicted_class,
                        confidence,
                        all_probabilities,
                    });
                } catch (error) {
                    console.error('Failed to auto-save scan:', error);
                }
            }
        };
        autoSave();
    }, [imageUri, predicted_class, confidence, all_probabilities]);

    const getResultStyle = () => {
        if (predicted_class === 'Malignant' || predicted_class === 'Benign') {
            return {
                iconName: 'alert-circle',
                label: 'SUSPICIOUS',
                color: theme.colors.warning,
                message: 'Suspicious lesion detected - Please consult a dermatologist',
            };
        } else {
            return {
                iconName: 'checkmark-circle',
                label: 'SAFE',
                color: theme.colors.success,
                message: 'No concerning features detected',
            };
        }
    };

    const result = getResultStyle();

    const handleScanAgain = () => {
        navigation.navigate('Home');
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                {/* Image */}
                <View style={[styles.imageContainer, { backgroundColor: theme.colors.surface }, theme.shadows.md]}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                {/* Result Card */}
                <Card style={[styles.resultCard, { borderLeftColor: result.color }]}>
                    <View style={styles.resultHeader}>
                        <View style={styles.resultIconContainer}>
                            <Ionicons name={result.iconName} size={48} color={result.color} />
                        </View>
                        <View style={styles.resultInfo}>
                            <Text style={[styles.resultLabel, { color: theme.colors.textSecondary }]}>Result:</Text>
                            <Text style={[styles.resultValue, { color: result.color }]}>
                                {result.label}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.resultMessage, { color: theme.colors.text }]}>{result.message}</Text>
                </Card>

                {/* Confidence Score */}
                <Card>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Confidence Score</Text>
                    <ConfidenceBar confidence={confidence} />
                </Card>

                {/* All Probabilities */}
                <Card>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Detailed Analysis</Text>
                    {Object.entries(all_probabilities).map(([className, probability]) => (
                        <View key={className} style={styles.probabilityRow}>
                            <Text style={[styles.className, { color: theme.colors.text }]}>{className}</Text>
                            <ConfidenceBar
                                confidence={probability}
                                label=""
                            />
                        </View>
                    ))}
                </Card>

                {/* Medical Recommendation */}
                {(predicted_class === 'Malignant' || predicted_class === 'Benign') && (
                    <Card style={styles.warningCard}>
                        <View style={styles.warningHeader}>
                            <Ionicons name="medical" size={24} color={theme.colors.danger} />
                            <Text style={[styles.warningTitle, { color: theme.colors.danger }]}> Medical Attention Recommended</Text>
                        </View>
                        <Text style={[styles.warningText, { color: theme.colors.text }]}>
                            This result suggests a suspicious lesion. Please consult a dermatologist for professional evaluation.
                        </Text>
                    </Card>
                )}

                {/* Disclaimer */}
                <Disclaimer />

                {/* Auto-save notice */}
                <View style={styles.autoSaveNotice}>
                    <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                    <Text style={[styles.autoSaveText, { color: theme.colors.textSecondary }]}>
                        Automatically saved to history
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Scan Again"
                        onPress={handleScanAgain}
                        variant="primary"
                        size="large"
                    />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        gap: 16,
    },
    imageContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    resultCard: {
        borderLeftWidth: 6,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultIconContainer: {
        marginRight: 16,
    },
    resultInfo: {
        flex: 1,
    },
    resultLabel: {
        fontSize: 14,
        marginBottom: 4,
    },
    resultValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    resultMessage: {
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    probabilityRow: {
        marginBottom: 16,
    },
    className: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    warningCard: {
        backgroundColor: '#FFF0F0',
        borderLeftWidth: 4,
        borderLeftColor: '#FC5C65',
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    warningTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    warningText: {
        fontSize: 14,
        lineHeight: 20,
    },
    autoSaveNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    autoSaveText: {
        fontSize: 14,
    },
    actions: {
        gap: 16,
        marginTop: 8,
        marginBottom: 32,
    },
});
