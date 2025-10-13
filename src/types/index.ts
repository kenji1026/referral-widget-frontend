export type ProductVariant = {
  id: string;
  title: string;
  available: boolean;
  price: number; // price in minor units (e.g., cents)
  compareAtPrice?: number | null;
  inventoryQuantity?: number;
};

export type Product = {
  id: string;
  title: string;
  handle: string; // URL path
  brand: string;
  images: Array<string>;
  variants: Array<any>;
  materials: string;
  dimensions: string;
  care: string;
  currency: string;
  descriptionHtml: string;
  price: number; // in EUR
  available: boolean;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
};
