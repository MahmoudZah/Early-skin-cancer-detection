import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';
import Disclaimer from '../components/Disclaimer';

export default function HomeScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { theme, isDark, toggleTheme, themeMode, setAutoMode } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingTop: insets.top + theme.spacing.lg,
                        paddingBottom: insets.bottom + theme.spacing.lg,
                    }
                ]}
            >
                {/* Theme Toggle */}
                <View style={styles.themeToggle}>
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={[styles.themeButton, { backgroundColor: theme.colors.surface }]}
                    >
                        <Ionicons
                            name={isDark ? 'sunny' : 'moon'}
                            size={20}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                    {themeMode !== 'auto' && (
                        <TouchableOpacity
                            onPress={setAutoMode}
                            style={[styles.autoButton, { backgroundColor: theme.colors.surface }]}
                        >
                            <Text style={[styles.autoText, { color: theme.colors.textSecondary }]}>Auto</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="scan-circle" size={72} color={theme.colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Skin Cancer Detector</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
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
                        icon={<Ionicons name="camera" size={20} color="#fff" />}
                    />

                    <Button
                        title="Upload from Gallery"
                        onPress={() => navigation.navigate('ImagePicker')}
                        variant="secondary"
                        size="large"
                        icon={<Ionicons name="images" size={20} color={theme.colors.primary} />}
                    />

                    <Button
                        title="View History"
                        onPress={() => navigation.navigate('History')}
                        variant="outline"
                        size="medium"
                        icon={<Ionicons name="time" size={20} color={theme.colors.text} />}
                    />

                    <Button
                        title="Information & Tips"
                        onPress={() => navigation.navigate('Info')}
                        variant="outline"
                        size="medium"
                        icon={<Ionicons name="information-circle" size={20} color={theme.colors.text} />}
                    />
                </View>

                {/* Disclaimer */}
                <Disclaimer />

                {/* Footer */}
                <Text style={[styles.footer, { color: theme.colors.textSecondary }]}>
                    Early detection saves lives. Regular skin checks are important.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 24,
    },
    themeToggle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    themeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    autoButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
    },
    autoText: {
        fontSize: 12,
        fontWeight: '500',
    },
    header: {
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 48,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    actions: {
        gap: 16,
        marginBottom: 32,
    },
    footer: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 24,
        fontStyle: 'italic',
    },
});
