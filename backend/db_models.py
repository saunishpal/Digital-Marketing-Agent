from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base


class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)

    role = Column(String, nullable=False, default="user")
    package_name = Column(String, nullable=False, default="starter")
    is_active = Column(Boolean, nullable=False, default=True)

    profiles = relationship("BusinessProfileDB", back_populates="owner")


class BusinessProfileDB(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    business_name = Column(String, nullable=False)
    niche = Column(String, nullable=False)
    city = Column(String, nullable=False)
    services = Column(String, nullable=False)
    target_audience = Column(String, nullable=False)
    main_offer = Column(String, nullable=False)
    whatsapp = Column(String, nullable=True)
    website = Column(String, nullable=True)
    usp = Column(String, nullable=False)

    owner = relationship("UserDB", back_populates="profiles")
    leads = relationship("LeadDB", back_populates="profile")


class LeadDB(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("business_profiles.id"), nullable=False)

    lead_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    source = Column(String, nullable=True)
    service = Column(String, nullable=True)
    city = Column(String, nullable=True)
    status = Column(String, nullable=False, default="new")
    notes = Column(Text, nullable=True)

    profile = relationship("BusinessProfileDB", back_populates="leads")


class DemoRequestDB(Base):
    __tablename__ = "demo_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    business_name = Column(String, nullable=False)
    niche = Column(String, nullable=False)
    city = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    need = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="new")