import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/Button';

export default function ImagePickerScreen({ navigation }) {
    const { theme } = useTheme();
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
            allowsEditing: true,  // Enable cropping
            aspect: [1, 1],       // Square crop
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
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.colors.text }]}>Upload Image</Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Select a clear image of the skin lesion from your gallery
                </Text>

                {selectedImage ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.image} />
                        <Text style={[styles.imageLabel, { color: theme.colors.textSecondary }]}>Selected Image</Text>
                    </View>
                ) : (
                    <View style={[styles.placeholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="image-outline" size={64} color={theme.colors.textSecondary} />
                        <Text style={[styles.placeholderText, { color: theme.colors.textSecondary }]}>No image selected</Text>
                        <Text style={[styles.cropHint, { color: theme.colors.primary }]}>
                            Tap to select and crop
                        </Text>
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
    },
    content: {
        flex: 1,
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
    },
    imageContainer: {
        flex: 1,
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        resizeMode: 'contain',
    },
    imageLabel: {
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        marginBottom: 24,
    },
    placeholderText: {
        fontSize: 16,
        marginTop: 16,
    },
    cropHint: {
        fontSize: 14,
        marginTop: 8,
        fontWeight: '500',
    },
    actions: {
        gap: 16,
    },
});
