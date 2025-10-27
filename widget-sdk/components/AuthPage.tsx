import React, { useState, useEffect } from "react";
import {
  checkUserRegistered,
  fetchRegistrationOptions,
  doWebAuthnRegistration,
  verifyRegistrationResponse,
  fetchAuthenticationOptions,
  doWebAuthnAuthentication,
  verifyAuthenticationResponse,
} from "../utils/api/auth";
import { setUserConfig } from "../config";

interface AuthPageProps {
  onNext: () => void;
  onBack?: () => void;
  showBack?: boolean;
  headline?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({
  onNext,
  onBack,
  showBack,
  headline,
}) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  // Check registration status when username changes
  useEffect(() => {
    if (!username) {
      setRegistered(null);
      setChecking(false);
      return;
    }
  }, [username]);

  const handleStartEarning = async () => {
    setLoading(true);
    setError(null);

    try {
      setChecking(true);
      setError(null);

      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported by this browser.");
      }

      setUserConfig({ username, walletAddress: "", referralCode: "" });

      const isRegistered = await checkUserRegistered(username);
      setRegistered(isRegistered);

      if (isRegistered) {
        // Authenticate
        const options = await fetchAuthenticationOptions(username);
        const attestationResponse = await doWebAuthnAuthentication(options);
        const verificationJSON = await verifyAuthenticationResponse(
          attestationResponse,
          username
        );

        if (verificationJSON.verified) {
          setUserConfig(verificationJSON.user);
          onNext();
        } else {
          setError("WebAuthn is not supported in this browser.");
        }
      } else {
        // Register
        const optionsJSON = await fetchRegistrationOptions(username);
        const attestationResponse = await doWebAuthnRegistration(optionsJSON);
        const verificationJSON = await verifyRegistrationResponse(
          attestationResponse,
          username
        );

        if (verificationJSON.verified) {
          setUserConfig(verificationJSON.user);
          onNext();
        } else {
          setError("Registration failed.");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === "InvalidStateError") {
          setError("Authenticator was probably already registered by user");
        } else {
          setError(err.message);
        }
      } else {
        setError("Authentication error");
      }
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto pt-6 pb-8 px-2 sm:px-0 gap-y-4">
      {showBack && onBack && (
        <button
          className="absolute left-0 top-0 text-green-700 hover:underline text-sm"
          onClick={onBack}
        >
          &larr; Back
        </button>
      )}
      {/* Headline */}
      <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">
        {headline}
      </h3>
      {/* Card 1: 6DEGREES Icon */}
      <div className="w-full bg-white rounded-lg flex flex-col items-center p-6">
        <button className="px-6 py-2 bg-white border-1 text-green-600 rounded-3xl font-semibold disabled">
          6°DEGREES
        </button>
      </div>
      {/* Card 2: Wallet Info */}
      <div className="w-full bg-white rounded-xl shadow flex flex-col items-center px-4 py-5 mb-6">
        <div className="text-xl font-semibold text-gray-800 mt-4 mb-4">
          Create Your Wallet 111
        </div>
        <div className="text-gray-600 text-center mb-4">
          Secure your earnings with biometric authentication
        </div>
        <div className="text-green-700 font-medium text-center mb-4">
          Start earning rewards today
        </div>
      </div>
      {/* Card 3: User Identifier and Earn */}
      <div className="w-full bg-white rounded-lg shadow flex flex-col items-center p-6 gap-3">
        <label
          className="w-full text-sm font-medium text-gray-800 text-left mt-4"
          htmlFor="username"
        >
          User Identifier
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="px-4 py-2 rounded border border-gray-300 w-full text-base focus:outline-none focus:ring-2 focus:ring-green-500 text-black mb-4"
          placeholder="Enter your email or username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username webauthn"
          disabled={loading}
        />
        <button
          className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-3xl font-semibold text-base w-full shadow hover:bg-green-700 transition disabled:opacity-60 mb-4"
          onClick={handleStartEarning}
          disabled={loading || checking || !username}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Authenticating...
            </span>
          ) : (
            <span>Earn</span>
          )}
        </button>
        {checking && (
          <p className="mt-4 text-gray-700 text-sm">
            Checking registration status...
          </p>
        )}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default AuthPage;
