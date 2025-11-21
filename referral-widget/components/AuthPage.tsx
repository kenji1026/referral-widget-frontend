import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { PageProps } from "../types";
import { AppHeader } from "./AppHeader";
import { AppHooter } from "./AppHooter";
import {
  checkUserRegistered,
  fetchRegistrationOptions,
  doWebAuthnRegistration,
  verifyRegistrationResponse,
  fetchAuthenticationOptions,
  doWebAuthnAuthentication,
  verifyAuthenticationResponse,
  fetchAuthenticationOptionsUsernameless,
  doWebAuthnAuthenticationUsernameless,
  attemptConditionalAuthentication,
  fetchRegistrationOptionsUsernameless,
  verifyAuthenticationResponseUsernameless,
  verifyRegistrationResponseUsernameless,
} from "../api/auth";
import { setUserConfig, getWidgetConfig } from "../config";
import {
  listWalletHints,
  saveCredentialWalletMapping,
} from "../utils/webauthn-hints";

const AuthPage: React.FC<PageProps> = ({ setCurrentPage, onClose }) => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setUsername("referral-widget-id");

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

      const hints = await listWalletHints();
      let isRegistered = hints.length > 0;
      if (isRegistered) {
        isRegistered = await checkUserRegistered(hints[0].authenticatorId);
      }

      setRegistered(isRegistered);

      if (isRegistered) {
        const authId = hints[0].authenticatorId;
        // Authenticate
        const options = await fetchAuthenticationOptions(authId);
        // const attestationResponse = await attemptConditionalAuthentication(
        //   options
        // );
        // const verificationJSON = await verifyAuthenticationResponseUsernameless(
        //   attestationResponse
        // );

        const attestationResponse = await doWebAuthnAuthentication(options);
        const verificationJSON = await verifyAuthenticationResponse(
          attestationResponse,
          username
        );

        if (verificationJSON.verified) {
          setUserConfig(verificationJSON.user);

          const { refCode, ownerRefCode } = getWidgetConfig();

          if (refCode && refCode !== "" && refCode !== ownerRefCode) {
            setCurrentPage("reward");
          } else {
            setCurrentPage("share");
          }
        } else {
          setError("Authentication error");
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

          await saveCredentialWalletMapping(
            attestationResponse.id,
            verificationJSON.user.walletAddress
          );

          const { refCode, ownerRefCode } = getWidgetConfig();

          if (refCode && refCode !== "" && refCode !== ownerRefCode) {
            setCurrentPage("reward");
          } else {
            setCurrentPage("share");
          }
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

  const handleAuthentication = async () => {
    setLoading(true);
    setError(null);

    try {
      setChecking(true);
      setError(null);

      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported by this browser.");
      }

      setUserConfig({ username: "", walletAddress: "", referralCode: "" });

      const optionsJSON = await fetchAuthenticationOptionsUsernameless();
      const resp = await attemptConditionalAuthentication(optionsJSON);

      if (resp) {
        setUsername(resp.id);
        console.log({ auth_user_id: resp.id });

        const verificationJSON = await verifyAuthenticationResponseUsernameless(
          resp
        );

        if (verificationJSON.code === 404) {
          handleRegistration();
        } else if (verificationJSON.verified) {
          setUserConfig(verificationJSON.user);

          const { refCode, ownerRefCode } = getWidgetConfig();

          if (refCode && refCode !== "" && refCode !== ownerRefCode) {
            setCurrentPage("reward");
          } else {
            setCurrentPage("share");
          }
        } else {
          setError("Authentication error.");
        }
      } else {
        setError("WebAuthn is not supported by this browser(1).");
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

  const handleRegistration = async () => {
    setLoading(true);
    setError(null);

    try {
      setChecking(true);
      setError(null);

      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn is not supported by this browser.");
      }

      setUserConfig({ username: "", walletAddress: "", referralCode: "" });

      const optionsJSON = await fetchRegistrationOptionsUsernameless();
      const attestationResponse = await doWebAuthnRegistration(optionsJSON);
      console.log({ attestationResponse });
      const verificationJSON = await verifyRegistrationResponseUsernameless(
        attestationResponse
      );

      if (verificationJSON.verified) {
        setUserConfig(verificationJSON.user);

        const { refCode, ownerRefCode } = getWidgetConfig();

        if (refCode && refCode !== "" && refCode !== ownerRefCode) {
          setCurrentPage("reward");
        } else {
          setCurrentPage("share");
        }
      } else {
        setError("Registration failed.");
      }
      /*
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

          const { refCode, ownerRefCode } = getWidgetConfig();

          if (refCode && refCode !== "" && refCode !== ownerRefCode) {
            setCurrentPage("reward");
          } else {
            setCurrentPage("share");
          }
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

          const { refCode, ownerRefCode } = getWidgetConfig();

          if (refCode && refCode !== "" && refCode !== ownerRefCode) {
            setCurrentPage("reward");
          } else {
            setCurrentPage("share");
          }
        } else {
          setError("Registration failed.");
        }
      }*/
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
    <div className="space-y-6">
      <AppHeader
        title=""
        showBackButton={false}
        onBack={() => setCurrentPage("home")}
        onClose={onClose}
      />
      <section className="text-center space-y-4">
        <div className="inline-flex">
          <Gift size={72} className="text-[#88e2bb]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Sharing Pays Off!</h2>
        <p className="text-lg text-black">
          Earn up to $35.00 for each
          <br /> friend who buys
        </p>
      </section>

      <section className="text-center space-y-4">
        {/* <label
          className="w-full text-sm font-medium text-gray-800 text-left mt-4 mb-2"
          htmlFor="username"
        >
          User Identifier
        </label> */}
        {/* <input
          id="username"
          name="username"
          type="text"
          className="px-4 py-2 rounded-xl border border-[#41eb5c] w-full text-base focus:outline-none focus:ring-1 focus:ring-[#41eb5c] text-black mt-2 mb-4"
          placeholder="Enter your email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username webauthn"
          disabled={loading}
          hidden={true}
        /> */}
        <button
          onClick={handleStartEarning}
          className="w-full px-6 py-4 bg-[#41eb5c] text-gray-800 rounded-full font-medium shadow-md hover:bg-green-400 transition-colors"
          // disabled={loading || checking || !username}
          disabled={loading || checking}
          aria-busy={loading || checking}
        >
          <span className="flex items-center justify-center gap-2">
            {(loading || checking) && (
              <svg
                className="h-8 w-8 animate-spin text-gray-800"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-50"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            <span>Create Your Referral Identifier</span>
          </span>
        </button>
        {/* {checking && (
          <p className="mt-4 text-gray-700 text-sm">
            Checking registration status...
          </p>
        )} */}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </section>
      <AppHooter />
    </div>
  );
};

export default AuthPage;
