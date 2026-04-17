import React from "react";
import AnimatedText from "@/components/AnimatedText";

interface HeroSectionProps {
  geoKeywords: string[];
}

const HeroSection = ({ geoKeywords }: HeroSectionProps) => {
  return (
    <section
      className="relative min-h-screen flex items-center bg-gray-900"
      style={{
        backgroundImage:
          "linear-gradient(rgba(17, 24, 39, 0.82), rgba(17, 24, 39, 0.88)), url('https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container-wide text-white py-20">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Frontiering{" "}
            <AnimatedText
              words={geoKeywords}
              className="text-geotech-red font-bold"
            />{" "}
            with data, innovation, and collaboration
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 text-gray-200">
            A geo-data acquisition, analysis, visualization, research and data management firm.
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
