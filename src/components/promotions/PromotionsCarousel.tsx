import { AnimatePresence,motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock,Tag } from "lucide-react";
import React, { useEffect,useState } from "react";

import { promotions } from "../../data/promotions";

const PromotionsCarousel: React.FC = () => {
  const activePromotions = promotions.filter((promo) => promo.isActive);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || activePromotions.length === 0) return;

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

  const goToPrevious = () =>
    goToSlide((currentSlide - 1 + activePromotions.length) % activePromotions.length);

  const goToNext = () => goToSlide((currentSlide + 1) % activePromotions.length);

  if (activePromotions.length === 0) return null;

  return (
    <section className="relative w-full h-[15rem] sm:h-[18rem] md:h-[20rem] lg:h-[22rem]">
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={activePromotions[currentSlide].image}
              alt={activePromotions[currentSlide].title}
              className="w-full h-full object-cover object-center brightness-90"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center items-center text-center px-4">
              <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-sm sm:text-base font-bold flex items-center mb-1">
                <Tag size={16} className="mr-1" />
                {activePromotions[currentSlide].discount}
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-display text-white mb-1 drop-shadow-lg">
                {activePromotions[currentSlide].title}
              </h3>
              <p className="text-white text-xs sm:text-sm md:text-base drop-shadow-md max-w-md">
                {activePromotions[currentSlide].description}
              </p>
              <div className="flex items-center text-white mt-2 drop-shadow-md text-xs sm:text-sm md:text-base">
                <Clock size={16} className="mr-1" />
                <span>
                  Válido hasta:{" "}
                  {new Date(activePromotions[currentSlide].validUntil).toLocaleDateString("es-ES")}
                </span>
              </div>
              <button className="btn btn-primary text-xs sm:text-sm md:text-base px-4 sm:px-6 py-1 sm:py-2 mt-2 shadow-lg">
                Ordenar Ahora
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navegación */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 w-full flex justify-center space-x-2">
          {activePromotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsCarousel;
