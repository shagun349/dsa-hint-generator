# classifier.py
# This is YOUR ML layer - runs before any AI API is called
# Its only job: look at a problem and detect which DSA pattern it belongs to

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# These are your pattern "definitions"
# Each pattern has example phrases that typically appear in those problems
# TF-IDF will compare the user's problem against these to find the closest match

PATTERN_DEFINITIONS = {
    "sliding_window": [
        "maximum sum subarray of size k",
        "longest substring without repeating characters",
        "minimum window substring contiguous elements",
        "fixed window sliding across array"
    ],
    "two_pointers": [
        "sorted array find pair with target sum",
        "remove duplicates in place left right pointer",
        "palindrome check two ends moving inward",
        "container with most water two ends"
    ],
    "dynamic_programming": [
        "maximum minimum ways to reach count paths",
        "optimal substructure overlapping subproblems",
        "fibonacci knapsack longest common subsequence",
        "how many ways can you climb stairs"
    ],
    "binary_search": [
        "sorted array find target position efficiently",
        "search in rotated sorted array",
        "find minimum in sorted array log n",
        "guess number higher or lower"
    ],
    "trees": [
        "binary tree root node leaf traversal",
        "inorder preorder postorder level order",
        "maximum depth of binary tree path sum",
        "lowest common ancestor binary search tree"
    ],
    "graphs": [
        "number of islands connected components visited",
        "shortest path between nodes adjacency list",
        "detect cycle in directed undirected graph",
        "breadth first depth first search traversal"
    ],
    "heap": [
        "k largest elements k smallest elements",
        "find median from data stream",
        "top k frequent elements priority queue",
        "merge k sorted lists"
    ],
    "backtracking": [
        "all possible subsets combinations permutations",
        "generate all valid parentheses",
        "solve sudoku n queens word search",
        "find all paths that sum to target"
    ],
    "linked_list": [
        "reverse linked list detect cycle",
        "merge two sorted lists find middle node",
        "remove nth node from end",
        "linked list intersection point"
    ],
    "stack_queue": [
        "valid parentheses matching brackets",
        "next greater element monotonic stack",
        "implement queue using stacks",
        "daily temperatures next warmer day"
    ]
}

def classify_pattern(problem_text: str) -> dict:
    # Step 1: collect all pattern names and their definition texts
    patterns = list(PATTERN_DEFINITIONS.keys())
    pattern_texts = [" ".join(examples) for examples in PATTERN_DEFINITIONS.values()]
    
    # Step 2: TF-IDF vectorizes both the problem and all pattern definitions
    # TF-IDF = Term Frequency Inverse Document Frequency
    # It converts text into numbers based on how important each word is
    # Common words like "the", "is" get low scores
    # Specific words like "subarray", "palindrome" get high scores
    all_texts = pattern_texts + [problem_text]
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    # Step 3: compare problem vector against each pattern vector
    # cosine_similarity measures how similar two vectors are (0 = nothing in common, 1 = identical)
    problem_vector = tfidf_matrix[-1]
    pattern_vectors = tfidf_matrix[:-1]
    similarities = cosine_similarity(problem_vector, pattern_vectors)[0]
    
    # Step 4: rank all patterns by similarity score
    ranked_indices = np.argsort(similarities)[::-1]
    top_pattern = patterns[ranked_indices[0]]
    top_score = similarities[ranked_indices[0]]
    
    return {
        "pattern": top_pattern,
        "confidence": round(float(top_score), 3),
        # also return top 3 so frontend can show alternatives
        "alternatives": [patterns[i] for i in ranked_indices[1:3]]
    }