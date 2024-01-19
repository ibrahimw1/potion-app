from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle

app = FastAPI()

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained language detection model
with open('/Users/ibrahimwani/Desktop/Personal/notion-app/fastapi/nlp_model.pkl', 'rb') as model_file:
    language_model = pickle.load(model_file)


class InputText(BaseModel):
    text: str


@app.post("/predict_language")
def predict_language(text_input: InputText):
    text = text_input.text
    cleaned_text = language_model.remove_pun(text)
    predicted_language = language_model.predict([cleaned_text])[0]
    return {"predicted_language": predicted_language}
