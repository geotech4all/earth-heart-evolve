import React from "react";
import { Link } from "react-router-dom";

interface AnimatedServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link?: string;
}

const AnimatedServiceCard = ({
  title,
  description,
  icon,
  link = "/services",
}: AnimatedServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2">
      <div className="bg-geotech-red bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mb-6 text-geotech-red">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        to={link}
        className="text-geotech-red font-semibold hover:text-red-800 transition-colors flex items-center"
      >
        Learn More
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  );
};

export default AnimatedServiceCard;
