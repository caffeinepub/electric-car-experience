import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const slides = [
  {
    image: '/assets/generated/tesla-hero-1.dim_1920x1080.png',
    title: 'Ludicrous Speed',
    buttonText: 'Explore Models',
  },
  {
    image: '/assets/generated/tesla-hero-2.dim_1920x1080.png',
    title: 'Full Self-Driving',
    buttonText: 'Learn More',
  },
  {
    image: '/assets/generated/tesla-hero-3.dim_1920x1080.png',
    title: 'Revolutionary Design',
    buttonText: 'See Gallery',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (slideIndex: number) => {
    const sections = ['features', 'features', 'gallery'];
    const element = document.getElementById(sections[slideIndex]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1
              className={`text-5xl md:text-7xl font-bold text-white mb-8 transition-all duration-1000 ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                animation: index === currentSlide ? 'fadeInUp 2s ease-out' : 'none',
              }}
            >
              {slide.title}
            </h1>
            <Button
              onClick={() => scrollToSection(index)}
              className={`bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg font-semibold transition-all duration-300 ${
                index === currentSlide
                  ? 'opacity-100 translate-y-0 delay-500'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              {slide.buttonText}
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
