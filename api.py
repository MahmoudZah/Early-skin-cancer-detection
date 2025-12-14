from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm
import io
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for mobile app requests

# Class names
CLASS_NAMES = ['Malignant', 'Benign', 'Normal']

class SkinCancerClassifier(nn.Module):
    """Skin Cancer Classifier using pretrained EfficientNet-B0."""
    
    def __init__(self, num_classes=3, pretrained=False):
        super(SkinCancerClassifier, self).__init__()
        
        # Load EfficientNet-B0
        self.backbone = timm.create_model('efficientnet_b0', pretrained=pretrained)
        
        # Get the number of features from the classifier
        in_features = self.backbone.classifier.in_features
        
        # Replace classifier with custom head
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)


# Global variables for model
model = None
device = None
img_size = 224
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]


def load_model():
    """Load the trained model."""
    global model, device, img_size, mean, std
    
    model_path = "skin_cancer_model.pth"
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file '{model_path}' not found!")
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Load checkpoint
    checkpoint = torch.load(model_path, map_location=device)
    
    # Create model
    model = SkinCancerClassifier(num_classes=3, pretrained=False)
    model.load_state_dict(checkpoint['model_state_dict'])
    model = model.to(device)
    model.eval()
    
    # Get normalization parameters
    img_size = checkpoint.get('img_size', 224)
    mean = checkpoint.get('mean', [0.485, 0.456, 0.406])
    std = checkpoint.get('std', [0.229, 0.224, 0.225])
    
    print(f"Model loaded successfully!")
    print(f"Model accuracy: {checkpoint.get('accuracy', 'N/A')}")


def predict_image(image_bytes):
    """Predict the class of a skin lesion image."""
    
    # Create transform
    transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std)
    ])
    
    # Load and preprocess image
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    # Make prediction
    with torch.no_grad():
        outputs = model(image_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted = probs.max(1)
    
    predicted_class = CLASS_NAMES[predicted.item()]
    confidence_score = confidence.item()
    
    # Get all class probabilities
    all_probs = {name: float(probs[0][i].item()) for i, name in enumerate(CLASS_NAMES)}
    
    return predicted_class, confidence_score, all_probs


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })


@app.route('/predict', methods=['POST'])
def predict():
    """Predict endpoint for image classification."""
    
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    # Check if image is in request
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    try:
        # Read image bytes
        image_bytes = file.read()
        
        # Make prediction
        predicted_class, confidence, all_probs = predict_image(image_bytes)
        
        # Return results
        return jsonify({
            'predicted_class': predicted_class,
            'confidence': confidence,
            'all_probabilities': all_probs
        })
    
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': f'Failed to process image: {str(e)}'}), 500


if __name__ == '__main__':
    print("="*50)
    print("🔬 SKIN CANCER DETECTION API")
    print("="*50)
    
    # Load model on startup
    try:
        load_model()
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        print("Make sure 'skin_cancer_model.pth' is in the same directory.")
        exit(1)
    
    # Start Flask server
    print("\n🚀 Starting API server...")
    print("API will be available at: http://localhost:5000")
    print("\nEndpoints:")
    print("  GET  /health  - Health check")
    print("  POST /predict - Image prediction")
    print("\nPress CTRL+C to stop the server\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False)
