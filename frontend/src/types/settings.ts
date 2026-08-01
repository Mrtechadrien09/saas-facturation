export interface CompanyInfo {
  name: string;
  siret?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface SettingsAddress {
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
}

export interface Financials {
  currency: string;
  defaultVatRate: number;
}

export interface Settings {
  companyInfo: CompanyInfo;
  address: SettingsAddress;
  financials: Financials;
}