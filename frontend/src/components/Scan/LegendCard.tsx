import React from 'react';
import { Card, CardContent } from '../ui/card';
import { LucideProps } from 'lucide-react';

interface LegendCardProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  iconBgFrom: string;
  iconBgTo: string;
  textColor: string;
  descriptionColor: string;
}

const LegendCard: React.FC<LegendCardProps> = ({
  icon: Icon,
  title,
  description,
  gradientFrom,
  gradientTo,
  iconBgFrom,
  iconBgTo,
  textColor,
  descriptionColor,
}) => {
  return (
    <div className="group">
      <Card className={`border-0 shadow-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} hover:shadow-xl transition-all duration-300 cursor-pointer h-full`}>
        <CardContent className="flex flex-col items-center justify-between h-full p-4 sm:p-4">
          <div className={`bg-gradient-to-r ${iconBgFrom} ${iconBgTo} w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md group-hover:scale-105 transition-transform duration-200`}>
            <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div className="text-center">
            <h3 className={`font-bold text-sm sm:text-base ${textColor} mb-1.5`}>{title}</h3>
            <p className={`text-xs sm:text-sm ${descriptionColor} h-8 sm:h-10`}>{description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegendCard; 