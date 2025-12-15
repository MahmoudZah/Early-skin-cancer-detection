import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

export default function CameraScreen({ navigation }) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [torchEnabled, setTorchEnabled] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const cameraRef = useRef(null);

    if (!permission) {
        return <View style={[styles.container, { backgroundColor: theme.colors.background }]} />;
    }

    if (!permission.granted) {
        return (
            <View style={[styles.permissionContainer, { backgroundColor: theme.colors.background }]}>
                <Ionicons name="camera" size={64} color={theme.colors.primary} />
                <Text style={[styles.permissionText, { color: theme.colors.text }]}>
                    Camera permission is required to capture skin lesion images
                </Text>
                <Button
                    title="Grant Permission"
                    onPress={requestPermission}
                    variant="primary"
                />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current && !isCapturing) {
            setIsCapturing(true);
            try {
                // Capture the photo
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });

                // Turn off torch after capture
                if (torchEnabled) {
                    setTorchEnabled(false);
                }

                // Open the image picker with editing enabled on the captured image
                // We need to use launchImageLibraryAsync with the asset option
                // Since we can't directly edit a captured image, we'll save it first
                // then open the picker with editing

                // Request media library permissions
                const mediaPermission = await MediaLibrary.requestPermissionsAsync();

                if (mediaPermission.status === 'granted') {
                    // Save the captured image to media library temporarily
                    const asset = await MediaLibrary.createAssetAsync(photo.uri);

                    // Now launch image picker with editing enabled
                    // This will open with the most recent photo (which is our captured one)
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.8,
                    });

                    if (!result.canceled) {
                        navigation.navigate('Preprocessing', { imageUri: result.assets[0].uri });
                    } else {
                        // User cancelled crop, use original image
                        navigation.navigate('Preprocessing', { imageUri: photo.uri });
                    }
                } else {
                    // No media library permission, go directly to preprocessing
                    navigation.navigate('Preprocessing', { imageUri: photo.uri });
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to capture image. Please try again.');
                console.error('Camera error:', error);
            } finally {
                setIsCapturing(false);
            }
        }
    };

    // Alternative: Use system camera with built-in crop
    const useSystemCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                navigation.navigate('Preprocessing', { imageUri: result.assets[0].uri });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to open camera.');
        }
    };

    const toggleTorch = () => {
        setTorchEnabled(current => !current);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
        if (torchEnabled) {
            setTorchEnabled(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                enableTorch={torchEnabled}
                ref={cameraRef}
            >
                {/* Top Controls */}
                <View style={[styles.topControls, { paddingTop: insets.top + 16 }]}>
                    <TouchableOpacity
                        style={[
                            styles.controlButton,
                            torchEnabled && { backgroundColor: theme.colors.warning }
                        ]}
                        onPress={toggleTorch}
                    >
                        <Ionicons
                            name={torchEnabled ? 'flash' : 'flash-off'}
                            size={24}
                            color="#fff"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                        <Ionicons name="camera-reverse" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Frame Guide */}
                <View style={styles.frameGuide}>
                    <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.primary }]} />
                    <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.primary }]} />
                    <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.primary }]} />
                    <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.primary }]} />
                </View>

                {/* Torch Indicator */}
                {torchEnabled && (
                    <View style={styles.torchIndicator}>
                        <Ionicons name="flash" size={16} color={theme.colors.warning} />
                        <Text style={styles.torchText}>Torch ON</Text>
                    </View>
                )}

                {/* Instruction */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instruction}>
                        {isCapturing ? 'Opening crop tool...' : 'Position the skin lesion within the frame'}
                    </Text>
                </View>

                {/* Bottom Controls */}
                <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 32 }]}>
                    {/* System Camera Button */}
                    <TouchableOpacity
                        style={styles.systemCameraButton}
                        onPress={useSystemCamera}
                    >
                        <Ionicons name="camera-outline" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* Main Capture Button */}
                    <TouchableOpacity
                        style={[
                            styles.captureButton,
                            { borderColor: theme.colors.primary },
                            isCapturing && { opacity: 0.5 }
                        ]}
                        onPress={takePicture}
                        disabled={isCapturing}
                    >
                        <View style={[styles.captureButtonInner, { backgroundColor: theme.colors.primary }]} />
                    </TouchableOpacity>

                    {/* Placeholder for symmetry */}
                    <View style={styles.systemCameraButton} />
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    permissionText: {
        fontSize: 18,
        textAlign: 'center',
        marginVertical: 32,
    },
    camera: {
        flex: 1,
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    frameGuide: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        right: '10%',
        aspectRatio: 1,
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    torchIndicator: {
        position: 'absolute',
        top: '20%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
    },
    torchText: {
        color: '#FD9644',
        fontSize: 14,
        fontWeight: '600',
    },
    instructionContainer: {
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instruction: {
        color: '#fff',
        fontSize: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 12,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    systemCameraButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
