import React from "react";
import GalleryGrid from "@/components/GalleryGrid";
import SEO from "@/components/SEO";

const Gallery = () => {
  const galleryImages = [
    { id: "1", src: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=400", alt: "River between mountains", category: "Fieldwork" },
    { id: "2", src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400", alt: "Mountain landscape", category: "Fieldwork" },
    { id: "3", src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400", alt: "GIS Training", category: "Training" },
    { id: "4", src: "https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=400", alt: "Trees near rocky mountain", category: "Fieldwork" },
    { id: "5", src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400", alt: "Mountain vista", category: "Fieldwork" },
    { id: "6", src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400", alt: "Training session", category: "Training" },
    { id: "7", src: "https://images.unsplash.com/photo-1533417463899-43a5659a4fc2?w=400", alt: "Aerial view", category: "Maps" },
    { id: "8", src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", alt: "Conference", category: "Events" },
  ];

  const categories = ["Fieldwork", "Training", "Maps", "Events"];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-geotech-black" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1472396961693-142e6e269027')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container-wide text-white">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery</h1>
            <p className="text-xl text-gray-300">
              Explore our collection of fieldwork, training sessions, visualizations, and events.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Work in Action</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through images from our field activities, training sessions, project visualizations, and conference events.
            </p>
          </div>
          <GalleryGrid images={galleryImages} categories={categories} />
        </div>
      </section>
    </>
  );
};

export default Gallery;
