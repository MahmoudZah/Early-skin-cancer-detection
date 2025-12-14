import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import ConfidenceBar from '../components/ConfidenceBar';
import Disclaimer from '../components/Disclaimer';
import storageService from '../services/storage-service';

export default function ResultsScreen({ route, navigation }) {
    const { imageUri, prediction } = route.params;
    const { predicted_class, confidence, all_probabilities } = prediction;

    const getResultStyle = () => {
        if (predicted_class === 'Malignant') {
            return {
                icon: '⚠️',
                label: 'MALIGNANT',
                color: theme.colors.danger,
                message: 'Potentially cancerous lesion detected',
            };
        } else if (predicted_class === 'Benign') {
            return {
                icon: '⚡',
                label: 'BENIGN',
                color: theme.colors.warning,
                message: 'Non-cancerous lesion detected',
            };
        } else {
            return {
                icon: '✅',
                label: 'NORMAL',
                color: theme.colors.success,
                message: 'No concerning features detected',
            };
        }
    };

    const result = getResultStyle();

    const handleSaveToHistory = async () => {
        try {
            await storageService.saveScan({
                imageUri,
                predicted_class,
                confidence,
                all_probabilities,
            });
            Alert.alert('Saved', 'Scan result saved to history');
        } catch (error) {
            Alert.alert('Error', 'Failed to save scan result');
        }
    };

    const handleScanAgain = () => {
        navigation.navigate('Home');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imageUri }} style={styles.image} />
                </View>

                {/* Result Card */}
                <Card style={[styles.resultCard, { borderLeftColor: result.color }]}>
                    <View style={styles.resultHeader}>
                        <Text style={styles.resultIcon}>{result.icon}</Text>
                        <View style={styles.resultInfo}>
                            <Text style={styles.resultLabel}>Result:</Text>
                            <Text style={[styles.resultValue, { color: result.color }]}>
                                {result.label}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.resultMessage}>{result.message}</Text>
                </Card>

                {/* Confidence Score */}
                <Card>
                    <Text style={styles.sectionTitle}>Confidence Score</Text>
                    <ConfidenceBar confidence={confidence} />
                </Card>

                {/* All Probabilities */}
                <Card>
                    <Text style={styles.sectionTitle}>Detailed Analysis</Text>
                    {Object.entries(all_probabilities).map(([className, probability]) => (
                        <View key={className} style={styles.probabilityRow}>
                            <Text style={styles.className}>{className}</Text>
                            <ConfidenceBar
                                confidence={probability}
                                label=""
                            />
                        </View>
                    ))}
                </Card>

                {/* Medical Recommendation */}
                {(predicted_class === 'Malignant' || all_probabilities.Malignant > 0.1) && (
                    <Card style={styles.warningCard}>
                        <Text style={styles.warningTitle}>⚠️ Medical Attention Recommended</Text>
                        <Text style={styles.warningText}>
                            {predicted_class === 'Malignant'
                                ? 'This result suggests potential malignancy. Please consult a dermatologist immediately for professional evaluation.'
                                : `There is a ${(all_probabilities.Malignant * 100).toFixed(1)}% probability of malignancy. Consider consulting a dermatologist for confirmation.`
                            }
                        </Text>
                    </Card>
                )}

                {/* Disclaimer */}
                <Disclaimer />

                {/* Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Save to History"
                        onPress={handleSaveToHistory}
                        variant="secondary"
                        size="medium"
                    />

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
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    imageContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        aspectRatio: 1,
        ...theme.shadows.md,
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
        marginBottom: theme.spacing.md,
    },
    resultIcon: {
        fontSize: 48,
        marginRight: theme.spacing.md,
    },
    resultInfo: {
        flex: 1,
    },
    resultLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    resultValue: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
    },
    resultMessage: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    probabilityRow: {
        marginBottom: theme.spacing.md,
    },
    className: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    warningCard: {
        backgroundColor: '#FFF0F0',
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.danger,
    },
    warningTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.danger,
        marginBottom: theme.spacing.sm,
    },
    warningText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        lineHeight: 20,
    },
    actions: {
        gap: theme.spacing.md,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
});
