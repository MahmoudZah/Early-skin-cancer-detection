import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Disclaimer from '../components/Disclaimer';

export default function InfoScreen() {
    const { theme, isDark } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="information-circle" size={64} color={theme.colors.primary} />
                    <Text style={[styles.title, { color: theme.colors.text }]}>How It Works</Text>
                </View>

                {/* About Section */}
                <Card>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About This App</Text>
                    <Text style={[styles.text, { color: theme.colors.text }]}>
                        This application uses artificial intelligence to analyze skin lesion images
                        and provide early detection assistance for potential skin cancer. The AI model
                        has been trained on thousands of dermatological images to classify lesions as:
                    </Text>
                    <View style={styles.classificationList}>
                        <Text style={[styles.listItem, { color: theme.colors.text }]}>• <Text style={styles.bold}>Malignant</Text> - Potentially cancerous</Text>
                        <Text style={[styles.listItem, { color: theme.colors.text }]}>• <Text style={styles.bold}>Benign</Text> - Non-cancerous</Text>
                        <Text style={[styles.listItem, { color: theme.colors.text }]}>• <Text style={styles.bold}>Normal</Text> - Healthy skin</Text>
                    </View>
                </Card>

                {/* How to Use */}
                <Card>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="camera" size={24} color={theme.colors.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}> How to Use</Text>
                    </View>
                    <View style={styles.stepsList}>
                        <Text style={[styles.step, { color: theme.colors.text }]}>
                            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>1. </Text>
                            Capture or upload a clear image of the skin lesion
                        </Text>
                        <Text style={[styles.step, { color: theme.colors.text }]}>
                            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>2. </Text>
                            Review the image for clarity and quality
                        </Text>
                        <Text style={[styles.step, { color: theme.colors.text }]}>
                            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>3. </Text>
                            Run the AI analysis
                        </Text>
                        <Text style={[styles.step, { color: theme.colors.text }]}>
                            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>4. </Text>
                            Review the results and confidence score
                        </Text>
                        <Text style={[styles.step, { color: theme.colors.text }]}>
                            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>5. </Text>
                            Consult a dermatologist if recommended
                        </Text>
                    </View>
                </Card>

                {/* Tips for Best Results */}
                <Card>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="bulb" size={24} color={theme.colors.warning} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}> Tips for Clear Images</Text>
                    </View>
                    <View style={styles.tipsList}>
                        <Text style={[styles.tip, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>Good Lighting:</Text> Use natural daylight or bright indoor lighting
                        </Text>
                        <Text style={[styles.tip, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>Steady Camera:</Text> Hold your device steady to avoid blurry images
                        </Text>
                        <Text style={[styles.tip, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>Close-Up:</Text> Fill the frame with the lesion, but don't get too close
                        </Text>
                        <Text style={[styles.tip, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>No Flash:</Text> Avoid using flash as it can create glare
                        </Text>
                        <Text style={[styles.tip, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>Clean Lens:</Text> Make sure your camera lens is clean
                        </Text>
                        <Text style={[styles.tip, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>Focus:</Text> Tap on the lesion to ensure it's in focus
                        </Text>
                    </View>
                </Card>

                {/* When to See a Doctor */}
                <Card style={[styles.warningCard, {
                    backgroundColor: isDark ? '#3D2222' : '#FFF0F0',
                    borderLeftColor: theme.colors.danger,
                }]}>
                    <View style={styles.warningHeader}>
                        <Ionicons name="medkit" size={24} color={theme.colors.danger} />
                        <Text style={[styles.warningTitle, { color: theme.colors.danger }]}> When to See a Doctor</Text>
                    </View>
                    <Text style={[styles.text, { color: theme.colors.text }]}>
                        Consult a dermatologist immediately if you notice:
                    </Text>
                    <View style={styles.warningList}>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• New moles or growths</Text>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• Changes in existing moles (size, color, shape)</Text>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• Asymmetrical moles</Text>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• Irregular or jagged borders</Text>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• Multiple colors in one mole</Text>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• Diameter larger than 6mm (pencil eraser)</Text>
                        <Text style={[styles.warningItem, { color: theme.colors.text }]}>• Itching, bleeding, or crusting</Text>
                    </View>
                </Card>

                {/* ABCDE Rule */}
                <Card>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text" size={24} color={theme.colors.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}> ABCDE Rule for Melanoma</Text>
                    </View>
                    <View style={styles.abcdeList}>
                        <Text style={[styles.abcdeItem, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>A - Asymmetry:</Text> One half doesn't match the other
                        </Text>
                        <Text style={[styles.abcdeItem, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>B - Border:</Text> Irregular, scalloped, or poorly defined edges
                        </Text>
                        <Text style={[styles.abcdeItem, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>C - Color:</Text> Varies from one area to another
                        </Text>
                        <Text style={[styles.abcdeItem, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>D - Diameter:</Text> Larger than 6mm (though can be smaller)
                        </Text>
                        <Text style={[styles.abcdeItem, { color: theme.colors.text }]}>
                            <Text style={styles.bold}>E - Evolving:</Text> Changing in size, shape, or color
                        </Text>
                    </View>
                </Card>

                {/* Disclaimer */}
                <Disclaimer />

                {/* Footer */}
                <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>
                    This app is for educational purposes only. Always consult healthcare professionals
                    for medical advice.
                </Text>
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
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 8,
    },
    bold: {
        fontWeight: '700',
    },
    classificationList: {
        marginTop: 8,
    },
    listItem: {
        fontSize: 16,
        marginBottom: 4,
    },
    stepsList: {
        gap: 8,
    },
    step: {
        fontSize: 16,
        lineHeight: 22,
    },
    stepNumber: {
        fontWeight: '700',
    },
    tipsList: {
        gap: 16,
    },
    tip: {
        fontSize: 16,
        lineHeight: 22,
    },
    warningCard: {
        borderLeftWidth: 4,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    warningTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    warningList: {
        marginTop: 8,
    },
    warningItem: {
        fontSize: 16,
        marginBottom: 4,
    },
    abcdeList: {
        gap: 16,
    },
    abcdeItem: {
        fontSize: 16,
        lineHeight: 22,
    },
    footer: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 24,
        marginBottom: 32,
    },
});
