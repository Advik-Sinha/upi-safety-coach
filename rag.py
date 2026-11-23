
from pathlib import Path

import chromadb
from embedding_utils import embed_query

# Locate the Gemini knowledge-base database
BASE_DIR = Path(__file__).resolve().parent
DATABASE_DIR = BASE_DIR / "knowledge_base" / "database_gemini"

# Connect to ChromaDB
client = chromadb.PersistentClient(
    path=str(DATABASE_DIR)
)

collection = client.get_collection(
    name="upi_official_guidance"
)


def retrieve_guidance(question, n_results=5):
    """Retrieve relevant passages while limiting duplicate documents."""

    total_chunks = collection.count()

    if total_chunks == 0:
        return []

    # Retrieve a larger candidate pool
    candidate_count = min(max(n_results * 4, 15), total_chunks)

    # Generate query embedding using Gemini
    query_embedding = embed_query(question)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=candidate_count
    )

    passages = []
    seen_documents = set()

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    for document, metadata, distance in zip(
        documents, metadatas, distances
    ):
        document_id = metadata.get(
            "source_file",
            metadata.get("title", "Unknown document")
        )

        # Keep only the closest chunk from each document
        if document_id in seen_documents:
            continue

        seen_documents.add(document_id)

        passages.append({
            "text": document,
            "source_org": metadata.get("source_org", "Unknown"),
            "title": metadata.get("title", "Untitled source"),
            "url": metadata.get(
                "source_url",
                metadata.get("url", "")
            ),
            "page": metadata.get("page", "N/A"),
            "distance": round(float(distance), 4)
        })

        if len(passages) >= n_results:
            break

    return passages
