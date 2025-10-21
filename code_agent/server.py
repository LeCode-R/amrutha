# server.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import io
from datetime import datetime

# Import your agent
from ..code_agent.paper2code_agent.agent import root_agent, zip_tool_agent  # replace agent_file with your agent script name

app = FastAPI(title="ADK Gemini AI Agent Backend")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Models
# -----------------------------
class ChatRequest(BaseModel):
    message: str

# -----------------------------
# Endpoints
# -----------------------------
@app.get("/")
def root():
    return {"message": "ADK Gemini AI Agent Backend is running!"}

@app.get("/time")
def get_time():
    india_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return {"current_time": india_time}

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    if not req.message:
        return JSONResponse({"error": "Message is required"}, status_code=400)
    
    try:
        # Call your ADK agent
        response = root_agent(req.message)
        return {"response": response}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}

@app.post("/upload-paper")
def upload_paper(file: UploadFile = File(...)):
    if not file:
        return JSONResponse({"error": "File is required"}, status_code=400)
    
    contents = file.file.read().decode("utf-8")
    try:
        # Ask agent to generate code files
        code_files = root_agent(f"Generate Python code for the following paper:\n{contents}")
        
        # Create ZIP using your ZipTool
        zip_bytes = zip_tool_agent(files=code_files)

        return StreamingResponse(
            io.BytesIO(zip_bytes),
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=generated_code.zip"}
        )
    except Exception as e:
        return JSONResponse({"error": f"Error generating code: {str(e)}"}, status_code=500)

