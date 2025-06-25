"use client"

import React, { useState, useRef } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Camera, Upload, CheckCircle, XCircle, Loader2, Info, Star, AlertTriangle, Shield } from "lucide-react"

/**
 * @typedef {Object} AnalysisResult
 * @property {boolean} isHalal - Whether the product is halal
 * @property {number} confidence - Confidence score of the analysis
 * @property {string} productName - Name of the product
 * @property {string[]} ingredients - List of ingredients
 * @property {string[]} concerns - List of concerns about the product
 * @property {string|null} certification - Halal certification status
 */

export default function HalalCheckApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<null | {
    status: string
    confidence: string
    productName: string
    ingredients: string[]
    concerns: string[]
    certification?: string | null
    recommendation?: string
    brand?: string
    product_name?: string
    error?: string
  }>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const getStatusConfig = (status) => {
    switch (status) {
      case "certified":
        return {
          label: "🏆 СЕРТИФИЦИРОВАН",
          color: "from-green-500 to-emerald-600",
          bgColor: "bg-green-400",
          icon: <Shield className="h-8 w-8 animate-pulse" />,
          textColor: "text-green-800",
          badgeColor: "bg-green-100 text-green-800",
        }
      case "clean":
        return {
          label: "СОСТАВ ЧИСТЫЙ",
          color: "from-blue-500 to-cyan-600",
          bgColor: "bg-blue-400",
          icon: <CheckCircle className="h-8 w-8 animate-pulse" />,
          textColor: "text-blue-800",
          badgeColor: "bg-blue-100 text-blue-800",
        }
      case "doubtful":
        return {
          label: "СОМНИТЕЛЬНОЕ",
          color: "from-yellow-500 to-orange-600",
          bgColor: "bg-yellow-400",
          icon: <AlertTriangle className="h-8 w-8 animate-pulse" />,
          textColor: "text-yellow-800",
          badgeColor: "bg-yellow-100 text-yellow-800",
        }
      case "haram":
        return {
          label: "ХАРАМ",
          color: "from-red-500 to-rose-600",
          bgColor: "bg-red-400",
          icon: <XCircle className="h-8 w-8 animate-pulse" />,
          textColor: "text-red-800",
          badgeColor: "bg-red-100 text-red-800",
        }
      default:
        return {
          label: "Неизвестно",
          color: "from-gray-400 to-gray-600",
          bgColor: "bg-gray-400",
          icon: <Info className="h-8 w-8 animate-pulse" />,
          textColor: "text-gray-800",
          badgeColor: "bg-gray-100 text-gray-800",
        }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const result = ev.target?.result
        setSelectedImage(typeof result === 'string' ? result : null)
        setAnalysisResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return
    setIsAnalyzing(true)
    try {
      // Преобразуем base64 обратно в файл
      const res = await fetch(selectedImage)
      const blob = await res.blob()
      const file = new File([blob], "product.jpg", { type: blob.type })
      const formData = new FormData()
      formData.append("image", file)
      const apiResponse = await fetch("http://localhost:8000/api/v1/products/analyze", {
        method: "POST",
        body: formData,
      })
      if (!apiResponse.ok) {
        throw new Error("Ошибка анализа продукта")
      }
      const data = await apiResponse.json()
      const normalizedData = {
        ...data,
        productName: data.productName || data.product_name || "",
        brand: data.brand || "",
      }
      if (
        normalizedData.status === "irrelevant" ||
        !normalizedData.ingredients?.length ||
        !normalizedData.productName
      ) {
        setAnalysisResult({
          status: "irrelevant",
          confidence: "0",
          productName: "Неопознанный объект",
          ingredients: [],
          concerns: [],
          certification: null,
          recommendation:
            "На фото не обнаружен пищевой продукт. Пожалуйста, сфотографируйте этикетку продукта питания с четко видимым составом.",
        })
      } else {
        setAnalysisResult(normalizedData)
      }
    } catch (err) {
      setAnalysisResult({
        status: "error",
        confidence: "0",
        productName: "",
        ingredients: [],
        concerns: [],
        error: err.message,
      })
    }
    setIsAnalyzing(false)
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  const confidenceColor = {
    высокая: "bg-green-300",
    средняя: "bg-yellow-300",
    низкая: "bg-red-300",
  }[analysisResult?.confidence as string] || "bg-gray-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative">
      {/* Background decorative elements - always full screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-0 -left-20 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with enhanced design */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
            </div>
            <div className="ml-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-800 via-emerald-700 to-teal-800 bg-clip-text text-transparent">
                HalalCheck AI
              </h1>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
            🚀 Революционная проверка халяльности продуктов с помощью 
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-bold"> искусственного интеллекта</span>
          </p>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Просто сфотографируйте продукт и получите мгновенный детальный анализ ✨
          </p>

          
        </div>

        

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">Проверить продукт</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-6">
              {/* input[type=file] всегда в DOM */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {!selectedImage ? (
                /* Upload Section */
                <div className="text-center space-y-6">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-12 bg-green-50">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Upload className="h-16 w-16 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700">Загрузите фото продукта</h3>
                      <p className="text-gray-500">
                        Сфотографируйте этикетку продукта или загрузите изображение из галереи
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                      size="lg"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Сфотографировать
                    </Button>
                    <Button
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                          fileInputRef.current.click();
                        }
                      }}
                      variant="outline"
                      className="border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 px-8 py-3 hover:text-black"
                      size="lg"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Загрузить из галереи
                    </Button>
                  </div>
                </div>
              ) : (
                /* Analysis Section */
                <div className="space-y-6">
                  {/* Image Preview */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Uploaded product"
                        className="max-w-full max-h-64 rounded-lg shadow-md"
                      />
                    </div>
                  </div>

                  {/* Analysis Button */}
                  {!analysisResult && !isAnalyzing && (
                    <div className="flex justify-center gap-4 mt-4">
                      <Button
                        onClick={analyzeImage}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                        size="lg"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Проверить халяльность
                      </Button>
                      <Button
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                            fileInputRef.current.click();
                          }
                        }}
                        variant="outline"
                        className="border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 px-8 py-3 hover:text-black"
                        size="lg"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Выбрать другое фото
                      </Button>
                    </div>
                  )}

                  {/* Loading State */}
                  {isAnalyzing && (
                    <div className="text-center py-8">
                      <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Анализируем продукт...</h3>
                      <p className="text-gray-500">ИИ изучает состав и сертификацию продукта</p>
                    </div>
                  )}
                  {/* Analysis Results - Beautiful */}
                  {analysisResult && (
                    <div className="space-y-6">
                      {/* Main Result Card */}
                      <div className="relative overflow-hidden">
                        <div
                          className={`bg-gradient-to-br ${getStatusConfig(analysisResult.status).color} rounded-2xl p-6 text-white shadow-xl`}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
                                backgroundSize: "24px 24px",
                              }}
                            ></div>
                          </div>

                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4">
                                  {getStatusConfig(analysisResult.status).icon}
                                </div>
                                <div>
                                  <h3 className="font-bold text-xl mb-1">
                                    {getStatusConfig(analysisResult.status).label}
                                  </h3>
                                  <p className="text-white/80 text-sm">{analysisResult.productName}</p>
                                </div>
                              </div>

                              {/* Chance Category */}
                              {analysisResult.status !== "irrelevant" && (
                                <div className="text-right">
                                  <div
                                    className={`inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full mr-2 ${confidenceColor}`}
                                    ></div>
                                    <span className="text-sm font-medium text-white">
                                      {analysisResult.confidence} шанс
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                              <p className="text-white/90 leading-relaxed">{analysisResult.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      {analysisResult.status !== "irrelevant" && (
                        <div className="grid gap-4">
                          {/* Certification */}
                          {analysisResult.certification && (
                            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                              <div className="flex items-center mb-3">
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-2 mr-3">
                                  <Star className="h-5 w-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-gray-800">Сертификация</h4>
                              </div>
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                                <p className="text-green-800 font-medium">{analysisResult.certification}</p>
                              </div>
                            </div>
                          )}

                          {/* Ingredients */}
                          {analysisResult.ingredients.length > 0 && (
                            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                              <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-2 mr-3">
                                  <Info className="h-5 w-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-gray-800">Состав продукта</h4>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {analysisResult.ingredients.map((ingredient, index) => (
                                  <div
                                    key={index}
                                    className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 border border-gray-200"
                                  >
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                      <span className="text-sm font-medium text-gray-700">{ingredient}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Concerns */}
                          {analysisResult.concerns.length > 0 && (
                            <div className="bg-white rounded-xl p-5 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
                              <div className="flex items-center mb-4">
                                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-2 mr-3">
                                  <AlertTriangle className="h-5 w-5 text-white" />
                                </div>
                                <h4 className="font-semibold text-orange-800">Проблемные компоненты</h4>
                              </div>
                              <div className="space-y-2">
                                {analysisResult.concerns.map((concern, index) => (
                                  <div
                                    key={index}
                                    className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border-l-4 border-orange-400"
                                  >
                                    <div className="flex items-start">
                                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                                      <span className="text-sm text-orange-800 leading-relaxed">{concern}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {analysisResult.status !== "irrelevant" ? (
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={resetAnalysis}
                            variant="outline"
                            className="flex-1 border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 px-8 py-3 hover:text-black transition-all duration-200"
                            size="lg"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Проверить другой
                          </Button>
                          <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                            size="lg"
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Сохранить
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-3 pt-2">
                          <Button
                            onClick={resetAnalysis}
                            variant="default"
                            className="flex-1 border-2 border-black bg-white hover:border-green-600 hover:bg-gray-50 transition-all duration-200 color-black"
                            size="lg"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Проверить другой
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
        {/* Enhanced Status Legend */}
        <div className="max-w-5xl mx-auto mb-12 mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">🎯 Категории халяльности</h2>
            <p className="text-gray-600">Наш ИИ классифицирует продукты по 4 уровням безопасности</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            <div className="group h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                <CardContent className="flex-1 flex flex-col justify-between p-6 pt-6 text-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-green-800 mb-2">🏆 Сертифицирован</h3>
                  <p className="text-sm text-green-600 mb-3">Официальный халяль сертификат</p>
                  <div className="bg-green-200 rounded-full h-2 w-full">
                    <div className="bg-green-500 h-2 rounded-full w-full"></div>
                  </div>
                  <p className="text-xs text-green-700 mt-2 font-semibold">100% безопасно</p>
                </CardContent>
              </Card>
            </div>

            <div className="group h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                <CardContent className="flex-1 flex flex-col justify-between p-6 pt-6 text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-blue-800 mb-2">✅ Состав чистый</h3>
                  <p className="text-sm text-blue-600 mb-3">Безопасные ингредиенты</p>
                  <div className="bg-blue-200 rounded-full h-2 w-full">
                    <div className="bg-blue-500 h-2 rounded-full w-4/5"></div>
                  </div>
                  <p className="text-xs text-blue-700 mt-2 font-semibold">Рекомендуется</p>
                </CardContent>
              </Card>
            </div>

            <div className="group h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                <CardContent className="flex-1 flex flex-col justify-between p-6 pt-6 text-center">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-yellow-800 mb-2">⚠️ Сомнительное</h3>
                  <p className="text-sm text-yellow-600 mb-3">Требует осторожности</p>
                  <div className="bg-yellow-200 rounded-full h-2 w-full">
                    <div className="bg-yellow-500 h-2 rounded-full w-3/5"></div>
                  </div>
                  <p className="text-xs text-yellow-700 mt-2 font-semibold">Изучите состав</p>
                </CardContent>
              </Card>
            </div>

            <div className="group h-full">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-rose-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer h-full flex flex-col">
                <CardContent className="flex-1 flex flex-col justify-between p-6 pt-6 text-center">
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-red-800 mb-2">❌ Харам</h3>
                  <p className="text-sm text-red-600 mb-3">Запрещенные ингредиенты</p>
                  <div className="bg-red-200 rounded-full h-2 w-full">
                    <div className="bg-red-500 h-2 rounded-full w-1/5"></div>
                  </div>
                  <p className="text-xs text-red-700 mt-2 font-semibold">Избегайте</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
} 