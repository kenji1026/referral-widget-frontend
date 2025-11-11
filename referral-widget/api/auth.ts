import {
  startRegistration,
  startAuthentication,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from "@simplewebauthn/browser";
import { getWidgetConfig } from "../config";

// --------- CHECK IF USER IS REGISTERED ---------
export async function checkUserRegistered(authId: string): Promise<boolean> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(`${apiUrl}/api/auth/check-user`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authId }),
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
    credentials: "include",
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
    credentials: "include",
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
  authId: string
): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const { apiUrl } = getWidgetConfig();

  const res = await fetch(
    `${apiUrl}/api/auth/generate-authentication-options`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authId }),
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
      // useBrowserAutofill: false,
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
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ attestationResponse, username }),
  });

  if (!res.ok) {
    throw new Error("Authentication failed");
  }

  const verificationJSON = await res.json();

  return verificationJSON; //verificationJSON.verified;
}

// usernamelsee

/**
 * SERVER CONTRACT (usernameless):
 * - Registration options must set authenticatorSelection.residentKey='required' and userVerification='required'
 * - Authentication options must set allowCredentials=[] and userVerification='required'
 * - Verify endpoints must not require a username; user is resolved by credentialId
 */

/** Registration (no identifier) */
export async function fetchRegistrationOptionsUsernameless(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const { apiUrl } = getWidgetConfig();
  const res = await fetch(`${apiUrl}/api/auth/generate-registration-options`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    // Backend should accept empty payload and generate a server-side user handle
    body: JSON.stringify({}),
  });
  if (!res.ok)
    throw new Error("Failed to get registration options (usernameless)");
  return await res.json();
}

export async function verifyRegistrationResponseUsernameless(
  attestationResponse: RegistrationResponseJSON
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
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    // No username; server links credential to the generated user
    body: JSON.stringify({ attestationResponse }),
  });
  if (!res.ok)
    throw new Error("Registration verification failed (usernameless)");
  return await res.json();
}

/** Authentication (no identifier) */
export async function fetchAuthenticationOptionsUsernameless(): Promise<PublicKeyCredentialRequestOptionsJSON> {
  const { apiUrl } = getWidgetConfig();
  const res = await fetch(
    `${apiUrl}/api/auth/generate-authentication-options`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      // Backend should return options with allowCredentials: []
      body: JSON.stringify({}),
    }
  );
  if (!res.ok)
    throw new Error("Failed to get authentication options (usernameless)");
  return await res.json();
}

/**
 * Attempt Conditional UI (autofill) authentication.
 * On supported browsers this shows the passkey account picker without user input.
 * Falls back to standard authentication if not supported or no credentials found.
 */
export async function attemptConditionalAuthentication(
  optionsJSON: PublicKeyCredentialRequestOptionsJSON,
  opts?: { verifyBrowserAutofillInput?: boolean }
): Promise<AuthenticationResponseJSON> {
  try {
    // Let the browser surface the account picker if available
    const resp = await startAuthentication({
      optionsJSON,
      // useBrowserAutofill: true,
      // verifyBrowserAutofillInput: false, // opts?.verifyBrowserAutofillInput ?? true,
    });

    return resp;
  } catch (err: unknown) {
    console.log({ err });
    // If user cancels or browser doesn't support conditional UI, return null.
    // Caller can then present a manual "Continue with passkey" button.
    // return null;
    throw err;
  }
}

/** Manual authentication trigger (user clicks a button) */
export async function doWebAuthnAuthenticationUsernameless(
  optionsJSON: PublicKeyCredentialRequestOptionsJSON
): Promise<AuthenticationResponseJSON> {
  // Standard startAuthentication without autofill
  return await startAuthentication({ optionsJSON });
}

export async function verifyAuthenticationResponseUsernameless(
  attestationResponse: AuthenticationResponseJSON
): Promise<{
  code: number;
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
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    // No username; server should resolve user from credentialId
    body: JSON.stringify({ attestationResponse }),
  });

  if (res.status === 404) {
    return {
      code: res.status,
      verified: false,
      user: { username: "", walletAddress: "", referralCode: "" },
    };
  }

  if (!res.ok)
    throw new Error("Authentication verification failed (usernameless)");
  return await res.json();
}
