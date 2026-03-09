import React from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import FeaturedWebAppsSection from "@/components/home/FeaturedWebAppsSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ImpactStatistics from "@/components/ImpactStatistics";
import CallToAction from "@/components/CallToAction";
import PartnersMarquee from "@/components/PartnersMarquee";

const Index = () => {
  const geoKeywords = [
    "Geotechnics",
    "Hydrogeology",
    "Geophysics",
    "Engineering Geology",
    "Remote Sensing",
    "Environmental Geology",
    "GIS",
    "Seismic Interpretation",
    "Geo-Innovation",
    "Subsurface Mapping"
  ];

  const partners = [
    { name: "GeoHub" },
    { name: "GeoLab" },
    { name: "R&D (Research and Development)" },
    { name: "IGFS Institute" },
    { name: "SoilCloud" }
  ];

  return (
    <>
      <HeroSection geoKeywords={geoKeywords} />
      <ServicesSection />
      <FeaturedWebAppsSection />
      <WhyChooseUsSection />
      <ImpactStatistics />
      <PartnersMarquee partners={partners} />
      <CallToAction
        title="Ready to Work With Us?"
        subtitle="Let's collaborate to tackle your geoscientific challenges and unlock valuable insights from your data."
        buttonText="Contact Us Today"
        buttonLink="https://bit.ly/Geotech4All"
        backgroundClass="bg-geotech-gray"
      />
    </>
  );
};

export default Index;
