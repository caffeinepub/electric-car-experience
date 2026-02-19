export default function ParallaxSection() {
  return (
    <section
      className="relative h-[400px] flex items-center justify-center bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(/assets/generated/parallax-bg.dim_1920x1080.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <h2 className="relative z-10 text-5xl md:text-6xl font-bold text-white text-center px-4" style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.7)' }}>
        Innovation Meets Design
      </h2>
    </section>
  );
}
