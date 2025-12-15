import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import storageService from '../services/storage-service';

export default function HistoryScreen({ navigation }) {
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHistory();

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
        if (className === 'Normal') {
            return theme.colors.success;
        }
        return theme.colors.warning;
    };

    const getResultLabel = (className) => {
        if (className === 'Normal') {
            return 'Safe';
        }
        return 'Suspicious';
    };

    if (isLoading) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading history...</Text>
            </View>
        );
    }

    if (history.length === 0) {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="folder-open-outline" size={64} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Scan History</Text>
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Scan History</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={[styles.clearButton, { color: theme.colors.danger }]}>Clear All</Text>
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
                                <Text style={[styles.scanResult, { color: getResultColor(scan.predicted_class) }]}>
                                    {getResultLabel(scan.predicted_class)}
                                </Text>
                                <Text style={[styles.scanConfidence, { color: theme.colors.textSecondary }]}>
                                    {(scan.confidence * 100).toFixed(0)}% confidence
                                </Text>
                                <Text style={[styles.scanDate, { color: theme.colors.textSecondary }]}>
                                    {formatDate(scan.timestamp)}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => handleDelete(scan.id)}
                                style={styles.deleteButton}
                            >
                                <Ionicons name="trash-outline" size={24} color={theme.colors.danger} />
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
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    clearButton: {
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scanCard: {
        marginBottom: 16,
    },
    scanContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 16,
    },
    scanInfo: {
        flex: 1,
    },
    scanResult: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    scanConfidence: {
        fontSize: 14,
        marginBottom: 4,
    },
    scanDate: {
        fontSize: 12,
    },
    deleteButton: {
        padding: 8,
    },
    loadingText: {
        fontSize: 18,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
    },
    emptyButton: {
        minWidth: 200,
    },
});
