import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { theme } from '../styles/theme';
import Button from '../components/Button';
import Disclaimer from '../components/Disclaimer';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🔬</Text>
                    <Text style={styles.title}>Skin Cancer Detector</Text>
                    <Text style={styles.subtitle}>
                        AI-powered early detection assistant
                    </Text>
                </View>

                {/* Main Actions */}
                <View style={styles.actions}>
                    <Button
                        title="Start New Scan"
                        onPress={() => navigation.navigate('Camera')}
                        variant="primary"
                        size="large"
                        icon={<Text style={styles.buttonIcon}>📸</Text>}
                    />

                    <Button
                        title="Upload from Gallery"
                        onPress={() => navigation.navigate('ImagePicker')}
                        variant="secondary"
                        size="large"
                        icon={<Text style={styles.buttonIcon}>🖼️</Text>}
                    />

                    <Button
                        title="View History"
                        onPress={() => navigation.navigate('History')}
                        variant="outline"
                        size="medium"
                        icon={<Text style={styles.buttonIcon}>📋</Text>}
                    />

                    <Button
                        title="Information & Tips"
                        onPress={() => navigation.navigate('Info')}
                        variant="outline"
                        size="medium"
                        icon={<Text style={styles.buttonIcon}>ℹ️</Text>}
                    />
                </View>

                {/* Disclaimer */}
                <Disclaimer />

                {/* Footer */}
                <Text style={styles.footer}>
                    Early detection saves lives. Regular skin checks are important.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xxl,
    },
    emoji: {
        fontSize: 72,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    actions: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    buttonIcon: {
        fontSize: 20,
    },
    footer: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.lg,
        fontStyle: 'italic',
    },
});
