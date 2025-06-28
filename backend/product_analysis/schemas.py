from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductAnalysisResponse(BaseModel):
    brand: str
    ingredients: List[str]
    halal_status: str
    concerns: Optional[List[str]] = None
    confidence: str

class ProductCheckHistoryCreate(BaseModel):
    product_name: Optional[str] = None
    brand: Optional[str] = None
    manufacturer: Optional[str] = None
    country: Optional[str] = None
    status: str
    image_url: Optional[str] = None
    category: Optional[str] = None
    ingredients: Optional[List[str]] = None
    halal_certificate: Optional[str] = None
    reason: Optional[str] = None
    confidence: Optional[str] = None
    barcode: Optional[str] = None
    additional_notes: Optional[str] = None

class ProductCheckHistoryResponse(ProductCheckHistoryCreate):
    id: int
    date: datetime 