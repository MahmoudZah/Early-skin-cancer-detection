import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../styles/theme';
import Card from '../components/Card';
import Disclaimer from '../components/Disclaimer';

export default function InfoScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>ℹ️</Text>
                    <Text style={styles.title}>How It Works</Text>
                </View>

                {/* About Section */}
                <Card>
                    <Text style={styles.sectionTitle}>About This App</Text>
                    <Text style={styles.text}>
                        This application uses artificial intelligence to analyze skin lesion images
                        and provide early detection assistance for potential skin cancer. The AI model
                        has been trained on thousands of dermatological images to classify lesions as:
                    </Text>
                    <View style={styles.classificationList}>
                        <Text style={styles.listItem}>• <Text style={styles.bold}>Malignant</Text> - Potentially cancerous</Text>
                        <Text style={styles.listItem}>• <Text style={styles.bold}>Benign</Text> - Non-cancerous</Text>
                        <Text style={styles.listItem}>• <Text style={styles.bold}>Normal</Text> - Healthy skin</Text>
                    </View>
                </Card>

                {/* How to Use */}
                <Card>
                    <Text style={styles.sectionTitle}>📸 How to Use</Text>
                    <View style={styles.stepsList}>
                        <Text style={styles.step}>
                            <Text style={styles.stepNumber}>1. </Text>
                            Capture or upload a clear image of the skin lesion
                        </Text>
                        <Text style={styles.step}>
                            <Text style={styles.stepNumber}>2. </Text>
                            Review the image for clarity and quality
                        </Text>
                        <Text style={styles.step}>
                            <Text style={styles.stepNumber}>3. </Text>
                            Run the AI analysis
                        </Text>
                        <Text style={styles.step}>
                            <Text style={styles.stepNumber}>4. </Text>
                            Review the results and confidence score
                        </Text>
                        <Text style={styles.step}>
                            <Text style={styles.stepNumber}>5. </Text>
                            Consult a dermatologist if recommended
                        </Text>
                    </View>
                </Card>

                {/* Tips for Best Results */}
                <Card>
                    <Text style={styles.sectionTitle}>💡 Tips for Clear Images</Text>
                    <View style={styles.tipsList}>
                        <Text style={styles.tip}>
                            <Text style={styles.bold}>Good Lighting:</Text> Use natural daylight or bright indoor lighting
                        </Text>
                        <Text style={styles.tip}>
                            <Text style={styles.bold}>Steady Camera:</Text> Hold your device steady to avoid blurry images
                        </Text>
                        <Text style={styles.tip}>
                            <Text style={styles.bold}>Close-Up:</Text> Fill the frame with the lesion, but don't get too close
                        </Text>
                        <Text style={styles.tip}>
                            <Text style={styles.bold}>No Flash:</Text> Avoid using flash as it can create glare
                        </Text>
                        <Text style={styles.tip}>
                            <Text style={styles.bold}>Clean Lens:</Text> Make sure your camera lens is clean
                        </Text>
                        <Text style={styles.tip}>
                            <Text style={styles.bold}>Focus:</Text> Tap on the lesion to ensure it's in focus
                        </Text>
                    </View>
                </Card>

                {/* When to See a Doctor */}
                <Card style={styles.warningCard}>
                    <Text style={styles.warningTitle}>🏥 When to See a Doctor</Text>
                    <Text style={styles.text}>
                        Consult a dermatologist immediately if you notice:
                    </Text>
                    <View style={styles.warningList}>
                        <Text style={styles.warningItem}>• New moles or growths</Text>
                        <Text style={styles.warningItem}>• Changes in existing moles (size, color, shape)</Text>
                        <Text style={styles.warningItem}>• Asymmetrical moles</Text>
                        <Text style={styles.warningItem}>• Irregular or jagged borders</Text>
                        <Text style={styles.warningItem}>• Multiple colors in one mole</Text>
                        <Text style={styles.warningItem}>• Diameter larger than 6mm (pencil eraser)</Text>
                        <Text style={styles.warningItem}>• Itching, bleeding, or crusting</Text>
                    </View>
                </Card>

                {/* ABCDE Rule */}
                <Card>
                    <Text style={styles.sectionTitle}>📝 ABCDE Rule for Melanoma</Text>
                    <View style={styles.abcdeList}>
                        <Text style={styles.abcdeItem}>
                            <Text style={styles.bold}>A - Asymmetry:</Text> One half doesn't match the other
                        </Text>
                        <Text style={styles.abcdeItem}>
                            <Text style={styles.bold}>B - Border:</Text> Irregular, scalloped, or poorly defined edges
                        </Text>
                        <Text style={styles.abcdeItem}>
                            <Text style={styles.bold}>C - Color:</Text> Varies from one area to another
                        </Text>
                        <Text style={styles.abcdeItem}>
                            <Text style={styles.bold}>D - Diameter:</Text> Larger than 6mm (though can be smaller)
                        </Text>
                        <Text style={styles.abcdeItem}>
                            <Text style={styles.bold}>E - Evolving:</Text> Changing in size, shape, or color
                        </Text>
                    </View>
                </Card>

                {/* Disclaimer */}
                <Disclaimer />

                {/* Footer */}
                <Text style={styles.footer}>
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
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        gap: theme.spacing.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    emoji: {
        fontSize: 64,
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    text: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        lineHeight: 22,
        marginBottom: theme.spacing.sm,
    },
    bold: {
        fontWeight: theme.fontWeight.bold,
    },
    classificationList: {
        marginTop: theme.spacing.sm,
    },
    listItem: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    stepsList: {
        gap: theme.spacing.sm,
    },
    step: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        lineHeight: 22,
    },
    stepNumber: {
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    tipsList: {
        gap: theme.spacing.md,
    },
    tip: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        lineHeight: 22,
    },
    warningCard: {
        backgroundColor: '#FFF0F0',
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.danger,
    },
    warningTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.danger,
        marginBottom: theme.spacing.md,
    },
    warningList: {
        marginTop: theme.spacing.sm,
    },
    warningItem: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    abcdeList: {
        gap: theme.spacing.md,
    },
    abcdeItem: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        lineHeight: 22,
    },
    footer: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
});
