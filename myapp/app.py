from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import cv2
import numpy as np
from feat import Detector

app = Flask(__name__)
CORS(app)

detector = Detector()

@app.route('/detect-emotions', methods=['POST'])
def detect_emotions():
    data = request.json
    image_data = data['image'].split(',')[1]
    image = base64.b64decode(image_data)
    np_image = np.frombuffer(image, np.uint8)
    frame = cv2.imdecode(np_image, cv2.IMREAD_COLOR)

    # Detect emotions
    faces = detector.detect_image(frame)
    emotions = faces.emotions if faces is not None else []

    return jsonify(emotions)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)