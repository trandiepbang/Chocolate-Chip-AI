from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from db.database import Base

class Converstation(Base):
    __tablename__ = "converstation"

    id = Column(Integer, primary_key=True, index=True)
    converstation_id = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
    expert = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
