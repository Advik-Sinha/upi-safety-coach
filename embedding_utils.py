
import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from the environment."
    )

client = genai.Client(api_key=API_KEY)

MODEL_NAME = "gemini-embedding-001"
EMBEDDING_DIMENSIONS = 768
BATCH_SIZE = 32


def embed_texts(texts, task_type):
    """Generate Gemini embeddings for a list of texts."""

    if not texts:
        return []

    all_embeddings = []

    for start in range(0, len(texts), BATCH_SIZE):
        batch = texts[start:start + BATCH_SIZE]

        response = client.models.embed_content(
            model=MODEL_NAME,
            contents=batch,
            config=types.EmbedContentConfig(
                task_type=task_type,
                output_dimensionality=EMBEDDING_DIMENSIONS
            )
        )

        if not response.embeddings:
            raise RuntimeError("Gemini returned no embeddings.")

        if len(response.embeddings) != len(batch):
            raise RuntimeError(
                "Gemini returned an unexpected number of embeddings."
            )

        for item in response.embeddings:
            all_embeddings.append(item.values)

    return all_embeddings


def embed_documents(texts):
    return embed_texts(texts, "RETRIEVAL_DOCUMENT")


def embed_query(text):
    return embed_texts([text], "RETRIEVAL_QUERY")[0]
