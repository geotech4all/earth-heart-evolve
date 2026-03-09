import React from "react";
import SectionHeader from "@/components/SectionHeader";
import AnimatedServiceCard from "@/components/AnimatedServiceCard";
import { MapPin, Book, Database, Users, Image } from "lucide-react";
import { BarChart } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Geo-data Acquisition",
      description: "We help collect and process high-quality geospatial data using cutting-edge technology.",
      icon: <MapPin size={24} />,
    },
    {
      title: "Geoscience Analysis",
      description: "Our experts analyze and interpret complex geoscientific data for meaningful insights.",
      icon: <BarChart size={24} />,
    },
    {
      title: "Training & Development",
      description: "We provide specialized training programs to upskill geoscientists at all levels.",
      icon: <Users size={24} />,
    },
    {
      title: "Geospatial Visualization",
      description: "Transform raw data into beautiful, insightful visualizations and interactive maps.",
      icon: <Image size={24} />,
    },
    {
      title: "R&D (Research and Development)",
      description: "We offer comprehensive support for academic and industry research projects.",
      icon: <Book size={24} />,
    },
    {
      title: "Data Management",
      description: "Efficient organization and storage of your valuable geoscientific data.",
      icon: <Database size={24} />,
    },
  ];

  return (
    <section id="what-we-do" className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeader
          title="What We Do"
          subtitle="We provide comprehensive geoscience solutions, leveraging technology and expertise to address complex geological challenges."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedServiceCard
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
