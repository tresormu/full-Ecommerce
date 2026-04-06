import { useEffect, useState, useRef } from "react";
import { slides } from "../../../Assets/images/Slides";

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Preload all videos on mount
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) {
        v.load();
        v.play().catch(() => {});
      }
    });
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 sm:h-64 lg:h-[70vh] w-full lg:w-[50vw] overflow-hidden bg-gray-900">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {slide.type === "video" ? (
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              src={slide.src}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              disablePictureInPicture
              preload="auto"
              onContextMenu={(e) => e.preventDefault()}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={slide.src}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-black/40 flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 text-white">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">{slides[index].title}</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base lg:text-lg">{slides[index].subtitle}</p>
        </div>
      </div>
    </div>
  );
}
