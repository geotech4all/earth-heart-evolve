import React from "react";
import { Users, Award, Briefcase, BarChart2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

interface StatProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  description: string;
}

const useCountAnimation = (endValue: number, duration: number = 2000) => {
  const [count, setCount] = React.useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      let startTime: number;
      const step = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * endValue));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }
  }, [endValue, duration, inView]);

  return { count, ref };
};

const Stat = ({ icon, count, label, description }: StatProps) => {
  const { count: animatedCount, ref } = useCountAnimation(count);

  return (
    <div ref={ref} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-geotech-red bg-opacity-10 text-geotech-red mb-4">
        {icon}
      </div>
      <h3 className="text-4xl font-bold mb-2">{animatedCount}+</h3>
      <p className="font-semibold text-lg mb-2">{label}</p>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const ImpactStatistics = () => {
  const stats = [
    {
      icon: <Award size={32} />,
      count: 25,
      label: "Projects Completed",
      description: "Successfully delivered geoscience solutions worldwide"
    },
    {
      icon: <Users size={32} />,
      count: 75,
      label: "Geoscientists Trained",
      description: "Empowering the next generation of earth scientists"
    },
    {
      icon: <Briefcase size={32} />,
      count: 15,
      label: "Collaborations & Partners",
      description: "Building strong industry relationships"
    },
    {
      icon: <BarChart2 size={32} />,
      count: 5,
      label: "Geo-innovations Deployed",
      description: "Pioneering new solutions in geoscience"
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Stat key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStatistics;
