
from pathlib import Path

import chromadb
from embedding_utils import embed_documents
from pypdf import PdfReader

BASE_DIR = Path(__file__).resolve().parent
DOCUMENTS_DIR = BASE_DIR / "knowledge_base" / "documents"
DATABASE_DIR = BASE_DIR / "knowledge_base" / "database_gemini"

CHUNK_SIZE = 250
CHUNK_OVERLAP = 50

SOURCE_METADATA = {
    "rbi_financial_awareness.pdf": {
        "source_org": "Reserve Bank of India (RBI)",
        "title": "Financial Awareness Messages (FAME)",
        "publication_date": "Not specified",
        "source_type": "PDF",
        "source_url": "https://www.rbi.org.in/commonman/images/FAME202426022024.pdf"
    },
    "rbi_safe_digital_transactions.txt": {
        "source_org": "Reserve Bank of India (RBI)",
        "title": "Safe Use of Digital Transactions",
        "publication_date": "2020-06-22",
        "source_type": "Manually reviewed webpage",
        "source_url": "https://www.rbi.org.in/CommonPerson/english/scripts/Notification.aspx?Id=3232"
    },
    "cybercrime_financial_fraud.txt": {
        "source_org": "Indian Cyber Crime Coordination Centre (I4C)",
        "title": "Reporting Financial Cyber Fraud",
        "publication_date": "Not specified",
        "source_type": "Manually curated official portal guidance",
        "source_url": "https://cybercrime.gov.in/webform/FAQ.aspx"
    },
    "npci_upi_safety.txt": {
        "source_org": "National Payments Corporation of India (NPCI)",
        "title": "MyUPI - User Controls and Safety Switch",
        "publication_date": "Not specified",
        "source_type": "Curated summary of official NPCI product information",
        "source_url": "https://www.npci.org.in/product/myupi.html"
    },
    "rbi_unauthorised_transactions.txt": {
        "source_org": "Reserve Bank of India (RBI)",
        "title": "Financial Awareness Messages - Customer Liability for Fraudulent Digital Transactions",
        "publication_date": "Not specified",
        "source_type": "Curated summary of official RBI FAME guidance",
        "source_url": "https://rbi.org.in/commonman/images/FAME202426022024.pdf"
    },
    "rbi_shared_credentials_response.txt": {
        "source_org": "Reserve Bank of India",
        "title": "Responding to Shared or Exposed UPI Payment Credentials",
        "publication_date": "Not specified",
        "source_type": "Curated summary of official RBI guidance",
        "source_url": "https://rbi.org.in/commonman/images/FAME202426022024.pdf"
    },
    "upi_compromised_credentials.txt": {
        "source_org": "UPI Safety Coach",
        "title": "Guidance on Compromised UPI Credentials",
        "publication_date": "Not specified",
        "source_type": "Curated guidance",
        "source_url": ""
    },
}


def extract_pdf_pages(pdf_path):
    reader = PdfReader(str(pdf_path))
    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        if text.strip():
            pages.append((page_number, text))

    return pages


def extract_text_file(txt_path):
    text = txt_path.read_text(encoding="utf-8")
    return [(1, text)] if text.strip() else []


def create_chunks(text):
    words = text.split()
    chunks = []

    start = 0

    while start < len(words):
        end = start + CHUNK_SIZE
        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        if end >= len(words):
            break

        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks


def main():
    print("Connecting to Gemini ChromaDB...")

    DATABASE_DIR.mkdir(parents=True, exist_ok=True)

    client = chromadb.PersistentClient(
        path=str(DATABASE_DIR)
    )

    collection = client.get_or_create_collection(
        name="upi_official_guidance",
        embedding_function=None,
        metadata={"hnsw:space": "cosine"}
    )

    files = (
        list(DOCUMENTS_DIR.glob("*.pdf"))
        + list(DOCUMENTS_DIR.glob("*.txt"))
    )

    files = [
        file for file in files
        if file.name != "source_urls.txt"
    ]

    if not files:
        print("No knowledge documents found.")
        return

    for file_path in files:
        print(f"\nProcessing: {file_path.name}")

        metadata_template = SOURCE_METADATA.get(file_path.name)

        if not metadata_template:
            print("No source metadata configured. Skipping.")
            continue

        if file_path.suffix.lower() == ".pdf":
            pages = extract_pdf_pages(file_path)
        else:
            pages = extract_text_file(file_path)

        ids = []
        documents = []
        metadatas = []

        for page_number, page_text in pages:
            chunks = create_chunks(page_text)

            for chunk_index, chunk in enumerate(chunks):
                chunk_id = (
                    f"{file_path.stem}_p{page_number}_c{chunk_index}"
                )

                ids.append(chunk_id)
                documents.append(chunk)

                metadatas.append({
                    "source_file": file_path.name,
                    "source_org": metadata_template["source_org"],
                    "title": metadata_template["title"],
                    "publication_date": (
                        metadata_template["publication_date"]
                    ),
                    "source_type": metadata_template["source_type"],
                    "source_url": metadata_template["source_url"],
                    "page": page_number,
                    "chunk_index": chunk_index
                })

        if not documents:
            print("No readable text found.")
            continue

        print(f"Generating Gemini embeddings for {len(documents)} chunks...")

        # Generate embeddings before replacing existing records.
        embeddings = embed_documents(documents)

        if len(embeddings) != len(documents):
            raise RuntimeError("Embedding count does not match document count.")

        # Remove previous chunks only after embedding generation succeeds.
        collection.delete(
            where={"source_file": file_path.name}
        )

        collection.upsert(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
            embeddings=embeddings
        )

        print(f"Stored {len(documents)} chunks successfully.")

    print("\nKnowledge base updated!")
    print(f"Total stored chunks: {collection.count()}")


if __name__ == "__main__":
    main()
