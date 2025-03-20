from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/get-location', methods=['GET'])
def get_location():
    latitude = request.cookies.get('latitude')
    longitude = request.cookies.get('longitude')

    if latitude and longitude:
        return jsonify({
            'latitude': latitude,
            'longitude': longitude
        })
    else:
        return jsonify({'error': 'Cookies not found'}), 404

if __name__ == '__main__':
    app.run(port=5000)