export interface ReferralWidgetProps {
  refCode: string | null;
  siteUrl: string;
  apiUrl: string;
  open: boolean;
  brand: string;
  product: ProductInfo | null;
  onClose: () => void;
}

export interface PageProps {
  setCurrentPage: (page: string) => void;
  onClose: () => void;
}

/**
 * ProductInfo represents the minimal product data required by the referral widget.
 */
export interface ProductInfo {
  id: string;
  name: string;
  imageUrl?: string;
  price?: number;
  description?: string;
  // [key: string]: unknown; // Allow extension for additional product fields
}

export interface Activity {
  type: string;
  amount: string;
  product: string;
  date: string;
}
