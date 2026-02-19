import { useEffect, useRef, useState } from 'react';

const features = [
  {
    image: '/assets/generated/feature1-acceleration.dim_800x600.jpg',
    title: 'Fast Acceleration',
    description: '0-60 mph under 3 seconds.',
  },
  {
    image: '/assets/generated/feature2-autopilot.dim_800x600.jpg',
    title: 'Autopilot',
    description: 'Advanced driver assistance.',
  },
  {
    image: '/assets/generated/feature3-range.dim_800x600.jpg',
    title: 'Long Range',
    description: 'High-capacity battery for longer trips.',
  },
];

export default function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardsRef.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newVisible = [...prev];
              newVisible[index] = true;
              return newVisible;
            });
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px' }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="bg-[#111] py-20 px-5">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-center gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className={`w-full sm:w-64 text-center transition-all duration-800 ${
                visibleCards[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full rounded-2xl mb-4 object-cover aspect-[4/3]"
              />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
