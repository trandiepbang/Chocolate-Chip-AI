from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine
from routers import chat
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = "/api/v1"
app.include_router(chat.router, prefix=prefix)

@app.get("/")
async def root():
    return {"message": "ChatGPT Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)