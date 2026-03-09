import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Users, Image, Book, Database } from "lucide-react";
import { BarChart } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const ServiceAccordion = () => {
  const services: Service[] = [
    {
      id: "geo-data-acquisition",
      title: "Geo-data Acquisition",
      description: "We collect high-quality geospatial data using advanced technologies like remote sensing, GIS, and field surveys.",
      icon: <MapPin size={24} />,
      features: [
        "Geological field mapping",
        "Remote sensing data collection",
        "Geophysical surveys",
        "Environmental monitoring",
        "Marine data acquisition"
      ]
    },
    {
      id: "geoscience-analysis",
      title: "Geoscience Analysis & Interpretation",
      description: "Our expert team analyzes complex geoscientific data to extract meaningful insights.",
      icon: <BarChart size={24} />,
      features: [
        "Structural geology interpretation",
        "Reservoir characterization",
        "Environmental impact assessment",
        "Geohazard analysis",
        "Resource estimation"
      ]
    },
    {
      id: "training-capacity",
      title: "Training & Capacity Building",
      description: "We offer specialized training programs to enhance the skills and knowledge of geoscientists at all career levels.",
      icon: <Users size={24} />,
      features: [
        "GIS and remote sensing workshops",
        "Field techniques training",
        "Software proficiency courses",
        "Professional development seminars",
        "Customized corporate training"
      ]
    },
    {
      id: "geospatial-visualization",
      title: "Geospatial Visualization",
      description: "Transform raw geoscientific data into compelling visual representations.",
      icon: <Image size={24} />,
      features: [
        "3D geological modeling",
        "Interactive mapping applications",
        "Data dashboards",
        "Scientific illustrations",
        "AR/VR geoscience experiences"
      ]
    },
    {
      id: "research-support",
      title: "R&D (Research and Development)",
      description: "We provide comprehensive support for academic and industry research projects.",
      icon: <Book size={24} />,
      features: [
        "Research design consultation",
        "Field and lab assistance",
        "Data analysis support",
        "Publication preparation",
        "Grant application assistance"
      ]
    },
    {
      id: "innovation-platforms",
      title: "Collaborative Innovation Platforms",
      description: "We create environments that foster collaboration between geoscientists, technology specialists, and industry partners.",
      icon: <Database size={24} />,
      features: [
        "Hackathons and innovation challenges",
        "Cross-disciplinary working groups",
        "Open-source geoscience tools",
        "Community of practice facilitation",
        "Knowledge sharing platforms"
      ]
    }
  ];

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {services.map((service) => (
          <AccordionItem key={service.id} value={service.id} className="bg-white rounded-lg shadow-sm border px-6">
            <AccordionTrigger className="py-6">
              <div className="flex items-center gap-4">
                <div className="bg-geotech-red bg-opacity-10 p-3 rounded-full text-geotech-red">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-left">{service.title}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-geotech-red"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ServiceAccordion;
