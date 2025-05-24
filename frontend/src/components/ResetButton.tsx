import React from 'react';

const ResetButton: React.FC = () => {
  return (
    <button className="flex overflow-hidden gap-1 items-start px-2.5 py-1.5 text-sm tracking-tight text-red-600 whitespace-nowrap rounded-lg border border-red-600 border-solid shadow-sm">
      <div className="gap-2 self-stretch">Reset</div>
    </button>
  );
};

export default ResetButton;