import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Trend {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  image: string;
  category: string;
  score: number;
}

interface TrendsCarouselProps {
  trends: Trend[];
}

export function TrendsCarousel({ trends }: TrendsCarouselProps) {
  const [currentTrend, setCurrentTrend] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setCurrentTrend((prev) => (prev + 1) % trends.length);
        setProgress(0);
      }, 300);
    }
  }, [progress, trends.length]);

  const handleTrendClick = (index: number) => {
    setCurrentTrend(index);
    setProgress(0);
  };

  return (
    <div className="w-full py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-terracotta font-semibold text-sm uppercase tracking-wider">
          Últimas Análises
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
          Tendências em Destaque
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Side - Trends List */}
        <div className="space-y-4">
          {trends.map((trend, index) => {
            const Icon = trend.icon;
            const isActive = currentTrend === index;

            return (
              <Card 
                key={trend.id}
                className={`cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? "border-terracotta/30 shadow-md bg-gradient-to-r from-white to-peach/5" 
                    : "border-gray-200 hover:border-terracotta/20"
                }`}
                onClick={() => handleTrendClick(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icon and Score */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${
                        isActive ? "bg-terracotta text-white" : "bg-peach/20 text-terracotta"
                      }`}>
                        <Icon size={18} />
                      </div>
                      <span className={`text-xs font-medium mt-1 ${
                        isActive ? "text-terracotta" : "text-gray-500"
                      }`}>
                        {trend.score}%
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-sm ${
                          isActive ? "text-gray-900" : "text-gray-700"
                        }`}>
                          {trend.title}
                        </h3>
                        <span className="text-xs bg-peach/20 text-dark-terracotta px-2 py-1 rounded-full">
                          {trend.category}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        isActive ? "text-gray-600" : "text-gray-500"
                      }`}>
                        {trend.description}
                      </p>
                      
                      {/* Progress Bar */}
                      {isActive && (
                        <div className="mt-2 bg-gray-200 rounded-full h-1 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-peach to-terracotta"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Ver Mais Button */}
          <div className="flex justify-center pt-4">
            <Button className="bg-terracotta hover:bg-dark-terracotta text-white px-6 py-2">
              Ver Mais Tendências
            </Button>
          </div>
        </div>

        {/* Right Side - Featured Trend */}
        <Card className="sticky top-4">
          <CardContent className="p-0">
            <motion.div
              key={currentTrend}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={trends[currentTrend].image}
                alt={trends[currentTrend].title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-terracotta bg-peach/20 px-2 py-1 rounded">
                    {trends[currentTrend].category}
                  </span>
                  <span className="text-lg font-bold text-terracotta">
                    {trends[currentTrend].score}%
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {trends[currentTrend].title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {trends[currentTrend].description}
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
