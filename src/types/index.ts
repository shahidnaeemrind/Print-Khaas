export type ProductType = 'individual' | 'package';
export type TargetAudience = 'schools' | 'parents' | 'both';
export type StockStatus = 'in_stock' | 'pre_order' | 'out_of_stock';
export type ProductStatus = 'draft' | 'published';

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  productType: ProductType;
  category: string;
  targetAudience: TargetAudience;
  gradeRange?: string;
  language?: string;
  pages?: string;
  dimensions?: string;
  binding?: string;
  coverImage?: string;
  additionalImages?: string[];
  parentPrice?: number;
  schoolPrice?: number;
  originalPrice?: number;
  discount?: string;
  youtubeUrl?: string;
  drivePdfUrl?: string;
  tableOfContents?: string;
  learningOutcomes?: string;
  minOrderQuantity?: number;
  stockStatus?: StockStatus;
  featured?: boolean;
  status: ProductStatus;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanySettings {
  brandName: string;
  tagline?: string;
  establishedYear?: string;
  address?: string;
  phone?: string;
  whatsappNumber: string;
  email?: string;
  announcement?: string;
  updatedAt?: string;
}

export interface GlobalSeoSettings {
  titlePrefix: string;
  defaultDescription: string;
  faviconUrl?: string;
  keywords?: string;
  ogImageUrl?: string;
  googleVerification?: string;
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAuthorizedAdmin: boolean;
}

export interface FilterState {
  search: string;
  category: string;
  grade: string;
  audience: string;
  productType: string;
  sortBy: 'featured' | 'newest' | 'priceAsc' | 'priceDesc' | 'title';
}
