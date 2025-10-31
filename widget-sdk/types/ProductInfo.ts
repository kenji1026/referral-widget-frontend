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
