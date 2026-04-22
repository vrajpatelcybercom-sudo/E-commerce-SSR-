"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const prev = () =>
    setSelected((s) => (s - 1 + images.length) % images.length);
  const next = () => setSelected((s) => (s + 1) % images.length);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
        <Image
          src={images[selected]}
          alt={`${alt} - Image ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-500",
            zoomed && "scale-150 cursor-zoom-out",
            !zoomed && "cursor-zoom-in",
          )}
          onClick={() => setZoomed(!zoomed)}
          priority
        />

        {/* Zoom Icon */}
        <button
          onClick={() => setZoomed(!zoomed)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          aria-label="Zoom image"
        >
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              className={cn(
                "relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                idx === selected
                  ? "border-indigo-500 shadow-lg shadow-indigo-200"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100",
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${alt} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
