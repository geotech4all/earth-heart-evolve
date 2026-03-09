import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/SectionHeader";
import PartnersMarquee from "@/components/PartnersMarquee";
import ServiceAccordion from "@/components/ServiceAccordion";
import CallToAction from "@/components/CallToAction";
import WhatsAppFloatingButton from "@/components/WhatsAppFloatingButton";

const Services = () => {
  const partners = [
    { name: "GeoHub" },
    { name: "GeoLab" },
    { name: "R&D (Research and Development)" },
    { name: "IGFS Institute" }
  ];

  const visualizationImages = [
    {
      url: "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
      title: "Geological Mapping",
      description: "Detailed field mapping and structural analysis of complex geological terrains"
    },
    {
      url: "https://images.unsplash.com/photo-1533417463899-43a5659a4fc2",
      title: "Remote Sensing Analysis",
      description: "Satellite imagery interpretation and multispectral data processing"
    },
    {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      title: "3D Topographic Modeling",
      description: "High-resolution digital elevation models and terrain visualization"
    },
    {
      url: "https://images.unsplash.com/photo-1526666923127-b2970f64b422",
      title: "Subsurface Characterization",
      description: "Geophysical surveys and stratigraphic correlation for resource exploration"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % visualizationImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [visualizationImages.length]);

  return (
    <>
      {/* Animated Hero Section */}
      <section className="relative pt-32 pb-20 bg-geotech-black overflow-hidden h-[70vh] min-h-[500px] flex items-center" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`,
      }}>
        <div className="absolute inset-0 z-0 transition-all duration-1000">
          {visualizationImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image.url}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="container-wide text-white relative z-10">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-300 mb-8">
              Comprehensive geoscience solutions tailored to your specific needs.
            </p>

            <div className="mt-6 border-l-4 border-geotech-red pl-4">
              <h3 className="text-2xl font-bold mb-2">{visualizationImages[currentImageIndex].title}</h3>
              <p className="text-gray-300">{visualizationImages[currentImageIndex].description}</p>
            </div>

            <div className="flex mt-8 gap-2">
              {visualizationImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-geotech-red' : 'bg-white bg-opacity-30'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`View ${visualizationImages[index].title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader
            title="Comprehensive Geoscience Solutions"
            subtitle="From data acquisition to analysis, visualization, and training, we offer end-to-end services across the geosciences spectrum."
          />
          <ServiceAccordion />
        </div>
      </section>

      <PartnersMarquee partners={partners} />

      <CallToAction
        title="Need a Custom Solution?"
        subtitle="Contact us to discuss your specific geoscientific needs and discover how we can help you achieve your goals."
        buttonText="Get a Custom Quote"
        buttonLink="https://bit.ly/Geotech4All"
        backgroundClass="bg-white"
      />

      <WhatsAppFloatingButton />
    </>
  );
};

export default Services;
