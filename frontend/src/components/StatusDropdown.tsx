import React from 'react';
import { customerStatuses } from '../types/customerStatuses';

const StatusDropdown: React.FC = () => {
  return (
    <select className="flex overflow-hidden gap-2.5 items-center px-3 py-1.5 bg-white rounded-lg border border-solid border-neutral-300 text-sm leading-loose text-neutral-300 appearance-none">
      <option value="">--- All Status ---</option>
      {customerStatuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown;