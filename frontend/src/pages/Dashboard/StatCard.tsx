import React from "react";
import type { StatCardProps } from "../../types/StatCardProps";

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeText,
  icon,
  iconElement,
  bgColor,
}) => {
  return (
    <div className="rounded-xl bg-white shadow-sm px-4 py-4 flex flex-col justify-between gap-4 h-full">
      {/* Top: Icon + Info */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-black mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${bgColor} flex items-center justify-center`}>
          {iconElement ? (
            <div className="w-6 h-6 text-white">{iconElement}</div>
          ) : (
            <img src={icon} alt={title} className="w-6 h-6" />
          )}
        </div>
      </div>

      {/* Bottom: Change Info */}
      <div className="text-sm text-gray-600 flex gap-1">
        <span className="font-semibold">{change}</span>
        <span>{changeText}</span>
      </div>
    </div>
  );
};

export default StatCard;
