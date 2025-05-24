import * as React from 'react';

export const ExampleDish: React.FC = () => {
  return (
    <div className="flex overflow-hidden flex-col justify-center items-center py-5 mt-2.5 w-full min-h-[742px] max-md:max-w-full">
      <div className="flex flex-col w-full max-md:max-w-full">
        <div className="self-center text-6xl text-black max-md:text-4xl">
        <span className="text-zinc-800">Hình ảnh</span>
        <span className="text-amber-400"> món ăn</span>
        </div>
        <div className="flex flex-wrap gap-10 items-start mt-14 w-full max-md:mt-10 max-md:max-w-full">
          <div className="flex shrink-0 bg-amber-400 h-[100px] w-[30px]" />
          <div className="flex-auto self-stretch max-md:max-w-full">
            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              <img
                loading="lazy"
                src="/images/ED1.png"
                alt="Example dish 1"
                className="object-none w-full aspect-[0.93]"
              />
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-5">
                  <img
                    loading="lazy"
                    src="/images/ED2.png"
                    alt="Example dish 2"
                    className="object-none w-full aspect-[0.93]"
                  />
                  <img
                    loading="lazy"
                    src="/images/ED3.png"
                    alt="Example dish 3"
                    className="object-none w-full aspect-[0.92]"
                  />
                </div>
                <img
                  loading="lazy"
                  src="/images/ED4.png"
                  alt="Example dish 4"
                  className="object-none w-full aspect-[1.97]"
                />
              </div>
            </div>
          </div>
          <div className="flex shrink-0 bg-amber-400 h-[100px] w-[30px]" />
        </div>
      </div>
    </div>
  );
};