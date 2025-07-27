from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, func, BigInteger
from typing import Optional
from datetime import datetime
from . import db

class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80))
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    strava_athlete_id: Mapped[Optional[int]] = mapped_column(BigInteger, unique=True)
    access_token: Mapped[str] = mapped_column(String(255), nullable = False)
    refresh_token: Mapped[str] = mapped_column(String(255), nullable = False)
    token_expires_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    profile_picture: Mapped[str] = mapped_column(String(255), nullable = False)
 
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    activities: Mapped[list["StravaActivity"]] = relationship("StravaActivity", back_populates="user")

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
    def is_token_expired(self) -> bool:
        if self.token_expires_at is None:
            return True
        
        return datetime.now() > self.token_expires_at

class StravaActivity(db.Model):
    __tablename__ = 'strava_activities'

    id: Mapped[int] = mapped_column(Integer, primary_key=True) #Given by PostgreSQL database
    strava_activity_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable = False) #Unique Strava ID for the activity (not the USER that enters it)
    
    name: Mapped[str] = mapped_column(String(255))
    activity_type: Mapped[str] = mapped_column(String(50))
    distance: Mapped[Optional[float]] = mapped_column(Float) #Meters
    elapsed_time: Mapped[int] = mapped_column(Integer) #Seconds
    description: Mapped[str] = mapped_column(String (255))
    start_date_local: Mapped[Optional[datetime]] = mapped_column(DateTime)
    strava_athlete_id: Mapped[int] = mapped_column(Integer)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="activities")
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}