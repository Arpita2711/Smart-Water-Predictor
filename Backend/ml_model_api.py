from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

model = joblib.load('model.pkl')
label_encoder = joblib.load('label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    do = data.get('do')
    ph = data.get('ph')
    salinity = data.get('salinity')

    if do is None or ph is None or salinity is None:
        return jsonify({'error': 'Missing input'}), 400

    prediction = model.predict([[do, ph, salinity]])
    quality_label = label_encoder.inverse_transform(prediction)
    return jsonify({'prediction': quality_label[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

