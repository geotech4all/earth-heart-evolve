import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionHeader from "@/components/SectionHeader";
import { LogoIcon } from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const FeaturedWebAppsSection = () => {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [showTagline, setShowTagline] = useState(false);

  const featuredWebApps = [
    {
      id: "dar-zarrouk",
      name: "Dar Zarrouk Analyser",
      description: "Advanced tool for analyzing electrical resistivity data and generating dar-zarrouk parameters for geophysical interpretation."
    },
    {
      id: "soilcloud",
      name: "SoilCloud",
      description: "Comprehensive cloud-based platform for managing geotechnical and geoenvironmental data."
    },
    {
      id: "gravimag-cloud",
      name: "GraviMag Cloud",
      description: "Cloud-based gravity and magnetic data processing and interpretation platform. Coming soon!",
      comingSoon: true,
      waitlistLink: "https://bit.ly/GraviMagCloud"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(prev => {
        if (prev + 1 >= featuredWebApps.length) {
          setShowTagline(true);
          return prev;
        } else {
          setShowTagline(false);
          return prev + 1;
        }
      });
    }, 5000);

    if (showTagline) {
      const taglineTimer = setTimeout(() => {
        setShowTagline(false);
        setFeaturedIndex(0);
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(taglineTimer);
      };
    }

    return () => clearInterval(timer);
  }, [featuredIndex, showTagline]);

  const handleExploreClick = (productId: string) => {
    if (productId === "soilcloud") {
      window.open("https://soilcloud.tech/", "_blank");
    }
  };

  return (
    <section className="section-padding bg-geotech-gray">
      <div className="container-wide">
        <SectionHeader
          title="Our WebApps"
          subtitle="Explore our innovative geoscience applications designed to streamline your workflow and enhance data analysis."
        />

        {/* Featured Products Auto-Swipe Hero */}
        <div className="mt-12 relative h-[400px] overflow-hidden rounded-2xl shadow-xl mb-12">
          {/* Tagline Slide */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
              showTagline ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="container-wide text-white p-8">
              <h2 className="text-4xl font-bold mb-4">Everything Geoscience</h2>
              <p className="text-xl max-w-2xl mb-8">
                Our digital tools and applications are designed to transform how geoscientists collect, analyze,
                and visualize data.
              </p>
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-200"
                asChild
              >
                <Link to="/products">
                  Explore All Products <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Product Slides */}
          {featuredWebApps.map((app, index) => (
            <div
              key={app.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
                index === featuredIndex && !showTagline ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1574629173169-7019b64ac722')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="container-wide text-white p-8">
                <div className="flex items-center gap-6 mb-4">
                  <div className="bg-white p-4 rounded-lg">
                    <LogoIcon productId={app.id} className="h-12 w-12" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{app.name}</h2>
                    {app.comingSoon && (
                      <span className="bg-geotech-red text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xl max-w-2xl mb-4">{app.description}</p>
                {app.waitlistLink ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-300">Join the launch notification wait-list:</p>
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-200"
                      onClick={() => window.open(app.waitlistLink, "_blank")}
                    >
                      Join Waitlist <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-200"
                    onClick={() => app.id === "soilcloud" ? handleExploreClick(app.id) : undefined}
                    asChild={app.id !== "soilcloud"}
                  >
                    {app.id === "soilcloud" ? (
                      <>
                        Visit SoilCloud <ArrowRight className="ml-2" size={16} />
                      </>
                    ) : (
                      <Link to="/products">
                        Explore Now <ArrowRight className="ml-2" size={16} />
                      </Link>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {/* Indicator dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {[...featuredWebApps, {id: "tagline"}].map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${
                  (index === featuredIndex && !showTagline) || (index === featuredWebApps.length && showTagline)
                    ? 'bg-white'
                    : 'bg-white/40'
                }`}
                onClick={() => {
                  if (index === featuredWebApps.length) {
                    setShowTagline(true);
                    setFeaturedIndex(featuredWebApps.length - 1);
                  } else {
                    setShowTagline(false);
                    setFeaturedIndex(index);
                  }
                }}
                aria-label={`View featured item ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View All Products Button */}
        <div className="mt-8 text-center">
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link to="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWebAppsSection;
