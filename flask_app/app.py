# from flask import Flask, request, jsonify
# import pickle
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# pl_model = pickle.load(open('/Users/ibrahimwani/Desktop/Personal/notion-app/src/flask_app/nlp_model.pkl', 'rb'))

# @app.route('/api/detect-language', methods=['POST', 'GET'])
# def detect_language():
#     try:
#         data = request.get_json()
#         text = data['text']
#         predicted_language = pl_model.predict([text])[0]
#         return jsonify({'language': predicted_language})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=8080)

from flask import Flask, jsonify, request
import string
import pandas as pd
from sklearn import pipeline
from sklearn import linear_model
from sklearn import feature_extraction

app = Flask(__name__)

# Load your language detection model
df = pd.read_csv('/Users/ibrahimwani/Desktop/Personal/notion-app/flask_app/Language Detection.csv')

def remove_pun(text):
    for pun in string.punctuation:
        text = text.replace(pun, "")
    text = text.lower()
    return text

df['Text'] = df['Text'].apply(remove_pun)

X = df['Text']
Y = df['Language']

vec = feature_extraction.text.TfidfVectorizer(ngram_range=(1, 2), analyzer='char')
pl_model = pipeline.Pipeline([('vec', vec), ('clf', linear_model.LogisticRegression())])
pl_model.fit(X, Y)

@app.route('/api/predict-language', methods=['POST'])
def predict_language():
    try:
        data = request.get_json()
        title = data['title']
        predicted_language = pl_model.predict([title])[0]
        return jsonify({'language': predicted_language})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
