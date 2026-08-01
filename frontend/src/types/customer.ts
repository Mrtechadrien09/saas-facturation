export interface CustomerAddress {
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export interface Customer {
  _id: string;
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  address?: CustomerAddress;
  createdAt: string;
  updatedAt: string;
}