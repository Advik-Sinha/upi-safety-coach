
from rag import retrieve_guidance

# Expected relevant documents for each question
TEST_CASES = [
    {
        "question": "How can I report a UPI financial fraud in India?",
        "expected_titles": ["Reporting Financial Cyber Fraud"]
    },
    {
        "question": "Should I share my UPI PIN, OTP or password with someone claiming to be from my bank?",
        "expected_titles": [
            "Safe Use of Digital Transactions",
            "Financial Awareness Messages (FAME)"
        ]
    },
    {
        "question": "What does NPCI's MyUPI Safety Switch do?",
        "expected_titles": [
            "MyUPI - User Controls and Safety Switch"
        ]
    },
    {
        "question": "What does RBI say about customer liability after an unauthorised digital transaction?",
        "expected_titles": [
            "Financial Awareness Messages - Customer Liability for Fraudulent Digital Transactions"
        ]
    },
    {
        "question": "What should I do after an unauthorised digital transaction?",
        "expected_titles": [
            "Financial Awareness Messages - Customer Liability for Fraudulent Digital Transactions",
            "Financial Awareness Messages (FAME)"
        ]
    },
    {
        "question": "Can I share my UPI PIN to receive money?",
        "expected_titles": [
            "Financial Awareness Messages (FAME)"
        ]
    }
]

TOP_K = 3

total_tests = len(TEST_CASES)
successful_tests = 0
reciprocal_ranks = []

print("\n========================================")
print("          UPI SAFETY COACH")
print("       DOCUMENT RELEVANCE TEST")
print("========================================")

for test_number, test in enumerate(TEST_CASES, start=1):

    question = test["question"]
    expected_titles = test["expected_titles"]

    passages = retrieve_guidance(question, n_results=5)

    matching_rank = None

    for rank, passage in enumerate(passages, start=1):
        if passage["title"] in expected_titles:
            matching_rank = rank
            break

    print(f"\n\nTEST {test_number}")
    print("Question:", question)
    print("Expected document:", " OR ".join(expected_titles))

    if matching_rank is not None:
        reciprocal_ranks.append(1 / matching_rank)

        if matching_rank <= TOP_K:
            successful_tests += 1
            print(f"RESULT: PASS - Relevant document found at rank {matching_rank}")
        else:
            print(f"RESULT: PARTIAL - Relevant document found at rank {matching_rank}")
    else:
        reciprocal_ranks.append(0)
        print("RESULT: FAIL - Relevant document not found in top 5")

    print("\nRetrieved documents:")

    for rank, passage in enumerate(passages, start=1):
        marker = (
            " <-- EXPECTED"
            if passage["title"] in expected_titles
            else ""
        )

        print(f"\nRank: {rank}{marker}")
        print("Source:", passage["source_org"])
        print("Title:", passage["title"])
        print("Distance:", passage["distance"])
        print("Passage:", passage["text"][:350].replace("\n", " "))

    print("\n" + "-" * 60)

# Calculate evaluation metrics
top_k_accuracy = (successful_tests / total_tests) * 100
mrr = sum(reciprocal_ranks) / total_tests

print("\n========================================")
print("          FINAL EVALUATION")
print("========================================")
print(f"Total questions: {total_tests}")
print(f"Relevant documents in top {TOP_K}: {successful_tests}")
print(f"Top-{TOP_K} accuracy: {top_k_accuracy:.1f}%")
print(f"Mean Reciprocal Rank (MRR): {mrr:.3f}")
print("========================================")
