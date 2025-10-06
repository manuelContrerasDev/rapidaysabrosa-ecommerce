import { AnimatePresence,motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock,Tag } from 'lucide-react';
import React, { useEffect,useState } from 'react';

import { promotions } from '../../data/promotions';

const PromotionsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const activePromotions = promotions.filter(promo => promo.isActive);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activePromotions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, activePromotions.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + activePromotions.length) % activePromotions.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activePromotions.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (activePromotions.length === 0) return null;

  return (
    <section className="py-6 bg-gradient-to-r from-primary-600 to-accent-600">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display text-white mb-2 tracking-wide">¡PROMOCIONES LOCAS!</h2>
          <p className="text-primary-100 font-body">¡Ofertas que no puedes rechazar!</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="relative bg-white dark:bg-gray-800 h-48">
                  {/* Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={activePromotions[currentSlide].image}
                      alt={activePromotions[currentSlide].title}
                      className="w-full h-full object-cover opacity-75"
                    />
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>

                  {/* Overlaid Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10">
                    {/* Discount Badge */}
                    <div className="mb-2">
                      <span className="bg-accent-500 text-white px-4 py-2 rounded-full text-lg font-bold flex items-center shadow-lg">
                        <Tag size={18} className="mr-2" />
                        {activePromotions[currentSlide].discount}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-display text-white mb-2 drop-shadow-lg">
                      {activePromotions[currentSlide].title}
                    </h3>
                    <p className="text-white mb-3 text-sm md:text-base font-body drop-shadow-md max-w-md">
                      {activePromotions[currentSlide].description}
                    </p>
                    <div className="flex items-center text-white mb-4 drop-shadow-md">
                      <Clock size={14} className="mr-1" />
                      <span className="text-xs">Válido hasta: {new Date(activePromotions[currentSlide].validUntil).toLocaleDateString('es-ES')}</span>
                    </div>
                    <button className="btn btn-primary text-sm px-4 py-2 shadow-lg">
                      Ordenar Ahora
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-20"
            aria-label="Previous promotion"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1.5 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-20"
            aria-label="Next promotion"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {activePromotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionsCarousel;
