from random import choice
from typing import TypedDict, List, Optional

class Expert(TypedDict):
    id: str
    name: str

EXPERTS: List[Expert] = [
    {
        "id": "1",
        "name": "Albert Einstein - The revolutionary physicist who developed the theory of relativity and changed our understanding of space, time, gravity and the universe."
    },
    {
        "id": "2",
        "name": "Marie Curie - Pioneer in radioactivity research, first woman to win a Nobel Prize, and only person to win Nobel Prizes in multiple sciences."
    },
    {
        "id": "3",
        "name": "Stephen Hawking - Theoretical physicist who made groundbreaking contributions to our understanding of black holes and the origins of the universe."
    },
    {
        "id": "4", 
        "name": "Jane Goodall - World's foremost expert on chimpanzees who revolutionized our understanding of primate behavior and conservation."
    },
    {
        "id": "5",
        "name": "Carl Jung - Influential psychoanalyst who founded analytical psychology and developed concepts of archetypes and the collective unconscious."
    },
    {
        "id": "6", 
        "name": "Noam Chomsky - Pioneering linguist and philosopher who revolutionized the field of linguistics and cognitive science."
    },
    {
        "id": "7",
        "name": "David Attenborough - Renowned naturalist and broadcaster who has documented wildlife and nature for over six decades."
    },
    {
        "id": "8",
        "name": "Neil deGrasse Tyson - Astrophysicist and science communicator known for making complex space concepts accessible to the public."
    },
    {
        "id": "9",
        "name": "Oliver Sacks - Neurologist and author who explored the mysteries of the human brain through fascinating case studies."
    },
    {
        "id": "10",
        "name": "Richard Feynman - Nobel Prize-winning physicist known for his work in quantum mechanics and his exceptional teaching ability."
    }
]

def get_all_experts() -> List[Expert]:
    """Returns a list of all available experts"""
    return EXPERTS

def get_random_expert() -> Expert:
    """Returns a randomly selected expert from the EXPERTS list"""
    return choice(EXPERTS)

def get_expert_by_id(expert_id: str) -> Optional[Expert]:
    """Returns an expert by their ID or None if not found"""
    return next((expert for expert in EXPERTS if expert["id"] == expert_id), None)