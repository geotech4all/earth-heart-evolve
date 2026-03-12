import React from "react";
import AnimatedText from "@/components/AnimatedText";

interface HeroSectionProps {
  geoKeywords: string[];
}

const HeroSection = ({ geoKeywords }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="container-wide text-white py-20">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4 md:mb-6 leading-tight">
            We power the future of{" "}
            <AnimatedText
              words={geoKeywords}
              className="text-geotech-red font-bold"
            />{" "}
            with data, innovation, and collaboration
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-gray-200">
            A geo-data acquisition and analysis firm leveraging cutting-edge technology for high-quality geoscience solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/services" className="btn-primary text-center">
              Our Services
            </a>
            <a
              href="https://bit.ly/Geotech4all"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white font-medium py-3 px-6 rounded-md hover:bg-white hover:text-gray-900 transition-colors duration-300 text-center"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <a href="#what-we-do" aria-label="Scroll down">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
