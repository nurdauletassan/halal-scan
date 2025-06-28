from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, func
from sqlalchemy.orm import relationship
from auth.base import Base

class ProductCheckHistory(Base):
    __tablename__ = "product_check_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_name = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    status = Column(String, nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True)
    ingredients = Column(JSON, nullable=True)
    halal_certificate = Column(String, nullable=True)
    reason = Column(String, nullable=True)
    confidence = Column(String, nullable=True)
    barcode = Column(String, nullable=True)
    manufacturer = Column(String, nullable=True)
    country = Column(String, nullable=True)
    additional_notes = Column(String, nullable=True)

    user = relationship("User", backref="product_check_history") 