import React from "react";

interface Partner {
  name: string;
  logo?: string;
}

interface PartnersMarqueeProps {
  partners: Partner[];
}

const PartnersMarquee = ({ partners }: PartnersMarqueeProps) => {
  const extendedPartners = [...partners, ...partners];

  return (
    <div className="bg-geotech-gray overflow-hidden py-10">
      <div className="container-wide">
        <h3 className="text-2xl font-bold text-center mb-8">Our Partners & Collaborators</h3>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex animate-marquee">
            {extendedPartners.map((partner, index) => (
              <div
                key={index}
                className="flex flex-shrink-0 items-center justify-center mx-8 w-48 h-24"
              >
                <div
                  className="bg-white rounded-lg shadow-md px-6 py-4 w-full h-full flex items-center justify-center
                    transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-geotech-red hover:text-white
                    cursor-pointer group"
                >
                  <span className="font-montserrat font-bold text-lg text-center tracking-tight group-hover:text-white">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersMarquee;
