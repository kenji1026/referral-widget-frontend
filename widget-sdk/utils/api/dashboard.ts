import { getWidgetConfig } from "../../config";

/**
 * Fetches dashboard info for the current user.
 * @returns Dashboard info JSON
 */
export async function fetchDashboardInfo() {
  const { apiUrl, username, brand } = getWidgetConfig();
  if (!apiUrl) throw new Error("No api info available");
  if (!username) throw new Error("No user info available");
  if (!brand) throw new Error("No brand info available");

  const response = await fetch(`${apiUrl}/api/dashboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      brand,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch dashboard info");
  }

  return response.json();
}
