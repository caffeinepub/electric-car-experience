const galleryImages = [
  '/assets/generated/gallery1-car.dim_600x400.jpg',
  '/assets/generated/gallery2-car.dim_600x400.jpg',
  '/assets/generated/gallery3-car.dim_600x400.jpg',
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-20 px-5 bg-black">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          Gallery
        </h2>
        <div className="flex flex-wrap justify-center gap-5">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="w-full sm:w-[300px] perspective-1000"
            >
              <img
                src={image}
                alt={`Gallery car ${index + 1}`}
                className="w-full rounded-2xl cursor-pointer transition-all duration-500 hover:scale-105"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotateY(15deg) rotateX(5deg) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
