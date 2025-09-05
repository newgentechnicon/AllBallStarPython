import type { Tables } from '@/types/database.types';

export type Farm = Tables<'farms'>;

// State สำหรับฟอร์มสร้างฟาร์ม
export interface CreateFarmState {
  success?: boolean;
  message?: string;
  errors: {
    name?: string[];
    breeder_name?: string[];
    information?: string[];
    logo?: string[];
    _form?: string; 
  };
  fields?: { [key: string]: string };
}

// State สำหรับฟอร์มแก้ไขฟาร์ม
export interface EditFarmState {
  success?: boolean;
  message?: string;
  errors: {
    name?: string[];
    breeder_name?: string[];
    information?: string[];
    logo?: string[];
    _form?: string; 
  };
  fields?: Partial<Farm>;
}

export type FarmWithProductCount = Farm & {
  products: {
    count: number;
  }[];
};

export type FarmContactInfo = Pick<
  Farm,
  | 'id'
  | 'name'
  | 'logo_url'
  | 'breeder_name'
  | 'contact_instagram'
  | 'contact_facebook'
  | 'contact_line'
  | 'contact_whatsapp'
  | 'contact_wechat'
>;