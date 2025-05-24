import type { IconType } from 'react-icons';

export interface SidebarItem {
    name: string;
    icon: IconType;
    link: string;
    isActive?: boolean;
  }