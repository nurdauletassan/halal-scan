"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import ScanForm from "../components/Scan/ScanForm"
import ScanResult from "../components/Scan/ScanResult"
import ScanLegend from "../components/Scan/ScanLegend"
import { analyzeProductImage } from "../services/productService"

/**
 * @typedef {Object} AnalysisResult
 * @property {boolean} isHalal - Whether the product is halal
 * @property {number} confidence - Confidence score of the analysis
 * @property {string} productName - Name of the product
 * @property {string[]} ingredients - List of ingredients
 * @property {string[]} concerns - List of concerns about the product
 * @property {string|null} certification - Halal certification status
 */

const ANALYSIS_RESULT_KEY = 'halalscan_analysis_result';
const SELECTED_IMAGE_KEY = 'halalscan_selected_image';

// Add this function to save to backend history
async function saveToHistory(result, imageUrl) {
  const payload = {
    product_name: result.productName,
    brand: result.brand || "",
    status: result.status, // "certified", "halal", "haram", "doubtful", "clean"
    image_url: imageUrl,
    category: result.category || "",
    ingredients: result.ingredients || [],
    halal_certificate: result.certification || "",
    reason: result.reason || "",
    confidence: result.confidence || 0,
    barcode: result.barcode || "",
    manufacturer: result.manufacturer || "",
    country: result.country || "",
    additional_notes: result.recommendation || "",
  };
  if (!["certified", "halal", "haram", "doubtful", "clean"].includes(payload.status)) return;
  try {
    await fetch("http://localhost:8000/api/v1/products/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}` // if needed
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Ошибка сохранения в историю:", e);
  }
}

export default function ScanPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Загружаем результат и изображение из localStorage при монтировании
  useEffect(() => {
    const cachedResult = localStorage.getItem(ANALYSIS_RESULT_KEY);
    if (cachedResult) {
      try {
        setAnalysisResult(JSON.parse(cachedResult));
      } catch {}
    }
    const cachedImage = localStorage.getItem(SELECTED_IMAGE_KEY);
    if (cachedImage) {
      setSelectedImage(cachedImage);
    }
  }, []);

  // Сохраняем selectedImage в localStorage при изменении
  useEffect(() => {
    if (selectedImage) {
      localStorage.setItem(SELECTED_IMAGE_KEY, selectedImage);
    }
  }, [selectedImage]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeProductImage(selectedImage);
      setAnalysisResult(data);
      localStorage.setItem(ANALYSIS_RESULT_KEY, JSON.stringify(data));
      // Save to backend history
      await saveToHistory(data, selectedImage);
    } catch (err) {
      const errorResult = {
        status: "error",
        confidence: "0",
        productName: "Ошибка",
        ingredients: [],
        concerns: [],
        error: err.message,
        recommendation: err.message || "Не удалось проанализировать изображение. Попробуйте еще раз.",
      };
      setAnalysisResult(errorResult);
      localStorage.setItem(ANALYSIS_RESULT_KEY, JSON.stringify(errorResult));
    }
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
    localStorage.removeItem(ANALYSIS_RESULT_KEY);
    localStorage.removeItem(SELECTED_IMAGE_KEY);
  }

  return (
    <div>
      <div className="container mx-auto px-6 py-6" >
        {/* Header with enhanced design */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 max-w-xl mx-auto leading-snug mb-2">
            🚀 Революционная проверка халяльности продуктов с помощью
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold"> ИИ</span>
              </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Просто сфотографируйте продукт и получите мгновенный детальный анализ ✨
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-green-600 text-white rounded-t-lg p-3">
              <CardTitle className="text-lg text-center">Проверить продукт</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4 pb-8 px-5 bg-white rounded-b-lg ">
              {!selectedImage && (
                <ScanForm
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  setAnalysisResult={setAnalysisResult}
                  fileInputRef={fileInputRef}
                  cameraInputRef={cameraInputRef}
                />
              )}
              <ScanResult
                selectedImage={selectedImage}
                analysisResult={analysisResult}
                isAnalyzing={isAnalyzing}
                resetAnalysis={resetAnalysis}
                analyzeImage={handleAnalyze}
                fileInputRef={fileInputRef}
              />
            </CardContent>
          </Card>
          <ScanLegend />
        </div>
      </div>
    </div>
  )
} 