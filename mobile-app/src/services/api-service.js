import axios from 'axios';

// Update this URL with your server's IP address when running on a physical device
// For emulator: localhost (Android) or 127.0.0.1 (iOS)
// For physical device: your computer's local IP (e.g., 192.168.1.100)
const API_BASE_URL = 'http://192.168.1.254:5000';
class ApiService {
    /**
     * Predict skin lesion type from an image
     * @param {string} imageUri - Local URI of the image
     * @returns {Promise} - Prediction results
     */
    async predictImage(imageUri) {
        try {
            const formData = new FormData();

            // Extract filename from URI
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('image', {
                uri: imageUri,
                name: filename,
                type: type,
            });

            const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 second timeout
            });

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            console.error('API Error:', error);

            let errorMessage = 'Failed to analyze image. Please try again.';

            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.error || errorMessage;
            } else if (error.request) {
                // No response received
                errorMessage = 'Cannot connect to server. Please check your connection.';
            }

            return {
                success: false,
                error: errorMessage,
            };
        }
    }

    /**
     * Check if API server is reachable
     */
    async checkHealth() {
        try {
            const response = await axios.get(`${API_BASE_URL}/health`, {
                timeout: 5000,
            });
            return response.data;
        } catch (error) {
            return { status: 'unreachable' };
        }
    }
}

export default new ApiService();
