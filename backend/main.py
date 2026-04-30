from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gemini AI Setup ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None

SYSTEM_PROMPT = """You are ElectionGuru, an expert AI assistant that helps Indian citizens understand the election process. 

Your knowledge includes:
- Indian Constitution and election laws
- Election Commission of India (ECI) procedures
- Voter registration (Form 6, NVSP portal, Voter Helpline App)
- Electoral rolls and EPIC (Voter ID)
- Candidate nomination process
- Model Code of Conduct (MCC)
- Electronic Voting Machines (EVMs) and VVPAT
- NOTA (None of the Above)
- Postal ballots and absentee voting
- Counting process and result declaration
- Lok Sabha, Rajya Sabha, and State Assembly elections
- Panchayat and Municipal elections

Guidelines:
- Be accurate, helpful, and concise
- Use bullet points and numbered lists for clarity
- Include relevant laws/rules when applicable
- If unsure, say so honestly
- Respond in the same language the user asks in (English or Hindi)
- Keep answers focused on Indian elections
"""

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"message": "Election Assistant Backend is Running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not client:
        return ChatResponse(response="AI is not configured. Please add your Gemini API key to backend/.env file.")
    
    try:
        # Build conversation contents
        contents = []
        for msg in request.history:
            role = "user" if msg.role == "user" else "model"
            contents.append(genai.types.Content(role=role, parts=[genai.types.Part(text=msg.content)]))
        
        # Add current user message
        contents.append(genai.types.Content(role="user", parts=[genai.types.Part(text=request.message)]))
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )
        
        return ChatResponse(response=response.text)
    except Exception as e:
        return ChatResponse(response=f"Sorry, I encountered an error: {str(e)}")

@app.get("/api/timeline")
def get_timeline():
    return [
        {"id": 1, "title": "Voter Registration", "description": "Register to vote before the deadline.", "date": "Month 1", "status": "completed"},
        {"id": 2, "title": "Candidate Nomination", "description": "Candidates file their nominations.", "date": "Month 2", "status": "current"},
        {"id": 3, "title": "Campaigning", "description": "Candidates campaign for votes.", "date": "Month 3", "status": "upcoming"},
        {"id": 4, "title": "Voting Day", "description": "Cast your vote at the polling booth.", "date": "Month 4", "status": "upcoming"},
        {"id": 5, "title": "Results", "description": "Votes are counted and results are declared.", "date": "Month 5", "status": "upcoming"}
    ]

@app.get("/api/myths-facts")
def get_myths_facts():
    return [
        {"id": 1, "myth": "I can vote online.", "fact": "Voting must be done in person at a designated polling booth or via authorized postal ballot."},
        {"id": 2, "myth": "If I don't vote, I lose my citizenship.", "fact": "Voting is a right, not a condition for citizenship."},
        {"id": 3, "myth": "EVMs can be easily hacked.", "fact": "EVMs are standalone machines not connected to any network and undergo strict security checks."}
    ]
