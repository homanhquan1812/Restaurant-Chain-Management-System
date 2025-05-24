export const Hero = () => {
  return (
    <section className="relative w-full">
      <img 
        src="/assets/images/hero.png"
        alt="Welcome to Utopia Cafe - Interior view"
        className="object-cover w-full aspect-[1.75] max-md:max-w-full"
        width="1440"
        height="700"
      />
      <div className="absolute inset-0 bg-black/50">
        <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
          <h1 className="text-6xl font-bold text-center text-white">
            About <span className="text-amber-400">UTOPIA COFFEE</span>
          </h1>
          <p className="max-w-2xl text-xl text-center text-white">
            Không gian sang trọng, ấm cúng cùng hương vị cà phê đặc biệt
          </p>
          <button className="px-8 py-3 text-lg font-medium text-white transition-colors bg-amber-500 rounded-full hover:bg-amber-600">
            Khám phá ngay
          </button>
        </div>
      </div>
    </section>
  );
};