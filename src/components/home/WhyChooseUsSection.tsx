import React from "react";
import SectionHeader from "@/components/SectionHeader";

const WhyChooseUsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <SectionHeader
          title="Why Choose Us"
          subtitle="We combine scientific expertise with technological innovation to deliver accurate, reliable, and actionable geoscience solutions."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-geotech-red rounded-full p-2 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Expert Team</h3>
                  <p className="text-gray-600">Our team consists of experienced geoscientists with specialized knowledge across various domains.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-geotech-red rounded-full p-2 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Cutting-edge Technology</h3>
                  <p className="text-gray-600">We leverage the latest tools and technologies to deliver accurate and efficient solutions.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-geotech-red rounded-full p-2 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Comprehensive Approach</h3>
                  <p className="text-gray-600">Our "Everything Geoscience" philosophy ensures we address all aspects of your geoscientific needs.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-geotech-red rounded-full p-2 text-white mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Global Presence</h3>
                  <p className="text-gray-600">With operations in Nigeria and the UK, we serve clients across the globe with diverse geological contexts.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                alt="Geoscience fieldwork"
                className="rounded-lg shadow-xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -left-6 bg-geotech-red text-white p-4 rounded-lg shadow-lg">
                <p className="font-bold text-xl">15+</p>
                <p className="text-sm">Years Combined Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
