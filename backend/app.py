from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load models
diabetes_model = joblib.load("models/diabetes.pkl")
heart_model = joblib.load("models/heart.pkl")
cancer_model = joblib.load("models/cancer.pkl")

@app.route('/')
def home():
    return "Backend Running"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    disease = data.get("disease")

    try:
        if disease == "diabetes":
            input_data = [
                data['age'], data['glucose'], data['bp'],
                data['bmi'], data['insulin'], data['smoking']
            ]
            model = diabetes_model

        elif disease == "heart":
            input_data = [
                data['age'], data['bp'], data['cholesterol'],
                data['max_hr'], data['smoking']
            ]
            model = heart_model

        elif disease == "cancer":
            input_data = [
                data['radius'], data['texture'], data['area'],
                data['smoothness'], data['concavity']
            ]
            model = cancer_model

        else:
            return jsonify({"error": "Invalid disease"}), 400

        prob = model.predict_proba([input_data])[0][1]
        risk = round(prob * 100, 2)

        # Simple explanation
        reasons = []
        if data.get('bp', 0) > 140:
            reasons.append("High BP")

        return jsonify({
            "risk": risk,
            "level": "High" if risk > 70 else "Medium" if risk > 30 else "Low",
            "reasons": reasons
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)