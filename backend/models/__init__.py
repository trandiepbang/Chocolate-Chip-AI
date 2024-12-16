from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

from .message import ChatMessage
from .converstation import Converstation
