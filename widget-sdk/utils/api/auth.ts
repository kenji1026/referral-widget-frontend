import {
  startRegistration,
  startAuthentication,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/browser";
import { getWidgetConfig } from "../../config";

// --------- CHECK IF USER IS REGISTERED ---------
export async function checkUserRegistered(username: string): Promise<boolean> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(`${apiUrl}/api/auth/check-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error("Failed to check user registration");
  }

  const data = await res.json();

  // The backend should return { registered: true/false }
  return !!data.registered;
}

// --------- REGISTRATION (Passkey Creation) ---------

// Fetch registration options from backend
export async function fetchRegistrationOptions(
  username: string
): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(`${apiUrl}/api/auth/generate-registration-options`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    throw new Error("Failed to get registration options");
  }

  return await res.json();
}

// Start WebAuthn registration ceremony
export async function doWebAuthnRegistration(
  optionsJSON: PublicKeyCredentialCreationOptionsJSON
): Promise<RegistrationResponseJSON> {
  try {
    // Pass the options to the authenticator and wait for a response
    return await startRegistration({ optionsJSON });
  } catch (error) {
    throw error;
  }
}

// Send registration response to backend for verification
export async function verifyRegistrationResponse(
  attestationResponse: RegistrationResponseJSON,
  username: string
): Promise<{
  verified: boolean;
  user: {
    username: string;
    walletAddress: string;
    referralCode: string;
  };
}> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(`${apiUrl}/api/auth/verify-registration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attestationResponse, username }),
  });

  if (!res.ok) {
    throw new Error("Registration verification failed");
  }

  const verificationJSON = await res.json();

  return verificationJSON; //verificationJSON.verified;
}

// --------- AUTHENTICATION (Passkey Login) ---------

// Fetch authentication options from backend
export async function fetchAuthenticationOptions(
  username: string
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(
    `${apiUrl}/api/auth/generate-authentication-options`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to get authentication options");
  }

  return await res.json();
}

// Start WebAuthn authentication ceremony
export async function doWebAuthnAuthentication(
  optionsJSON: PublicKeyCredentialRequestOptionsJSON
): Promise<AuthenticationResponseJSON> {
  try {
    return await startAuthentication({
      optionsJSON,
      // useBrowserAutofill: true,
      // verifyBrowserAutofillInput: false,
    });
  } catch (error) {
    throw error;
  }
}

// Send authentication response to backend for verification
export async function verifyAuthenticationResponse(
  attestationResponse: AuthenticationResponseJSON,
  username: string
): Promise<{
  verified: boolean;
  user: {
    username: string;
    walletAddress: string;
    referralCode: string;
  };
}> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(`${apiUrl}/api/auth/verify-authentication`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attestationResponse, username }),
  });

  if (!res.ok) {
    throw new Error("Authentication failed");
  }

  const verificationJSON = await res.json();

  return verificationJSON; //verificationJSON.verified;
}
