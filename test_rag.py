
from rag import retrieve_guidance

question = "How can I report a UPI financial fraud in India?"

passages = retrieve_guidance(question)

print("\nQUESTION:", question)
print("\nRETRIEVED OFFICIAL GUIDANCE:\n")

for i, passage in enumerate(passages, start=1):
    print(f"\n--- RESULT {i} ---")
    print("Organisation:", passage["source_org"])
    print("Title:", passage["title"])
    print("Page:", passage["page"])
    print("Distance:", passage["distance"])
    print("Source URL:", passage["url"])
    print("Passage:", passage["text"][:500])
    print("-" * 60)
