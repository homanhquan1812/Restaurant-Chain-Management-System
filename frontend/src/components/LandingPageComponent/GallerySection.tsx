import React from "react";

export const GallerySection: React.FC = () => {
  const images = [
    "/assets/gallery1.jpg",
    "/assets/gallery2.jpg",
    "/assets/gallery3.jpg",
  ];

  return (
    <section className="py-12 bg-yellow-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Hình ảnh món ăn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Gallery ${index + 1}`} className="rounded-lg shadow-md" />
          ))}
        </div>
      </div>
    </section>
  );
};
