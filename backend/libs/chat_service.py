import os
from openai import AsyncOpenAI

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
async def summarize_chat_history(chat_history: any) -> str:
    try:
        formatted_history = "\n".join([
            f"{msg['role']}: {msg['message']}" 
            for msg in chat_history
        ])

        messages = [
            {
                "role": "system",
                "content": "You are an AI assistant tasked with summarizing conversations. "
                          "Please provide a concise and very short (100 character max) summary of the converstation, let me show it on front end, user can click on past converstation like chatgpt"
            },
            {
                "role": "user",
                "content": f"Please summarize this conversation:\n{formatted_history}"
            }
        ]

        response = await client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.0,
            max_tokens=500
        )

        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Failed to summarize chat: {str(e)}")
    

async def answer_as_an_expert(expert_name: str, query: str, chat_history: any) -> str:
    try:
        formatted_history = "\n".join([
            f"{msg['role']}: {msg['message']}" 
            for msg in chat_history
        ])
        
        messages = [
            {
                "role": "system",
                "content": f"You are {expert_name}. Respond to queries using your expertise and knowledge. "
                          f"Keep responses professional and focused on your field of expertise. Please introduce yourself and name self when started converstation"
                          f"Previous conversation context:\n{formatted_history}"
            },
            {
                "role": "user",
                "content": query
            }
        ]

        response = await client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.0,
            max_tokens=1000,
            stream=True
        )
        
        async for chunk in response:
            yield chunk
            
    except Exception as e:
        raise Exception(f"Failed to get expert response: {str(e)}")