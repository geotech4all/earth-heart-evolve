import React from "react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  image?: string;
}

const TestimonialCard = ({ quote, name, title, image }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      <div className="flex items-start mb-4">
        <svg
          className="text-geotech-red w-8 h-8"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-600 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-geotech-gray flex items-center justify-center mr-4">
            <span className="text-lg font-bold text-geotech-red">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-gray-500 text-sm">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
