from fastapi import APIRouter, WebSocket, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from datetime import datetime, timezone
from models.message import ChatMessage
from models.converstation import Converstation
from db import database
from schemas.response import ResponseModel
from libs.chat_service import summarize_chat_history, answer_as_an_expert
from libs.expert_selector import get_random_expert, get_expert_by_id

router = APIRouter()

@router.get("/chat/history")
async def get_chat_history(db: Session = Depends(database.get_db)):
    chat_history = db.query(Converstation)\
        .order_by(Converstation.created_at.desc())\
        .all()
    if not chat_history:
        return ResponseModel(data=[])
    return ResponseModel(data=chat_history)

@router.get("/chat/history/{conversation_id}")
async def get_conversation_history(
    conversation_id: str, 
    db: Session = Depends(database.get_db)
):
    chat_history = db.query(ChatMessage).filter(
        ChatMessage.converstation_id == conversation_id
    ).all()
    
    if not chat_history:
        return ResponseModel(
            data=[]
        )
    return ResponseModel(data=chat_history)


def serialize_chat_message(message: ChatMessage) -> dict:
    return {
        "id": message.id,
        "role": message.role,
        "message": message.message,
        "converstation_id": message.converstation_id,
        "created_at": message.created_at.isoformat(),
        "updated_at": message.updated_at.isoformat()
    }


@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(database.get_db)):
    await websocket.accept()
    
    
    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)
            chat_history = db.query(ChatMessage).filter(
                ChatMessage.converstation_id == data["converstation_id"]
            ).all()
            serialized_history = [serialize_chat_message(msg) for msg in chat_history]
            
            # Save user message to database
            user_message = ChatMessage(
                role="human",
                message=data["message"],
                converstation_id=data["converstation_id"],
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(user_message)
            db.commit()

            # exist converstation
            exist_converstation = db.query(Converstation).filter(
                Converstation.converstation_id == data["converstation_id"]
            ).all()
            
            converstation_payload = Converstation(
                converstation_id=data["converstation_id"],
            )

            if len(serialized_history) == 0:
                serialized_history.append(serialize_chat_message(user_message))

            if not exist_converstation:
                converstation_payload.summary = await summarize_chat_history(serialized_history)
                converstation_payload.expert = get_random_expert()["id"]
                converstation_payload.created_at = datetime.now(timezone.utc)
                converstation_payload.updated_at = datetime.now(timezone.utc)
                db.add(converstation_payload)
                db.commit()
            else:
                converstation_payload = exist_converstation[0]

            expert_asnwer = await answer_as_an_expert(
                get_expert_by_id(converstation_payload.expert), 
                data["message"],
                serialized_history
            )

            bot_message = ChatMessage(
                role="bot",
                message=expert_asnwer,
                converstation_id=data["converstation_id"],
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc)
            )
            db.add(bot_message)
            db.commit()

            if len(serialized_history) > 1:
                serialized_history.append(serialize_chat_message(user_message))
            serialized_history.append(serialize_chat_message(bot_message))

            # Send response back to client
            await websocket.send_text(json.dumps(serialized_history))

    except json.JSONDecodeError as je:
        await websocket.send_text(json.dumps({
            "error": "Failed to parse JSON",
            "details": str(je),
            "status": 400
        }))
    except Exception as e:
        print("Exception ", e)
        print(e)
