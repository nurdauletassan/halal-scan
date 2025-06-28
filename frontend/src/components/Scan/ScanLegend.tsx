import React from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import LegendCard from './LegendCard';

const legendItems = [
  {
    icon: Shield,
    title: 'Халяль',
    description: <>Имеет халяль<br />сертификат</>,
    gradientFrom: 'from-green-50',
    gradientTo: 'to-emerald-100',
    iconBgFrom: 'from-green-500',
    iconBgTo: 'to-emerald-600',
    textColor: 'text-green-800',
    descriptionColor: 'text-green-600',
  },
  {
    icon: CheckCircle,
    title: 'Чистый состав',
    description: <>Безопасные<br />ингредиенты</>,
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-cyan-100',
    iconBgFrom: 'from-blue-500',
    iconBgTo: 'to-cyan-600',
    textColor: 'text-blue-800',
    descriptionColor: 'text-blue-600',
  },
  {
    icon: AlertTriangle,
    title: 'Сомнительное',
    description: <>Требует<br />внимания</>,
    gradientFrom: 'from-yellow-50',
    gradientTo: 'to-orange-100',
    iconBgFrom: 'from-yellow-500',
    iconBgTo: 'to-orange-600',
    textColor: 'text-yellow-800',
    descriptionColor: 'text-yellow-600',
  },
  {
    icon: XCircle,
    title: 'Харам',
    description: <>Запрещенные<br />продукты</>,
    gradientFrom: 'from-red-50',
    gradientTo: 'to-rose-100',
    iconBgFrom: 'from-red-500',
    iconBgTo: 'to-rose-600',
    textColor: 'text-red-800',
    descriptionColor: 'text-red-600',
  },
];

export default function ScanLegend() {
  return (
    <div className="max-w-4xl mx-auto mb-8 mt-8 sm:mt-12">
      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">🎯 Категории халяльности</h2>
        <p className="text-sm sm:text-base text-gray-600">Наш ИИ классифицирует продукты по 4 уровням безопасности</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        {legendItems.map((item, index) => (
          <LegendCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
} 