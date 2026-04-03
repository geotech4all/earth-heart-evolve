import React from "react";
import GalleryGrid from "@/components/GalleryGrid";
import SEO from "@/components/SEO";

import trainingLab from "@/assets/gallery/training-lab.png";
import geologicMap from "@/assets/gallery/geologic-map.png";
import geologyDept from "@/assets/gallery/geology-dept.png";
import fieldworkEquipment from "@/assets/gallery/fieldwork-equipment.png";
import fieldworkTeam from "@/assets/gallery/fieldwork-team.png";
import wellInspection from "@/assets/gallery/well-inspection.png";

const Gallery = () => {
  const galleryImages = [
    { id: "1", src: trainingLab, alt: "GIS and geoscience training session in the lab", category: "Training" },
    { id: "2", src: geologicMap, alt: "Presenting a geologic map at Geotech4All training", category: "Training" },
    { id: "3", src: geologyDept, alt: "Geology department - student with geological maps", category: "Training" },
    { id: "4", src: fieldworkEquipment, alt: "Field data acquisition with PQWT equipment", category: "Fieldwork" },
    { id: "5", src: fieldworkTeam, alt: "Geotech4All team conducting geophysical survey", category: "Fieldwork" },
    { id: "6", src: wellInspection, alt: "Well inspection and water level measurement", category: "Fieldwork" },
  ];

  const categories = ["Training", "Fieldwork"];

  return (
    <>
      <SEO title="Gallery" description="Browse photos from Geotech4All's fieldwork, training sessions, events, and geoscience projects across Africa." path="/gallery" />
      <section className="relative pt-32 pb-20 bg-geotech-black" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${fieldworkTeam}')`,
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
