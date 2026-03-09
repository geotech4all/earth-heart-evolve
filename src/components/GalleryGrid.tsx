import React, { useState } from "react";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

interface GalleryGridProps {
  images: GalleryImage[];
  categories?: string[];
}

const GalleryGrid = ({ images, categories = [] }: GalleryGridProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredImages = activeFilter === "all"
    ? images
    : images.filter((image) => image.category === activeFilter);

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.classList.add("overflow-hidden");
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <div className="container-wide">
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "all"
                ? "bg-geotech-red text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeFilter === category
                  ? "bg-geotech-red text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => openLightbox(image.src)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-geotech-red"
            aria-label="Close lightbox"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="max-w-4xl max-h-[80vh] overflow-hidden">
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryGrid;
