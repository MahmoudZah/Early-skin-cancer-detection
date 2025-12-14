import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import Card from '../components/Card';
import Button from '../components/Button';
import storageService from '../services/storage-service';

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHistory();

        // Refresh history when screen is focused
        const unsubscribe = navigation.addListener('focus', loadHistory);
        return unsubscribe;
    }, [navigation]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await storageService.getHistory();
            setHistory(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (scanId) => {
        Alert.alert(
            'Delete Scan',
            'Are you sure you want to delete this scan?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storageService.deleteScan(scanId);
                            loadHistory();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete scan');
                        }
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All History',
            'Are you sure you want to delete all scan history?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await storageService.clearHistory();
                            loadHistory();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear history');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getResultColor = (className) => {
        switch (className) {
            case 'Malignant': return theme.colors.danger;
            case 'Benign': return theme.colors.warning;
            default: return theme.colors.success;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.loadingText}>Loading history...</Text>
            </View>
        );
    }

    if (history.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyIcon}>📋</Text>
                <Text style={styles.emptyTitle}>No Scan History</Text>
                <Text style={styles.emptyText}>
                    Your past scans will appear here
                </Text>
                <Button
                    title="Start First Scan"
                    onPress={() => navigation.navigate('Home')}
                    variant="primary"
                    size="medium"
                    style={styles.emptyButton}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan History</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.list}>
                {history.map((scan) => (
                    <Card key={scan.id} style={styles.scanCard}>
                        <TouchableOpacity
                            style={styles.scanContent}
                            onPress={() => navigation.navigate('Results', {
                                imageUri: scan.imageUri,
                                prediction: {
                                    predicted_class: scan.predicted_class,
                                    confidence: scan.confidence,
                                    all_probabilities: scan.all_probabilities,
                                },
                            })}
                        >
                            <Image source={{ uri: scan.imageUri }} style={styles.thumbnail} />

                            <View style={styles.scanInfo}>
                                <Text
                                    style={[styles.scanResult, { color: getResultColor(scan.predicted_class) }]}
                                >
                                    {scan.predicted_class}
                                </Text>
                                <Text style={styles.scanConfidence}>
                                    {(scan.confidence * 100).toFixed(0)}% confidence
                                </Text>
                                <Text style={styles.scanDate}>{formatDate(scan.timestamp)}</Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDelete(scan.id)}
                                style={styles.deleteButton}
                            >
                                <Text style={styles.deleteIcon}>🗑️</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centerContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    clearButton: {
        fontSize: theme.fontSize.md,
        color: theme.colors.danger,
        fontWeight: theme.fontWeight.semibold,
    },
    list: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    scanCard: {
        marginBottom: theme.spacing.md,
    },
    scanContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.md,
        marginRight: theme.spacing.md,
    },
    scanInfo: {
        flex: 1,
    },
    scanResult: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        marginBottom: theme.spacing.xs,
    },
    scanConfidence: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    scanDate: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
    },
    deleteButton: {
        padding: theme.spacing.sm,
    },
    deleteIcon: {
        fontSize: 24,
    },
    loadingText: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    emptyTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    emptyText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    emptyButton: {
        minWidth: 200,
    },
});
