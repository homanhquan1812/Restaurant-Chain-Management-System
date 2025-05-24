import React from 'react';

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = () => {
  return (
    <div className="flex z-0 gap-1 items-center self-stretch my-auto text-center min-w-3xs text-neutral-800 w-[436px] max-md:max-w-full">
      <form className="flex flex-1 shrink gap-4 items-start self-stretch px-4 py-2.5 my-auto border border-solid basis-0 bg-slate-100 border-neutral-300 rounded-[50px]">
        <label htmlFor="search" className="sr-only">Search</label>
        <input
          type="text"
          id="search"
          placeholder="Search"
          className="gap-2.5 self-stretch bg-blend-normal w-full bg-transparent border-none focus:outline-none"
        />
      </form>
    </div>
  );
};

export default SearchBar;