// Placeholder for referral-related API calls
import { getWidgetConfig } from "../config";
import { ProductInfo } from "../types";
import { listWalletHints } from "../utils/webauthn-hints";

/**
 * Calls the refer API endpoint to register a referral for the selected product.
 * @returns API response JSON
 */
export async function registReferral() {
  const { apiUrl, refCode, username, brand, product } = getWidgetConfig();

  let authId = null;
  const hints = await listWalletHints();
  if (hints.length > 0) {
    authId = hints[0].authenticatorId;
  }

  if (!apiUrl) throw new Error("No api info available");
  if (!refCode) throw new Error("No refer info available");
  if (!authId) throw new Error("No user info available");
  if (!brand) throw new Error("No brand info available");
  if (!product) throw new Error("No product info available");

  const response = await fetch(`${apiUrl}/api/referral/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refCode,
      referee: authId,
      brand: brand,
      product: product.name,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to refer product");
  }

  return response.json();
}

export async function checkReferral() {
  const { apiUrl, refCode, username, brand, product } = getWidgetConfig();

  let authId = null;
  const hints = await listWalletHints();
  if (hints.length > 0) {
    authId = hints[0].authenticatorId;
  }

  if (!apiUrl) throw new Error("No api info available");
  if (!refCode) throw new Error("No refer info available");
  if (!authId) throw new Error("No user info available");
  if (!brand) throw new Error("No brand info available");
  if (!product) throw new Error("No product info available");

  const response = await fetch(`${apiUrl}/api/referral/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refCode,
      referee: authId,
      brand,
      product: product.name,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to refer product");
  }

  return response.json();
}

export async function generateReferralLink() {
  // Implement referral link generation API call
}

export async function fetchReferralEvents() {
  const { apiUrl, refCode, username, brand, product } = getWidgetConfig();

  let authId = null;
  const hints = await listWalletHints();
  if (hints.length > 0) {
    authId = hints[0].authenticatorId;
  }

  if (!apiUrl) throw new Error("No api info available");
  if (!authId) throw new Error("No user info available");
  if (!brand) throw new Error("No brand info available");
  if (!product) throw new Error("No product info available");

  const response = await fetch(`${apiUrl}/api/referral/user/${authId}`);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to refer product");
  }

  return response.json();
}
