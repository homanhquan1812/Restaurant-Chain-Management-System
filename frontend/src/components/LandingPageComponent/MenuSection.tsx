import React from "react";

export const MenuSection: React.FC = () => {
  const menuItems = [
    { name: "Americano", price: "$2.00", desc: "A classic coffee." },
    { name: "Cake", price: "$4.00", desc: "Delicious cakes to enjoy." },
  ];

  return (
    <section id="menu" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {menuItems.map((item, index) => (
            <div key={index} className="p-4 border  border-neutral-300 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm mt-1">{item.desc}</p>
              <p className="font-bold mt-2">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
