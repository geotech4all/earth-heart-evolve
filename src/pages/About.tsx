import React from "react";
import SectionHeader from "@/components/SectionHeader";
import CallToAction from "@/components/CallToAction";
import TeamSection from "@/components/TeamSection";
import SEO from "@/components/SEO";

const About = () => {
  return (
    <>
      <SEO title="About Us" description="Learn about Geotech4All's mission, vision, and the team driving innovation in geoscience solutions across Africa." path="/about" />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-geotech-black" style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1501854140801-50d01698950b')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container-wide text-white">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Geotech4All</h1>
            <p className="text-xl text-gray-300">
              Learn about our mission, vision, and the team driving innovation in geoscience.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-6">
              Geotech4All is a geo-data acquisition and analysis firm, leveraging cutting-edge technology and expert knowledge to deliver high-quality geoscience solutions. As a burgeoning geoscience conglomerate, Geotech4All operates as an ecosystem of specialized entities, each dedicated to delivering tailored services and intuitive solutions that span the breadth of geosciences.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Our mission is clear: to provide sustainable geoscience solutions with lasting impact on the world. Our mantra, "Everything Geoscience," reflects our comprehensive approach to the field. Under the Geotech4All umbrella, several subsidiary groups synergize seamlessly, each with its unique focus and expertise, collectively driving forward our overarching vision.
            </p>
            <div className="bg-geotech-gray p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-2">Official Registration:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Company registration number: RC: 8852817</li>
                <li>Incorporated in the UK (Company No. 15807278)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-geotech-gray">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-geotech-red bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-geotech-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                We are driven by the belief that geoscience holds the key to understanding our planet and addressing global challenges. Our mission is to provide sustainable geoscience solutions with lasting impact on the world, making advanced geoscientific knowledge and tools accessible to all.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-geotech-red bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-geotech-red">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To be the leading resource center for everything geoscience—from knowledge, to practical application, and innovative solutions. We aim to create a world where geoscience expertise is accessible, applicable, and transformative for addressing global challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader title="Who We Are" alignment="left" />
          <div className="max-w-4xl mx-auto">
            <p className="text-lg leading-relaxed mb-6">
              We are a team of geoscientists that specialize in geo-data acquisition, analysis, and visualization. Our experts combine academic knowledge with practical field experience to deliver solutions that address real-world challenges.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              We help individuals and organizations collect exploration data, analyze geo-data, create beautiful geospatial insights, and share findings with the world.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <TeamSection />

      {/* What We Do */}
      <section className="section-padding bg-geotech-gray">
        <div className="container-wide">
          <SectionHeader title="What We Do" alignment="left" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4">Geoscientific Solutions</h4>
              <p className="text-gray-700">
                We provide comprehensive solutions for geo-data acquisition, processing, analysis, and visualization.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4">Training & Capacity Building</h4>
              <p className="text-gray-700">
                We upskill geoscientists through specialized training programs, workshops, and hands-on experiences.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4">Industry-Academia Bridge</h4>
              <p className="text-gray-700">
                We facilitate collaborative projects between academic institutions and industry partners.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4">Innovative Tools & Techniques</h4>
              <p className="text-gray-700">
                We constantly explore and develop new approaches to geoscientific challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Partner With Geotech4All"
        subtitle="Join us in our mission to advance geoscience and create sustainable solutions for global challenges."
        buttonText="Get In Touch"
        buttonLink="https://bit.ly/Geotech4all"
        backgroundClass="bg-white"
      />
    </>
  );
};

export default About;
