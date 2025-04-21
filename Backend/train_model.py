import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import boto3
import io
import os
from dotenv import load_dotenv

load_dotenv()

# AWS credentials & config
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

bucket = os.getenv("S3_BUCKET_NAME")
file_key = os.getenv("S3_FILE_KEY")

# Fetch and load CSV
response = s3.get_object(Bucket=bucket, Key=file_key)
df = pd.read_csv(io.BytesIO(response['Body'].read()))

# Preprocessing
df = df[['pH (standard units)', 'Dissolved Oxygen (mg/L)', 'Salinity (ppt)']].dropna()

def classify(row):
    ph = row.get('pH (standard units)', 0)
    do = row.get('Dissolved Oxygen (mg/L)', 0)
    salinity = row.get('Salinity (ppt)', 0)

    # 🌊 Top-tier quality
    if 6.8 <= ph <= 7.8 and do >= 6.5 and salinity <= 0.5:
        return "Great (Drinkable)"

    # ✅ Still good
    elif 6.5 <= ph <= 8.5 and do >= 5 and salinity <= 1:
        return "Good"

    # ⚖️ Acceptable but not great
    elif 6.0 <= ph <= 9.0 and do >= 4:
        return "Okay"

    # 😐 Meh
    elif do >= 3 and salinity <= 2:
        return "Normal"

    # ⚠️ Poor conditions
    elif do >= 2:
        return "Poor"

    # 🚫 Almost unusable
    elif do >= 1:
        return "Bad"

    # 🤢 The worst
    else:
        return "Eww, That’s Disgusting!"


df['quality'] = df.apply(classify, axis=1)

# Prepare training data
X = df[['Dissolved Oxygen (mg/L)', 'pH (standard units)', 'Salinity (ppt)']]
y = df['quality']

# Encode labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# Train model
model = RandomForestClassifier()
model.fit(X, y_encoded)

# Save model and label encoder
joblib.dump(model, 'model.pkl')
joblib.dump(le, 'label_encoder.pkl')
