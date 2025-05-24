import type { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeText?: string;
  bgColor?: string;
  icon: string;

  iconElement?: ReactNode;
}
