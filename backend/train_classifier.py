import pandas as pd
import pickle
import os
from sentence_transformers import SentenceTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# ── CONFIGURATION ────────────────────────────────────────────────
COL_TITLE = "title"
COL_DESC = "problem_description"
COL_TOPICS = "topic_tags"
# ──────────────────────────────────────────────────────────────────

print("Loading data...")
df = pd.read_csv("data/leetcode.csv")

# Drop rows where description or topics are missing
df = df.dropna(subset=[COL_DESC, COL_TOPICS])

# Mapping (Keep your existing mapping dictionary here)
topic_mapping = {
    "Array": "arrays", "Two Pointers": "two_pointers", "Sliding Window": "sliding_window",
    "Binary Search": "binary_search", "Dynamic Programming": "dynamic_programming",
    "Tree": "trees", "Binary Tree": "trees", "Binary Search Tree": "trees",
    "Graph": "graphs", "Depth-First Search": "graphs", "Breadth-First Search": "graphs",
    "Backtracking": "backtracking", "Stack": "stack_queue", "Queue": "stack_queue",
    "Heap (Priority Queue)": "heap", "Linked List": "linked_list", "Hash Table": "hash_table",
    "String": "strings", "Math": "math", "Recursion": "backtracking",
    "Divide and Conquer": "dynamic_programming", "Greedy": "greedy",
    "Sorting": "arrays", "Bit Manipulation": "bit_manipulation",
}

# AUGMENTATION: Expand rows by topic
expanded_rows = []
for _, row in df.iterrows():
    # Split the string of tags and iterate
    tags = str(row[COL_TOPICS]).replace("[", "").replace("]", "").replace("'", "").split(",")
    for tag in tags:
        mapped = topic_mapping.get(tag.strip())
        if mapped:
            new_row = row.to_dict()
            new_row["pattern"] = mapped
            new_row["text"] = str(row.get(COL_TITLE, "")) + " " + str(row.get(COL_DESC, ""))
            expanded_rows.append(new_row)

df_final = pd.DataFrame(expanded_rows)
print(f"Total training samples after expansion: {len(df_final)}")

# Vectorize using Semantic Embeddings
print("Generating semantic embeddings...")
embedder = SentenceTransformer('all-MiniLM-L6-v2')
X = embedder.encode(df_final["text"].tolist())
y = df_final["pattern"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Train Random Forest
print("Training Random Forest...")
model = RandomForestClassifier(
    n_estimators=500, 
    class_weight="balanced_subsample", 
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

# Evaluation
y_pred = model.predict(X_test)
print(f"\nAccuracy: {accuracy_score(y_test, y_pred):.2f}")
print(classification_report(y_test, y_pred))

# Save
os.makedirs("models", exist_ok=True)
pickle.dump(model, open("models/classifier.pkl", "wb"))
pickle.dump(embedder, open("models/vectorizer.pkl", "wb"))
print("Done! Models saved to /models folder.")