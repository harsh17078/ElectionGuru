from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from google import genai
from typing import Optional
import os
import re

load_dotenv()

app = FastAPI()

# --- Mock Electoral Roll Database ---
ELECTORAL_ROLL = [
    {"epic": "ABC1234567", "name": "Rajesh Kumar", "dob": "1985-03-15", "state": "Delhi", "father": "Suresh Kumar", "constituency": "New Delhi", "part_no": "42", "serial_no": "318", "gender": "Male", "age": 41, "ac_name": "New Delhi Assembly", "polling_station": "Govt. Senior Secondary School, Mandir Marg"},
    {"epic": "DEF7654321", "name": "Priya Sharma", "dob": "1992-07-22", "state": "Maharashtra", "father": "Anil Sharma", "constituency": "Mumbai South", "part_no": "15", "serial_no": "1042", "gender": "Female", "age": 33, "ac_name": "Colaba Assembly", "polling_station": "BMC School, Cuffe Parade"},
    {"epic": "GHI9876543", "name": "Amit Singh", "dob": "1978-11-30", "state": "Uttar Pradesh", "father": "Ramesh Singh", "constituency": "Lucknow", "part_no": "88", "serial_no": "567", "gender": "Male", "age": 47, "ac_name": "Lucknow Central Assembly", "polling_station": "Primary School, Hazratganj"},
    {"epic": "JKL4561237", "name": "Sunita Devi", "dob": "1990-01-10", "state": "Bihar", "father": "Mahesh Prasad", "constituency": "Patna Sahib", "part_no": "23", "serial_no": "891", "gender": "Female", "age": 36, "ac_name": "Bankipur Assembly", "polling_station": "Middle School, Boring Road"},
    {"epic": "MNO3216549", "name": "Vikram Patel", "dob": "1988-05-18", "state": "Gujarat", "father": "Jayesh Patel", "constituency": "Ahmedabad East", "part_no": "67", "serial_no": "234", "gender": "Male", "age": 38, "ac_name": "Maninagar Assembly", "polling_station": "Community Hall, Maninagar"},
    {"epic": "PQR1593572", "name": "Ananya Reddy", "dob": "1995-09-05", "state": "Telangana", "father": "Venkat Reddy", "constituency": "Hyderabad", "part_no": "31", "serial_no": "456", "gender": "Female", "age": 30, "ac_name": "Jubilee Hills Assembly", "polling_station": "Govt. School, Banjara Hills"},
    {"epic": "STU7531594", "name": "Mohammed Iqbal", "dob": "1982-12-25", "state": "Kerala", "father": "Abdul Kareem", "constituency": "Thiruvananthapuram", "part_no": "12", "serial_no": "789", "gender": "Male", "age": 43, "ac_name": "Nemom Assembly", "polling_station": "LP School, Peroorkada"},
    {"epic": "VWX9517538", "name": "Deepika Nair", "dob": "1997-04-14", "state": "Karnataka", "father": "Suresh Nair", "constituency": "Bangalore South", "part_no": "55", "serial_no": "112", "gender": "Female", "age": 29, "ac_name": "BTM Layout Assembly", "polling_station": "Govt. High School, JP Nagar"},
    {"epic": "YZA8524567", "name": "Harpreet Kaur", "dob": "1986-08-20", "state": "Punjab", "father": "Gurdas Singh", "constituency": "Amritsar", "part_no": "38", "serial_no": "645", "gender": "Female", "age": 39, "ac_name": "Amritsar North Assembly", "polling_station": "Senior Secondary School, Hall Bazaar"},
    {"epic": "BCD2587413", "name": "Sanjay Gupta", "dob": "1975-06-02", "state": "West Bengal", "father": "Prakash Gupta", "constituency": "Kolkata North", "part_no": "71", "serial_no": "933", "gender": "Male", "age": 50, "ac_name": "Shyampukur Assembly", "polling_station": "Primary School, Sovabazar"},
]

INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
    "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
]

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


# --- Electoral Roll Verification ---

class VerifyVoterRequest(BaseModel):
    search_type: str  # "epic" or "details"
    epic: Optional[str] = None
    name: Optional[str] = None
    dob: Optional[str] = None  # YYYY-MM-DD
    state: Optional[str] = None

class VoterDetails(BaseModel):
    epic: str
    name: str
    father_name: str
    gender: str
    age: int
    state: str
    constituency: str
    ac_name: str
    part_no: str
    serial_no: str
    polling_station: str

class VerifyVoterResponse(BaseModel):
    found: bool
    message: str
    voter: Optional[VoterDetails] = None
    validation_errors: list[str] = []

@app.get("/api/states")
def get_states():
    return sorted(INDIAN_STATES)

@app.post("/api/verify-voter", response_model=VerifyVoterResponse)
async def verify_voter(request: VerifyVoterRequest):
    errors = []

    if request.search_type == "epic":
        # Validate EPIC format: 3 uppercase letters + 7 digits
        if not request.epic:
            errors.append("EPIC number is required.")
            return VerifyVoterResponse(found=False, message="Validation failed.", validation_errors=errors)

        epic_clean = request.epic.strip().upper()
        if not re.match(r'^[A-Z]{3}\d{7}$', epic_clean):
            errors.append("Invalid EPIC format. Must be 3 uppercase letters followed by 7 digits (e.g., ABC1234567).")
            return VerifyVoterResponse(found=False, message="Validation failed.", validation_errors=errors)

        # Search by EPIC
        for voter in ELECTORAL_ROLL:
            if voter["epic"] == epic_clean:
                return VerifyVoterResponse(
                    found=True,
                    message="✅ Voter found in the electoral roll!",
                    voter=VoterDetails(
                        epic=voter["epic"],
                        name=voter["name"],
                        father_name=voter["father"],
                        gender=voter["gender"],
                        age=voter["age"],
                        state=voter["state"],
                        constituency=voter["constituency"],
                        ac_name=voter["ac_name"],
                        part_no=voter["part_no"],
                        serial_no=voter["serial_no"],
                        polling_station=voter["polling_station"],
                    ),
                )

        return VerifyVoterResponse(
            found=False,
            message="❌ Voter not found in the electoral roll. Please verify your EPIC number or register at nvsp.in.",
        )

    elif request.search_type == "details":
        # Validate required fields
        if not request.name or not request.name.strip():
            errors.append("Full name is required.")
        if not request.dob:
            errors.append("Date of birth is required.")
        elif not re.match(r'^\d{4}-\d{2}-\d{2}$', request.dob):
            errors.append("Date of birth must be in YYYY-MM-DD format.")
        if not request.state or not request.state.strip():
            errors.append("State is required.")
        elif request.state.strip() not in INDIAN_STATES:
            errors.append(f"'{request.state}' is not a valid Indian state/UT.")

        if errors:
            return VerifyVoterResponse(found=False, message="Validation failed.", validation_errors=errors)

        # Search by Name + DOB + State (case-insensitive name match)
        search_name = request.name.strip().lower()
        search_dob = request.dob.strip()
        search_state = request.state.strip().lower()

        for voter in ELECTORAL_ROLL:
            if (voter["name"].lower() == search_name and
                voter["dob"] == search_dob and
                voter["state"].lower() == search_state):
                return VerifyVoterResponse(
                    found=True,
                    message="✅ Voter found in the electoral roll!",
                    voter=VoterDetails(
                        epic=voter["epic"],
                        name=voter["name"],
                        father_name=voter["father"],
                        gender=voter["gender"],
                        age=voter["age"],
                        state=voter["state"],
                        constituency=voter["constituency"],
                        ac_name=voter["ac_name"],
                        part_no=voter["part_no"],
                        serial_no=voter["serial_no"],
                        polling_station=voter["polling_station"],
                    ),
                )

        return VerifyVoterResponse(
            found=False,
            message="❌ Voter not found in the electoral roll. The name, date of birth, or state may not match our records. Please try searching by EPIC number or register at nvsp.in.",
        )

    else:
        return VerifyVoterResponse(
            found=False,
            message="Invalid search type. Use 'epic' or 'details'.",
            validation_errors=["search_type must be 'epic' or 'details'."],
        )

