export interface CustomerStatuses {
    value: string;
    label: string;
  }
  
  export const customerStatuses: CustomerStatuses[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];