from pydantic import BaseModel
from typing import List, Optional

class ProductAnalysisResponse(BaseModel):
    brand: str
    ingredients: List[str]
    halal_status: str
    concerns: Optional[List[str]] = None
    confidence: str 