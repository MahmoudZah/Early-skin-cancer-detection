import sys
import torch
import torch.nn as nn
from torchvision import transforms
from PIL import Image
import timm

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


def load_model(model_path, device):
    """Load the trained model from file."""
    print(f"Loading model from: {model_path}")
    
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
    
    print(f"Model loaded successfully! (Accuracy: {checkpoint.get('accuracy', 'N/A')*100:.2f}%)")
    
    return model, img_size, mean, std


def predict(image_path, model, device, img_size, mean, std):
    """
    Predict the class of a skin lesion image.
    
    Args:
        image_path: Path to the skin image
        model: Trained model
        device: Device for inference
        img_size: Image size for preprocessing
        mean: Normalization mean
        std: Normalization std
    
    Returns:
        predicted_class, confidence, all_probabilities
    """
    # Create transform
    transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std)
    ])
    
    # Load and preprocess image
    image = Image.open(image_path).convert('RGB')
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    # Make prediction
    with torch.no_grad():
        outputs = model(image_tensor)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted = probs.max(1)
    
    predicted_class = CLASS_NAMES[predicted.item()]
    confidence_score = confidence.item()
    
    # Get all class probabilities
    all_probs = {name: probs[0][i].item() for i, name in enumerate(CLASS_NAMES)}
    
    return predicted_class, confidence_score, all_probs

def main():
    print("\n" + "="*50)
    print("🔬 SKIN CANCER DETECTION")
    print("="*50)
    print("Commands:")
    print("  - Enter image path to analyze")
    print("  - Type 'details' after a prediction for more info")
    print("  - Type 'quit' to exit\n")
    
    model_path = "skin_cancer_model.pth"
    
    # Check if model file exists
    import os
    if not os.path.exists(model_path):
        print(f"❌ Error: Model file '{model_path}' not found!")
        print("Make sure to train the model first using the Jupyter notebook.")
        sys.exit(1)
    
    # Device configuration
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"🔧 Using device: {device}")
    
    # Load model once
    model, img_size, mean, std = load_model(model_path, device)
    
    # Store last prediction for details command
    last_prediction = None
    last_image_path = None
    
    # Main loop
    while True:
        # Ask user for input
        user_input = input("\n📁 Enter image path (or 'quit'/'details'): ").strip()
        
        # Remove quotes if user included them
        user_input = user_input.strip('"').strip("'")
        
        # Check for quit command
        if user_input.lower() == 'quit':
            print("\n 7amdellah 3l Salama")
            break
        
        # Check for details command
        if user_input.lower() == 'details':
            if last_prediction is None:
                print("❌ No prediction available. Please analyze an image first.")
                continue
            
            predicted_class, confidence, all_probs = last_prediction
            
            # Show detailed results
            print("\n" + "="*50)
            print("📊 DETAILED RESULTS")
            print("="*50)
            
            # Show actual classification (Benign or Malignant)
            if predicted_class != "Normal":
                print(f"\n🔍 Classification: {predicted_class}")
            else:
                print(f"\n🔍 Classification: Normal Skin (No lesion detected)")
            
            print(f"📈 Confidence: {confidence*100:.2f}%")
            
            print("\n📉 All Class Probabilities:")
            print("-"*30)
            for class_name, prob in all_probs.items():
                bar = "█" * int(prob * 20)
                print(f"   {class_name:10} {prob*100:6.2f}% {bar}")
            print("-"*30)
            
            # Warning for malignant detection
            if predicted_class == "Malignant" and confidence > 0.5:
                print("\n⚠️  WARNING: Potential malignant lesion detected!")
                print("   Please consult a dermatologist for proper diagnosis.")
            
            # Warning if malignant probability > 10% but predicted as benign/normal
            elif all_probs["Malignant"] > 0.10:
                print(f"\n⚠️  NOTE: There's a {all_probs['Malignant']*100:.1f}% probability of Malignancy.")
                print("   Consider consulting a dermatologist for confirmation.")
            continue
        
        image_path = user_input
        
        if not image_path:
            print("❌ Error: No image path provided!")
            continue
        
        # Check if image file exists
        if not os.path.exists(image_path):
            print(f"❌ Error: Image file '{image_path}' not found!")
            continue
        
        # Make prediction
        try:
            print(f"\n🖼️  Analyzing image: {image_path}")
            predicted_class, confidence, all_probs = predict(
                image_path, model, device, img_size, mean, std
            )
            
            # Store prediction for details command
            last_prediction = (predicted_class, confidence, all_probs)
            last_image_path = image_path
            
            # Determine status: Safe (Normal) or Suspicious (Benign/Malignant)
            if predicted_class == "Normal":
                status = "✅ SAFE"
                status_color = "Safe - Normal skin detected"
            else:
                status = "⚠️  SUSPICIOUS"
                status_color = "Suspicious - Lesion detected, further examination recommended"
            
            # Display the image
            try:
                img = Image.open(image_path)
                img.show()
            except Exception as img_error:
                print(f"(Could not display image: {img_error})")
            
            # Display simple results
            print("\n" + "="*50)
            print("📊 RESULT")
            print("="*50)
            print(f"\n🎯 Status: {status}")
            print(f"   {status_color}")
            print("\n💡 Type 'details' for more information about the diagnosis.")
        
        except Exception as e:
            print(f"❌ Error processing image: {str(e)}")
            continue

if __name__ == "__main__":
    main()

