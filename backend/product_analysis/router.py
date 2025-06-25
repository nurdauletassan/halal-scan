from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from .agent import ProductAnalysisAgent
from .schemas import ProductAnalysisResponse
import json
import logging
import ast

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