## DSA Hint Generator

An AI-powered tool that gives scaffolded hints for LeetCode-style problems 
using the Socratic method.

### ML Model
- Pattern classifier trained on 3,400+ LeetCode problems
- SVM with Sentence Embeddings (all-MiniLM-L6-v2)
- 73.3% accuracy, Macro F1: 0.76
- 12 DSA pattern classes

### Stack
- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- ML: Scikit-learn, SentenceTransformers
- Database: PostgreSQL (Supabase)
- Auth: NextAuth.js + Google OAuth