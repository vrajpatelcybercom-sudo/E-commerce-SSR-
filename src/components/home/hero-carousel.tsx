"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BannerSlide } from "@/types";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  slides: BannerSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
      aria-label="Hero Banner"
    >
      <div
        className={cn(
          "relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] bg-gradient-to-br",
          slide.bgGradient,
          "transition-all duration-700 ease-out",
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center min-h-[320px] sm:min-h-[420px] lg:min-h-[480px]">
          <div
            key={current}
            className="animate-fade-in max-w-xl"
          >
            <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold rounded-full mb-4 border border-white/20">
              {slide.subtitle}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg text-white/80 mb-6 max-w-md leading-relaxed">
              {slide.description}
            </p>
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              {slide.ctaText}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === current
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
