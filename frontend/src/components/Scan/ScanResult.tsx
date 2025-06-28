import React from 'react';
import { Button } from '../ui/button';
import { Loader2, CheckCircle, Upload, Camera, Star, AlertTriangle, Shield, XCircle, Info } from 'lucide-react';

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

export default function ScanResult({ selectedImage, analysisResult, isAnalyzing, resetAnalysis, analyzeImage, fileInputRef }) {
  if (!selectedImage) return null;

  const confidenceColor = {
    высокая: "bg-green-300",
    средняя: "bg-yellow-300",
    низкая: "bg-red-300",
  }[analysisResult?.confidence as string] || "bg-gray-300";
      
  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="text-center">
        <div className="relative inline-block">
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Uploaded product"
            className="max-w-full max-h-40 rounded-lg shadow-md"
          />
        </div>
      </div>
      {/* Analysis Button */}
      {!analysisResult && !isAnalyzing && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-center items-center">
          <Button
            onClick={analyzeImage}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 w-full sm:w-auto text-xs sm:text-sm"
            size="sm"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Проверить
          </Button>
          <Button
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
                fileInputRef.current.click();
              }
            }}
            variant="outline"
            className="border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 px-4 py-2 w-full sm:w-auto text-xs sm:text-sm"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            Другое фото
          </Button>
        </div>
      )}
      {/* Loading State */}
      {isAnalyzing && (
        <div className="text-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-gray-700 mb-1">Анализируем...</h3>
          <p className="text-gray-500 text-xs">ИИ изучает состав и сертификацию продукта</p>
        </div>
      )}
      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-4">
          {/* Main Result Card */}
          <div className="relative overflow-hidden">
            <div className={`bg-gradient-to-br ${getStatusConfig(analysisResult.status).color} rounded-2xl p-3 sm:p-6 text-white shadow-xl`}>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-0">
                  <div className="flex items-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 mr-2 sm:mr-4">
                      {getStatusConfig(analysisResult.status).icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-xl mb-0.5 sm:mb-1">
                        {getStatusConfig(analysisResult.status).label}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm break-words">{analysisResult.productName}</p>
                    </div>
                  </div>
                  {/* Chance Category */}
                  {analysisResult.status !== "irrelevant" && (
                    <div className="text-right">
                      <div className="inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                        <div className={`w-2 h-2 rounded-full mr-2 ${confidenceColor}`}></div>
                        <span className="text-xs sm:text-sm font-medium text-white">
                          {analysisResult.confidence} шанс
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-4">
                  <p className="text-white/90 leading-relaxed text-xs sm:text-sm break-words">{analysisResult.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Details Grid */}
          {analysisResult.status !== "irrelevant" && (
            <div className="grid gap-2">
              {/* Certification */}
              {analysisResult.certification && (
                <div className="bg-white rounded-xl p-3 shadow-md border border-gray-100">
                  <div className="flex items-center mb-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-1 mr-2">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm text-gray-800">Сертификация</h4>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2">
                    <p className="text-green-800 font-medium text-sm">{analysisResult.certification}</p>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              {analysisResult.ingredients?.length > 0 && (
                <div className="bg-white rounded-xl p-2 sm:p-3 shadow-md border border-gray-100">
                  <div className="flex items-center mb-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-1 mr-2">
                      <Info className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-800">Состав продукта</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {analysisResult.ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-2 border border-gray-200 break-words"
                      >
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs font-medium text-gray-700 break-words">{ingredient}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {analysisResult.concerns?.length > 0 && (
                <div className="bg-white rounded-xl p-3 shadow-md border border-orange-200">
                  <div className="flex items-center mb-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-1 mr-2">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-sm text-orange-800">Проблемные компоненты</h4>
                  </div>
                  <div className="space-y-1">
                    {analysisResult.concerns.map((concern, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2 border-l-4 border-orange-400"
                      >
                        <div className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 mt-1"></div>
                          <span className="text-xs text-orange-800 leading-relaxed">{concern}</span>
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
            <div className="flex flex-col sm:flex-row gap-2 pt-1 justify-center items-center">
              <Button
                onClick={resetAnalysis}
                variant="outline"
                className="w-full sm:w-auto border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 px-4 py-2 hover:text-black transition-all duration-200 text-xs"
                size="sm"
              >
                <Camera className="mr-2 h-4 w-4" />
                Проверить другой
              </Button>
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                size="sm"
              >
                <Star className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button
                onClick={resetAnalysis}
                variant="default"
                className="w-full sm:w-auto  bg-green hover:border-green-600 hover:bg-gray-50 transition-all duration-200 color-black text-xs"
                size="sm"
              >
                <Camera className="mr-2 h-4 w-4" />
                Проверить другой
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 