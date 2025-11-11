import { getWidgetConfig } from "../config";
import { listWalletHints } from "../utils/webauthn-hints";

/**
 * Fetches dashboard info for the current user.
 * @returns Dashboard info JSON
 */
export async function fetchDashboardInfo() {
  const { apiUrl, username, brand } = getWidgetConfig();

  let authId = null;
  const hints = await listWalletHints();
  if (hints.length > 0) {
    authId = hints[0].authenticatorId;
  }

  if (!apiUrl) throw new Error("No api info available");
  if (!authId) throw new Error("No user info available");
  if (!brand) throw new Error("No brand info available");

  const response = await fetch(`${apiUrl}/api/dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authId,
      brand,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch dashboard info");
  }

  return response.json();
}
