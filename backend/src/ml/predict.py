import sys
import json
import joblib
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import nltk
nltk.data.path.append("C:/Users/Prajwal Koteshwar/AppData/Roaming/nltk_data")

# Load TF-IDF + model
vectorizer = joblib.load('./ml_resource/tfidf.pkl')
model = joblib.load('./ml_resource/random_forest_model.pkl')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text: str) -> str:
    tokens = word_tokenize(text)
    filtered = [lemmatizer.lemmatize(t) for t in tokens if t.lower() not in stop_words]
    return " ".join(filtered)

# Read JSON input from Node
data = json.loads(sys.stdin.read())

# Match EXACT training combine logic using snake_case
combined = " ".join([
    data.get('title', '') or '',
    data.get('location', '') or '',
    data.get('department', '') or '',
    data.get('company_profile', '') or '',
    data.get('description', '') or '',
    data.get('requirements', '') or '',
    data.get('benefits', '') or '',
    data.get('industry', '') or '',
    data.get('function', '') or ''
]).strip()

clean = preprocess_text(combined)
X = vectorizer.transform([clean])

fraud_prob = model.predict_proba(X)[0][1]
is_fraud = fraud_prob > 0.5

print(json.dumps({
    'fraud_probability': float(fraud_prob),
    'is_fraudulent': bool(is_fraud),
    'confidence': 0.95
}))
