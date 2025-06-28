from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from .agent import ProductAnalysisAgent
from .schemas import ProductAnalysisResponse, ProductCheckHistoryCreate, ProductCheckHistoryResponse
from .models import ProductCheckHistory
from auth.database import SessionLocal
from sqlalchemy.orm import Session
import json
import logging
import ast
from fastapi import status

router = APIRouter(prefix="/products", tags=["products"])

def get_agent():
    return ProductAnalysisAgent()

@router.post("/analyze")
async def analyze_product(
    image: UploadFile = File(...),
    agent: ProductAnalysisAgent = Depends(get_agent)
):
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    content = await image.read()
    result = await agent.analyze_image(content)
    try:
        # Если результат уже словарь, возвращаем его напрямую
        if isinstance(result, dict):
            return result
        analysis_result = json.loads(result)
        return analysis_result
    except Exception as e:
        logging.error(f"OpenAI raw result: {result}")
        raise HTTPException(status_code=500, detail=f"Failed to parse analysis result: {result}")

@router.post("/history", response_model=ProductCheckHistoryResponse, status_code=status.HTTP_201_CREATED)
def save_history(item: ProductCheckHistoryCreate):
    # Сохраняем только если статус не unknown
    if item.status not in ["certified", "haram", "doubtful", "clean"]:
        raise HTTPException(status_code=400, detail="Invalid status for saving history")
    db: Session = SessionLocal()
    db_item = ProductCheckHistory(
        user_id=1,  # TODO: заменить на Depends(get_current_user) для реального пользователя
        product_name=item.product_name,
        brand=item.brand,
        status=item.status,
        image_url=item.image_url,
        category=item.category,
        ingredients=item.ingredients,
        halal_certificate=item.halal_certificate,
        reason=item.reason,
        confidence=item.confidence,
        barcode=item.barcode,
        manufacturer=item.manufacturer,
        country=item.country,
        additional_notes=item.additional_notes
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    db.close()
    return db_item

@router.get("/history", response_model=list[ProductCheckHistoryResponse])
def get_history():
    db: Session = SessionLocal()
    items = db.query(ProductCheckHistory).filter(ProductCheckHistory.user_id == 1).order_by(ProductCheckHistory.date.desc()).all()
    db.close()
    return items 