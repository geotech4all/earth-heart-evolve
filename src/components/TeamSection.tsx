import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imagePlaceholder: string;
  expertise: string[];
}

const TeamSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const team: TeamMember[] = [
    {
      name: "Jeremiah Oladipupo",
      role: "Founder / Geoscientist",
      description: "Leading innovation in geoscience solutions and team development. With extensive expertise in geospatial analysis and subsurface mapping, Jeremiah drives the vision of Geotech4All forward.",
      imagePlaceholder: "./images/13.jpg",
      expertise: ["Geospatial Analysis", "Team Leadership", "Subsurface Mapping"]
    },
    {
      name: "Dolapo Apata",
      role: "Partner / Geoscientist",
      description: "Partner at Geotech4All, contributing geoscience expertise and strategic insight to advance the firm's mission of delivering sustainable geoscience solutions across Africa.",
      imagePlaceholder: "/placeholder.svg",
      expertise: ["Geoscience", "Strategic Partnership", "Project Delivery"]
    }
    // Dr. Stanley Eze and Okediji Isaac are hidden as requested
  ];

  const nextMember = () => {
    setActiveIndex((prev) => (prev + 1) % team.length);
  };

  const prevMember = () => {
    setActiveIndex((prev) => (prev - 1 + team.length) % team.length);
  };

  return (
    <section className="section-padding bg-geotech-gray">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Meet Our Team</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Our talented team combines academic knowledge with practical experience to deliver innovative geoscience solutions.
        </p>

        {/* Team Member Details with Navigation */}
        <Card className="bg-white rounded-xl shadow-xl overflow-hidden mb-16 relative">
          {team.length > 1 && (
            <>
              <button
                onClick={prevMember}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-geotech-red p-2 rounded-full shadow-md transition-all"
                aria-label="Previous team member"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMember}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-geotech-red p-2 rounded-full shadow-md transition-all"
                aria-label="Next team member"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Team Member Image */}
            <div className="bg-gradient-to-br from-geotech-red/5 to-purple-500/5 p-6 flex items-center justify-center md:col-span-1">
              <div className="relative">
                <Avatar className="w-36 h-36 border-4 border-white shadow-lg">
                  <AvatarImage src={team[activeIndex].imagePlaceholder} alt={team[activeIndex].name} className="object-cover" />
                  <AvatarFallback className="text-3xl bg-white text-geotech-red">
                    {team[activeIndex].name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -z-10 bg-gradient-to-r from-geotech-red/20 to-purple-500/20 w-full h-full rounded-full blur-3xl opacity-70 -inset-1"></div>
              </div>
            </div>

            {/* Team Member Info */}
            <div className="p-8 md:col-span-2">
              <span className="bg-geotech-red/10 text-geotech-red text-xs font-medium px-2.5 py-0.5 rounded-full mb-4 inline-block">
                Team Member
              </span>
              <h3 className="text-2xl font-bold mb-2">{team[activeIndex].name}</h3>
              <p className="text-geotech-red font-medium mb-4">{team[activeIndex].role}</p>
              <p className="text-gray-600 mb-6 leading-relaxed">{team[activeIndex].description}</p>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-500">Areas of Expertise:</h4>
                <div className="flex flex-wrap gap-2">
                  {team[activeIndex].expertise.map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {team.length > 1 && (
            <div className="flex justify-center space-x-2 p-4 bg-gray-50">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeIndex === index ? 'bg-geotech-red' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`View ${team[index].name}`}
                />
              ))}
            </div>
          )}
        </Card>

        {/* Join Our Team CTA */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Interested in joining our team?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for talented and passionate geoscientists to join our mission of making geoscience accessible and impactful.
          </p>
          <a
            href="https://bit.ly/Geotech4all"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-geotech-red hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Get in touch <ArrowRight size={16} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
