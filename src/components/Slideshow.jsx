import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Slideshow({ images, timeSlide }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, timeSlide);

    return () => clearInterval(timer);
  }, [images.length, timeSlide]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <AnimatePresence mode="wait">
        <motion.img
          key={images[current]}
          src={images[current]}
          alt={`Slide ${current}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6 }}
          className="max-w-full max-h-full object-contain absolute"
        />
      </AnimatePresence>

      <button
        onClick={handlePrev}
        className="absolute left-4 text-white text-4xl font-bold hover:scale-110 z-10"
      >
        ‹
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 text-white text-4xl font-bold hover:scale-110 z-10"
      >
        ›
      </button>
    </div>
  );
}

export default Slideshow;
