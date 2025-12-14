import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { theme } from '../styles/theme';
import Button from '../components/Button';

export default function CameraScreen({ navigation }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [flash, setFlash] = useState('off');
    const cameraRef = useRef(null);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
                    📷 Camera permission is required to capture skin lesion images
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
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });

                navigation.navigate('Preprocessing', { imageUri: photo.uri });
            } catch (error) {
                Alert.alert('Error', 'Failed to capture image. Please try again.');
                console.error('Camera error:', error);
            }
        }
    };

    const toggleFlash = () => {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                flash={flash}
                ref={cameraRef}
            >
                {/* Top Controls */}
                <View style={styles.topControls}>
                    <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                        <Text style={styles.controlIcon}>
                            {flash === 'off' ? '🔦' : '⚡'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                        <Text style={styles.controlIcon}>🔄</Text>
                    </TouchableOpacity>
                </View>

                {/* Frame Guide */}
                <View style={styles.frameGuide}>
                    <View style={styles.corner} style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>

                {/* Instruction */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instruction}>
                        Position the skin lesion within the frame
                    </Text>
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                    >
                        <View style={styles.captureButtonInner} />
                    </TouchableOpacity>
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
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    permissionText: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    camera: {
        flex: 1,
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: theme.spacing.lg,
        paddingTop: theme.spacing.xxl,
    },
    controlButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlIcon: {
        fontSize: 24,
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
        borderColor: theme.colors.primary,
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
    instructionContainer: {
        position: 'absolute',
        bottom: 150,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instruction: {
        color: '#fff',
        fontSize: theme.fontSize.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    bottomControls: {
        position: 'absolute',
        bottom: theme.spacing.xxl,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: theme.colors.primary,
    },
    captureButtonInner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
    },
});
