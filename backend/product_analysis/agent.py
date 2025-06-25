import base64
import os
import re
import json
import ast
from typing import Dict, Any, List
from openai import AsyncOpenAI
import httpx
from PIL import Image
from io import BytesIO
import pytesseract


class ProductAnalysisAgent:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY not set in environment")
        timeout = httpx.Timeout(20.0, connect=5.0)
        self.client = AsyncOpenAI(api_key=api_key, http_client=httpx.AsyncClient(timeout=timeout))

    async def analyze_image(self, image_content: bytes) -> Dict[str, Any]:
        base64_image = base64.b64encode(image_content).decode("utf-8")

        prompt = """
        На изображении — упаковка пищевого продукта.

        1. Прочитай только тот текст, который **разборчиво виден** на упаковке.
        2. Найди состав (если он есть) и выдай результат в JSON:

        {
          "brand": "...",
          "product_name": "...",
          "ingredients": ["Ингредиент1", "Ингредиент2", ...]
        }

        ⚠️ Если состав или название бренда/продукта не виден или не читаем:
        {
          "brand": null,
          "product_name": null,
          "ingredients": [],
          "note": "Состав или продукт не удалось распознать на изображении"
        }

        Не додумывай и не фантазируй ингредиенты. Используй **только** то, что видно на изображении.
        """

        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            },
                        },
                    ],
                }
            ],
            max_tokens=500,
            temperature=0,
            seed=42  # Для стабильности
        )

        result = response.choices[0].message.content
        match = re.search(r"```json\s*(\{[\s\S]*?\})\s*```", result)
        json_str = match.group(1) if match else result

        try:
            parsed = json.loads(json_str)
        except Exception:
            try:
                parsed = ast.literal_eval(json_str)
            except Exception:
                parsed = {
                    "brand": None,
                    "product_name": None,
                    "ingredients": [],
                    "note": "Ошибка разбора ответа от GPT"
                }

        brand = parsed.get("brand")
        product_name = parsed.get("product_name")
        ingredients = parsed.get("ingredients", [])

        if not ingredients:
            return {
                "brand": brand,
                "product_name": product_name,
                "ingredients": [],
                "status": "doubtful",
                "confidence": "низкая",
                "concerns": ["Состав не удалось извлечь с изображения"],
                "recommendation": "Попробуйте загрузить фото с более чётким изображением состава"
            }

        halal_json = await self.analyze_halal_status(brand, product_name, ingredients)
        try:
            halal_result = json.loads(halal_json)
        except Exception:
            match = re.search(r"\{[\s\S]*\}", halal_json)
            if match:
                try:
                    halal_result = ast.literal_eval(match.group(0))
                except Exception:
                    halal_result = self.default_halal_fail()
            else:
                halal_result = self.default_halal_fail()

        result = {
            "brand": brand,
            "product_name": product_name,
            "ingredients": ingredients,
            **halal_result
        }
        return result

    async def analyze_halal_status(self, brand: str, product_name: str, ingredients: List[str]) -> str:
        ingredients_text = "\n".join(f"- {i}" for i in ingredients)
        prompt = f"""
        Проанализируй продукт и состав на халяльность:

        Бренд: {brand}
        Продукт: {product_name}
        Состав:
        {ingredients_text}
        ❗ Если в составе есть кармин (E120, cochineal) — статус должен быть haram. Будь жестким это отвественная работа

        Верни строго JSON в таком формате:
        {{
          "status": "certified/clean/doubtful/haram",
          "confidence": "высокая/средняя/низкая",
          "concerns": ["..."],
          "recommendation": "..."
        }}

        ❗ Статусы:
        - certified — если есть халяль сертификат
        - clean — если состав чистый, но нет сертификата
        - doubtful — если есть сомнительные компоненты
        - haram — если есть харам ингредиенты
        """
        response = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0,
            seed=42
        )
        return response.choices[0].message.content

    def default_halal_fail(self, reason: str = "Не удалось проанализировать состав") -> Dict[str, Any]:
        return {
            "status": "doubtful",
            "confidence": "низкая",
            "concerns": [reason],
            "recommendation": "Проверьте состав вручную или поищите халяль сертификат."
        }

    def extract_ingredients_from_image(self, image_content: bytes) -> List[str]:
        image = Image.open(BytesIO(image_content))
        text = pytesseract.image_to_string(image, lang="rus+eng").lower()
        print("[OCR TEXT]", text)  # Для отладки, можно заменить на logging
        # Ищем все вхождения "состав" с разными разделителями и переносами
        matches = re.findall(r"состав[:\-\s]*([\w\W]+?)(?:[.!?\n\r]|$)", text)
        if not matches:
            return []
        # Берём первый найденный вариант
        raw_ingredients = matches[0].strip()
        # Иногда после слова "состав" идёт длинный текст, обрезаем по частым стоп-словам
        for stopword in ["пищевое ", "пищевая ", "энергетическая ", "условия хранения", "срок годности", "масса нетто", "производитель"]:
            idx = raw_ingredients.find(stopword)
            if idx > 10:
                raw_ingredients = raw_ingredients[:idx]
        # Очищаем и разбиваем
        ingredients = [i.strip().capitalize() for i in re.split(r",|;|\n|\r", raw_ingredients) if 2 < len(i.strip()) < 50]
        return ingredients
