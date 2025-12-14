import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';
import Button from '../components/Button';

export default function ImagePickerScreen({ navigation }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant photo library access to select images.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleContinue = () => {
        if (selectedImage) {
            navigation.navigate('Preprocessing', { imageUri: selectedImage });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Upload Image</Text>
                <Text style={styles.subtitle}>
                    Select a clear image of the skin lesion from your gallery
                </Text>

                {selectedImage ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.image} />
                        <Text style={styles.imageLabel}>Selected Image</Text>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderIcon}>🖼️</Text>
                        <Text style={styles.placeholderText}>No image selected</Text>
                    </View>
                )}

                <View style={styles.actions}>
                    <Button
                        title="Choose from Gallery"
                        onPress={pickImage}
                        variant="primary"
                        size="large"
                    />

                    {selectedImage && (
                        <Button
                            title="Continue to Analysis"
                            onPress={handleContinue}
                            variant="success"
                            size="large"
                        />
                    )}

                    <Button
                        title="Use Camera Instead"
                        onPress={() => navigation.navigate('Camera')}
                        variant="outline"
                        size="medium"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
    },
    imageContainer: {
        flex: 1,
        marginBottom: theme.spacing.lg,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: theme.borderRadius.lg,
        resizeMode: 'contain',
    },
    imageLabel: {
        textAlign: 'center',
        marginTop: theme.spacing.sm,
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        marginBottom: theme.spacing.lg,
    },
    placeholderIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    placeholderText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    actions: {
        gap: theme.spacing.md,
    },
});
