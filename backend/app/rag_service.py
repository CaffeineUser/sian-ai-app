import os
import json
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google Gemini API Key
api_key = os.getenv("GEMINI_API_KEY")
if api_key and api_key != "YOUR_GEMINI_API_KEY_HERE":
    genai.configure(api_key=api_key)

# File paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KNOWLEDGE_BASE_PATH = os.path.join(BASE_DIR, "data", "knowledge_base.json")
EMBEDDINGS_CACHE_PATH = os.path.join(BASE_DIR, "data", "embeddings_cache.json")

class RAGService:
    def __init__(self):
        self.knowledge_base = []
        self.embeddings_cache = {}
        self.load_knowledge_base()
        
    def load_knowledge_base(self):
        """Loads knowledge base from JSON file."""
        if os.path.exists(KNOWLEDGE_BASE_PATH):
            with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
                self.knowledge_base = json.load(f)
        else:
            self.knowledge_base = []
            
        # Create directories if they do not exist
        os.makedirs(os.path.dirname(EMBEDDINGS_CACHE_PATH), exist_ok=True)
        
        # Load cached embeddings if they exist
        if os.path.exists(EMBEDDINGS_CACHE_PATH):
            try:
                with open(EMBEDDINGS_CACHE_PATH, "r", encoding="utf-8") as f:
                    self.embeddings_cache = json.load(f)
            except Exception:
                self.embeddings_cache = {}

    def get_embedding(self, text: str) -> list:
        """Calls Gemini API to generate embeddings for a given text."""
        if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
            raise ValueError("GEMINI_API_KEY is not configured. Please add your key to backend/.env")
        
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_document"
        )
        return response['embedding']

    def ingest_knowledge_base(self, force: bool = False):
        """Generates and caches embeddings for all items in the knowledge base."""
        updated = False
        for item in self.knowledge_base:
            item_id = item["id"]
            # If embedding is not cached, or if force is True, generate it
            if item_id not in self.embeddings_cache or force:
                print(f"Generating embedding for: {item['title']}...")
                # We combine category, title, and content for a richer vector context
                text_to_embed = f"Kategori: {item['category']}\nJudul: {item['title']}\nKonten: {item['content']}"
                try:
                    embedding = self.get_embedding(text_to_embed)
                    self.embeddings_cache[item_id] = embedding
                    updated = True
                except Exception as e:
                    print(f"Error generating embedding for {item_id}: {e}")
                    
        if updated:
            with open(EMBEDDINGS_CACHE_PATH, "w", encoding="utf-8") as f:
                json.dump(self.embeddings_cache, f, ensure_ascii=False, indent=2)
            print("Embeddings cache successfully saved.")

    def cosine_similarity(self, vec_a, vec_b) -> float:
        """Calculates cosine similarity between two vectors."""
        a = np.array(vec_a)
        b = np.array(vec_b)
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return float(dot_product / (norm_a * norm_b))

    def retrieve_context(self, query: str, top_k: int = 3) -> list:
        """Retrieves context by combining JSON knowledge base with MySQL database records."""
        from app.db import db
        
        # 1. Fetch adat facts from the MySQL pengetahuan_adat_vdb table
        db_facts = []
        try:
            db_facts = db.execute_query(
                "SELECT id, jenis_ulos, filosofi_dan_pakem FROM pengetahuan_adat_vdb",
                fetch_all=True
            )
        except Exception as e:
            print(f"Error querying pengetahuan_adat_vdb: {e}")
            
        results = []
        q_lower = query.lower()
        
        # 2. Add and score facts from MySQL
        if db_facts:
            for fact in db_facts:
                score = 0.5
                # Boost score if Ulos type is explicitly mentioned in query
                if fact["jenis_ulos"].lower() in q_lower:
                    score = 0.95
                elif any(word in q_lower for word in fact["jenis_ulos"].lower().split()):
                    score = 0.8
                
                results.append({
                    "score": score,
                    "id": f"db-{fact['id']}",
                    "category": "Pakem & Filosofi Adat",
                    "title": fact["jenis_ulos"],
                    "content": fact["filosofi_dan_pakem"]
                })
                
        # 3. Add static knowledge base chunks if available
        for item in self.knowledge_base:
            score = 0.4
            if item["title"].lower() in q_lower or item["category"].lower() in q_lower:
                score = 0.75
            results.append({
                "score": score,
                "id": str(item["id"]),
                "category": item["category"],
                "title": item["title"],
                "content": item["content"]
            })
            
        # 4. Sort results by similarity score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def generate_answer(self, query: str, chat_history: list = None) -> dict:
        """Performs RAG: retrieves context and generates an answer using Gemini."""
        if not api_key or api_key == "YOUR_GEMINI_API_KEY_HERE":
            return {
                "response": "Error: GEMINI_API_KEY belum dikonfigurasi di backend/.env. Silakan masukkan API Key Anda.",
                "context_chunks": []
            }
            
        # 1. Retrieve relevant context chunks
        context_chunks = self.retrieve_context(query, top_k=3)
        
        # 2. Assemble context text
        context_text = ""
        for i, chunk in enumerate(context_chunks):
            context_text += f"\nDokumen [{i+1}] ({chunk['category']} - {chunk['title']}):\n{chunk['content']}\n"
            
        # 3. Setup system instructions
        system_instruction = (
            "Kamu adalah SianAI, asisten virtual dan penasihat ahli untuk pelaku UMKM Tenun Ulos Batak di Sumatera Utara.\n"
            "Tugas utamanya adalah menjawab pertanyaan pengguna secara ramah, sopan, dan akurat dengan memanfaatkan kearifan lokal.\n"
            "Gunakan dokumen informasi berikut sebagai referensi utama kamu:\n"
            "---------------------\n"
            f"{context_text}\n"
            "---------------------\n"
            "Aturan penting:\n"
            "1. Jawablah berdasarkan informasi yang ada pada dokumen referensi di atas.\n"
            "2. Jika jawaban tidak ditemukan di dokumen referensi, cobalah untuk tetap menjawab dengan ramah tetapi jelaskan bahwa informasi tersebut tidak tercantum secara eksplisit dalam panduan resmi adat SianAI.\n"
            "3. Jika pengguna meminta dibuatkan caption promosi, hubungkan nilai filosofis Ulos tersebut dengan gaya bahasa promosi sosial media yang menarik (gunakan emoji Batak/Indonesia yang relevan).\n"
            "4. Tulislah dalam Bahasa Indonesia yang baik dan mudah dipahami oleh pedagang/penenun tradisional."
        )
        
        # 4. Format history for model configuration
        # Gemini API works well with simple messages list or generative model session
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_instruction
            )
            
            # Simple prompt assembly if chat history is empty
            full_prompt = query
            if chat_history:
                # Format simple history string for prompt context
                history_str = "Riwayat Percakapan Sebelumnya:\n"
                for msg in chat_history:
                    role = "Pengguna" if msg.get("role") == "user" else "SianAI"
                    history_str += f"{role}: {msg.get('content')}\n"
                full_prompt = f"{history_str}\nPengguna: {query}\nSianAI:"
                
            response = model.generate_content(
                full_prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=500,
                    temperature=0.7
                )
            )
            
            return {
                "response": response.text,
                "context_chunks": context_chunks
            }
        except Exception as e:
            return {
                "response": f"Terjadi kesalahan saat memproses permintaan ke Gemini API: {str(e)}",
                "context_chunks": context_chunks
            }
