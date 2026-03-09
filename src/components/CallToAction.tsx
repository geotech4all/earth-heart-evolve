import React from "react";

interface CallToActionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundClass?: string;
}

const CallToAction = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundClass = "bg-geotech-gray",
}: CallToActionProps) => {
  return (
    <section className={`py-20 ${backgroundClass}`}>
      <div className="container-wide text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <a
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-block"
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
