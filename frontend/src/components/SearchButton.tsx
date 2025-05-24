import React from 'react';

const SearchButton: React.FC = () => {
  return (
    <button className="flex overflow-hidden gap-1 items-start px-2.5 py-1.5 text-sm tracking-tight text-white whitespace-nowrap bg-sky-500 rounded-lg border border-sky-500 border-solid shadow-sm">
      <div className="flex gap-2 justify-center items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/78ca29075204bb8337835e0267dee565c8fb19e7a6ed6c16cf7107b7fef9a062?placeholderIfAbsent=true&apiKey=482c75c84bdb4c88a7a67a7f2dd73013"
          className="object-contain shrink-0 self-stretch my-auto w-3 aspect-square"
          alt="Search icon"
        />
        <div className="self-stretch my-auto">Search</div>
      </div>
    </button>
  );
};

export default SearchButton;