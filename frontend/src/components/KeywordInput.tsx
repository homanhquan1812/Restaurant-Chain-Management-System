import React from 'react';

const KeywordInput: React.FC = () => {
  return (
    <input
      type="text"
      className="overflow-hidden gap-2 self-stretch px-3 py-1.5 text-sm leading-loose whitespace-nowrap bg-white rounded-lg border border-solid border-neutral-300 text-neutral-300 w-[205px]"
      placeholder="Keyword"
      aria-label="Enter keyword"
    />
  );
};

export default KeywordInput;