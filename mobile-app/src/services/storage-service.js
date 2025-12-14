import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@skin_cancer_history';

class StorageService {
    /**
     * Save a scan result to history
     */
    async saveScan(scanData) {
        try {
            const history = await this.getHistory();

            const newScan = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...scanData,
            };

            const updatedHistory = [newScan, ...history];

            // Keep only last 50 scans
            const limitedHistory = updatedHistory.slice(0, 50);

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));

            return newScan;
        } catch (error) {
            console.error('Error saving scan:', error);
            throw error;
        }
    }

    /**
     * Get all scan history
     */
    async getHistory() {
        try {
            const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
            return historyJson ? JSON.parse(historyJson) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    /**
     * Delete a specific scan
     */
    async deleteScan(scanId) {
        try {
            const history = await this.getHistory();
            const updatedHistory = history.filter(scan => scan.id !== scanId);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
            console.error('Error deleting scan:', error);
            throw error;
        }
    }

    /**
     * Clear all history
     */
    async clearHistory() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    }
}

export default new StorageService();
