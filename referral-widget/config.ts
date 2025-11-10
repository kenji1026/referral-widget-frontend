import { ProductInfo } from "./types";

let siteUrl: string;
let apiUrl: string;
let user: {
  username: string;
  walletAddress: string;
  referralCode: string;
};
let refCode: string | null;
let brand: string;
let product: ProductInfo | null;

export function setWidgetConfig(config: {
  siteUrl: string;
  apiUrl: string;
  refCode: string | null;
  brand: string;
  product: ProductInfo | null;
}) {
  siteUrl = config.siteUrl;
  apiUrl = config.apiUrl;
  refCode = config.refCode;
  brand = config.brand;
  product = config.product;
}

export function setUserConfig(owner: {
  username: string;
  walletAddress: string;
  referralCode: string;
}) {
  user = owner;
}

export function getWidgetConfig() {
  if (!apiUrl) throw new Error("Widget config not set");
  return {
    siteUrl,
    apiUrl,
    refCode,
    username: user.username,
    walletAddress: user.walletAddress,
    ownerRefCode: user.referralCode,
    brand,
    product,
  };
}
