# Project Setup Guide - BANG TRAN


## Note
- Please remmeber set your OPENAI_API_KEY otherwise the app will crash
- If you don't set OPENAI_API_KEY and make it fast, you can run OPENAI_API_KEY=XXX docker compose up --build <= this also work, for example
   OPENAI_API_KEY=XXX docker compose up --build
- YOU MUST setup .env for front end (Watch my video at 0:37 below )
     NEXT_PUBLIC_API_URL=http://localhost:8000
     NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000
   AND OPENAI_API_KEY for backend

## Video guide

https://www.youtube.com/watch?v=SB2FieuDJwI

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
### Docker way
2. RUN docker compose up --build 
3. Start the app 
   ```
   OPENAI_API_KEY=XXX docker compose up --build
   ```

### Non-docker way
2. Install dependencies:
   ```bash
   1. Please create virtual env first =>  python3 -m venv .venv  
   2. Active virtualenv => source .venv/bin/activate
   3. Install deps => pip3 install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   OPENAI_API_KEY=<your-api-key>
   ```

4. Start the backend server:
   ```bash
   1. Apply migration => ./scripts/apply_migration.sh
   2. Start app => ./scripts/start_app_local.sh OR you can do OPENAI_API_KEY=XXX ./scripts/start_app_local.sh
   ```

The backend server will run on `http://localhost:8000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
The frontend application will be available at `http://localhost:3000/`

