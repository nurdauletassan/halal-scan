import React from 'react';
import { Button } from '../ui/button';
import { Camera, Upload } from 'lucide-react';

export default function ScanForm({ selectedImage, setSelectedImage, setAnalysisResult, fileInputRef, cameraInputRef }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        setSelectedImage(typeof result === 'string' ? result : null);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="text-center space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="border-2 border-dashed border-green-300 rounded-lg p-5 bg-green-50">
        <div className="space-y-2">
          <div className="flex justify-center">
            <Upload className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-700">Загрузите фото продукта</h3>
          <p className="text-gray-500 text-xs">
            Сфотографируйте этикетку продукта или загрузите изображение из галереи
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center ">
        <Button
          onClick={() => cameraInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-xs sm:text-sm"
          size="sm"
        >
          <Camera className="mr-2 h-4 w-4" />
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
          className="border-2 border-green-500 bg-white text-green-600 hover:bg-green-50 px-4 py-2 hover:text-black text-xs sm:text-sm"
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          Загрузить из галереи
        </Button>
      </div>
    </div>
  );
} 