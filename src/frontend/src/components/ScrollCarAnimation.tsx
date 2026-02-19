import { useEffect, useState } from 'react';

export default function ScrollCarAnimation() {
  const [carPosition, setCarPosition] = useState(-400);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxPosition = window.innerWidth;
      const newPosition = Math.min(scrollY - 1500, maxPosition);
      setCarPosition(Math.max(-400, newPosition));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[300px] my-12 overflow-hidden bg-gradient-to-b from-black to-[#111]">
      <img
        src="/assets/generated/car-scroll.dim_800x300.png"
        alt="Scrolling car"
        className="absolute top-1/2 -translate-y-1/2 h-auto max-h-[200px] transition-all duration-100 ease-out"
        style={{ left: `${carPosition}px` }}
      />
    </section>
  );
}
