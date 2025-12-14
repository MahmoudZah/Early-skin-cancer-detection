# Skin Cancer Detection - Mobile App Setup Guide

This guide will help you set up and run both the mobile app and the backend API server.

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- Expo CLI (`npm install -g expo-cli`)
- Trained model file: `skin_cancer_model.pth`

## Backend API Setup

### 1. Install Python Dependencies

```bash
cd c:\Users\hp\Desktop\Early-Skin-Cancer-Detection-Using-AI
pip install -r api-requirements.txt
```

### 2. Start the API Server

```bash
python api.py
```

The API will be available at `http://localhost:5000`

**For Physical Devices:** 
- Find your computer's local IP address (e.g., `192.168.1.100`)
- Update `API_BASE_URL` in `mobile-app/src/services/api-service.js`
- Make sure your phone and computer are on the same network

## Mobile App Setup

### 1. Install Dependencies

```bash
cd c:\Users\hp\Desktop\Early-Skin-Cancer-Detection-Using-AI\mobile-app
npm install
```

### 2. Start the Expo Development Server

```bash
npx expo start
```

### 3. Run on Device/Emulator

- **Android:** Press `a` in the terminal or scan the QR code with Expo Go app
- **iOS:** Press `i` in the terminal or scan the QR code
- **Web:** Press `w` to open in browser (limited camera functionality)

## Project Structure

```
Early-Skin-Cancer-Detection-Using-AI/
├── api.py                          # Flask API server
├── api-requirements.txt            # Python dependencies
├── skin_cancer_model.pth          # Trained PyTorch model
├── skin_cancer_predictor.py       # Original CLI predictor
└── mobile-app/
    ├── App.js                     # Main app with navigation
    ├── app.json                   # Expo configuration
    ├── package.json               # Node dependencies
    ├── src/
    │   ├── screens/               # All screen components
    │   │   ├── HomeScreen.js
    │   │   ├── CameraScreen.js
    │   │   ├── ImagePickerScreen.js
    │   │   ├── PreprocessingScreen.js
    │   │   ├── ResultsScreen.js
    │   │   ├── HistoryScreen.js
    │   │   └── InfoScreen.js
    │   ├── components/            # Reusable components
    │   │   ├── Button.js
    │   │   ├── Card.js
    │   │   ├── ConfidenceBar.js
    │   │   └── Disclaimer.js
    │   ├── services/              # API and storage services
    │   │   ├── api-service.js
    │   │   └── storage-service.js
    │   └── styles/
    │       └── theme.js           # App theming
    └── assets/                    # Images and icons
```

## Features

### Screens
1. **Home Screen** - Main navigation hub
2. **Camera Screen** - Capture images with live preview
3. **Image Picker** - Upload from gallery
4. **Preprocessing** - Review image before analysis
5. **Results** - View prediction with confidence scores
6. **History** - Browse past scans
7. **Info** - App information and medical guidelines

### Key Features
- Real-time camera with flash control
- Image quality tips and guidance
- AI-powered lesion classification
- Confidence scores and detailed probabilities
- Medical disclaimer and ABCDE rule information
- Scan history with AsyncStorage
- Professional medical-themed UI

## API Endpoints

- `GET /health` - Check API status
- `POST /predict` - Submit image for analysis

## Troubleshooting

### Camera Not Working
- Grant camera permissions when prompted
- Check device camera settings
- Restart the app

### API Connection Failed
- Ensure API server is running
- Check that `API_BASE_URL` matches your server address
- Verify network connectivity
- For physical devices, use local IP instead of localhost

### Expo Issues
- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npx expo-cli upgrade`

## Medical Disclaimer

This application is for educational purposes only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.

## License

Educational use only.
