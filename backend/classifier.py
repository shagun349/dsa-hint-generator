# classifier.py
# Pattern classifier using SentenceTransformer embeddings + SVM
# Trained on 3400+ LeetCode problems, 73.3% accuracy

from sentence_transformers import SentenceTransformer
import pickle
import numpy as np
import os

# These are loaded once at startup and reused for every request
_classifier = None
_embedder = None

def _load_models():
    global _classifier, _embedder
    
    if _classifier is not None:
        return  # already loaded, skip
    
    model_path = "models/classifier.pkl"
    
    if os.path.exists(model_path):
        print("Loading trained classifier...")
        _classifier = pickle.load(open(model_path, "rb"))
        _embedder = SentenceTransformer("all-MiniLM-L6-v2")
        print("Classifier loaded successfully.")
    else:
        print("No trained model found — using keyword fallback.")

def classify_pattern(problem_text: str) -> dict:
    _load_models()
    
    # Use trained model if available
    if _classifier is not None:
        # Convert problem text to embedding vector
        embedding = _embedder.encode([problem_text])
        
        # Predict pattern
        pattern = _classifier.predict(embedding)[0]
        
        # Get confidence scores for all patterns
        proba = _classifier.predict_proba(embedding)[0]
        classes = _classifier.classes_
        
        # Sort by confidence
        top_indices = np.argsort(proba)[::-1]
        
        return {
            "pattern": pattern,
            "confidence": round(float(proba[top_indices[0]]), 3),
            "alternatives": [classes[i] for i in top_indices[1:3]]
        }
    
    # Fallback if model files not found
    return _keyword_fallback(problem_text)


def _keyword_fallback(problem_text: str) -> dict:
    PATTERN_KEYWORDS = {
        "sliding_window": ["subarray", "window", "consecutive", "substring"],
        "two_pointers": ["sorted array", "palindrome", "pair sum"],
        "dynamic_programming": ["maximum", "minimum", "ways to", "count paths"],
        "binary_search": ["sorted", "search", "find position"],
        "trees": ["root", "node", "binary tree", "traversal"],
        "graphs": ["connected", "path", "visited", "islands"],
        "heap": ["k largest", "k smallest", "median"],
    }
    
    text = problem_text.lower()
    scores = {}
    for pattern, keywords in PATTERN_KEYWORDS.items():
        scores[pattern] = sum(1 for kw in keywords if kw in text)
    
    best = max(scores, key=scores.get)
    return {
        "pattern": best if scores[best] > 0 else "general",
        "confidence": 0.5,
        "alternatives": []
    }