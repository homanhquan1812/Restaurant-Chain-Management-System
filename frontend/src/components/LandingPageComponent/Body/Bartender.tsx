import * as React from 'react';

interface Bartender {
  image: string;
  alt: string;
}

const bartenders: Bartender[] = [
  { image: "/images/bartender1.png", alt: "Bartender 1" },
  { image: "/images/bartender2.png", alt: "Bartender 2" },
  { image: "/images/bartender3.png", alt: "Bartender 3" }
];

export const Bartender: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col justify-between px-24 py-8 mt-2.5 w-full min-h-[743px] max-md:px-5 max-md:max-w-full">
      <div className="text-6xl text-center text-black max-md:max-w-full max-md:text-4xl">
        <span className="text-zinc-800">Barten</span>
        <span className="text-amber-400">der</span>
      </div>
      <div className="self-center mt-20 max-w-full w-[1236px] max-md:mt-10">
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {bartenders.map((bartender, index) => (
            <img
              key={index}
              loading="lazy"
              src={bartender.image}
              alt={bartender.alt}
              className="object-contain w-full aspect-[0.69]"
            />
          ))}
        </div>
      </div>
      <div className="flex overflow-hidden flex-col mt-2.5 w-full max-md:max-w-full">
        <img
          loading="lazy"
          src="/images/showcase.png"
          alt="Bartender showcase"
          className="object-contain w-full aspect-[1.37]"
        />
      </div>
    </div>
  );
}