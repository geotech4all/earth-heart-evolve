import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
}

const SectionHeader = ({
  title,
  subtitle,
  alignment = "center",
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  return (
    <div className={`max-w-3xl mb-12 ${alignmentClasses[alignment]}`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${alignmentClasses[alignment]}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg text-gray-600 ${alignmentClasses[alignment]}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
