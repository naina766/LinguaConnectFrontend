// AuthModal.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onSuccess?: (fullName?: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // LOGIN FIELDS
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP FIELDS
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // OTP FLOW
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // RESET ON OPEN/CLOSE
  useEffect(() => {
    setMode(initialMode);

    if (!isOpen) {
      setLoginEmail("");
      setLoginPassword("");
      setSignupFullName("");
      setSignupEmail("");
      setSignupPassword("");
      setOtpSent(false);
      setOtpInput("");
      setError("");
    }
  }, [isOpen, initialMode]);

  // VALIDATION HELPERS
  const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
  const validPassword = (p: string) => p.length >= 6;

  // SEND OTP (FAKE DELAY)
  const sendOtp = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 700));
      setOtpSent(true);
    } catch {
      setError("Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP (SIMULATED)
  const verifyOtpAndFinishSignup = async () => {
    if (!otpInput || otpInput.trim().length < 3) {
      setError("Enter the OTP sent to your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((r) => setTimeout(r, 700));

      const nameToSave =
        signupFullName.trim() || signupEmail.split("@")[0];

      // SAVE USER
      localStorage.setItem("username", nameToSave);
      localStorage.setItem("isAuthenticated", "true");

      onSuccess?.(nameToSave);
      onClose();
    } catch {
      setError("OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN HANDLER
  const handleLogin = async () => {
    setError("");

    if (!validEmail(loginEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!validPassword(loginPassword)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 800));

      const existingName = localStorage.getItem("username");
      const nameToSave =
        existingName || loginEmail.split("@")[0];

      localStorage.setItem("username", nameToSave);
      localStorage.setItem("isAuthenticated", "true");

      onSuccess?.(nameToSave);
      onClose();
    } catch {
      setError("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP START (SEND OTP)
  const handleSignupStart = async () => {
    setError("");

    if (!signupFullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validEmail(signupEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!validPassword(signupPassword)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    await sendOtp(signupEmail);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
            {/* CLOSE BUTTON */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setOtpSent(false);
                onClose();
              }}
              aria-label="Close"
            >
              <X />
            </button>

            {/* HEADER */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                {mode === "login"
                  ? "Login to LinguaConnect"
                  : "Create an account"}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === "login"
                  ? "Welcome back — enter your details to continue."
                  : "Create an account to unlock access."}
              </p>
            </div>

            {/* LOGIN MODE */}
            {mode === "login" ? (
              <div className="space-y-3">
                <Input
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />

                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}

                <div className="flex gap-3 mt-4">
                  <Button
                    className="flex-1"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setMode("signup")}
                  >
                    Create account
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* SIGNUP FIELDS */}
                {!otpSent ? (
                  <>
                    <Input
                      placeholder="Full Name"
                      value={signupFullName}
                      onChange={(e) =>
                        setSignupFullName(e.target.value)
                      }
                    />
                    <Input
                      placeholder="Email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                    />
                    <Input
                      placeholder="Password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) =>
                        setSignupPassword(e.target.value)
                      }
                    />

                    {error && (
                      <div className="text-sm text-red-600">{error}</div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Button
                        className="flex-1"
                        onClick={handleSignupStart}
                        disabled={loading}
                      >
                        {loading ? "Sending OTP..." : "Send OTP"}
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setMode("login")}
                      >
                        Back to Login
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* OTP STEP */}
                    <div className="text-sm text-gray-700">
                      OTP sent to{" "}
                      <span className="font-medium">
                        {signupEmail}
                      </span>
                    </div>

                    <Input
                      placeholder="Enter OTP"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />

                    {error && (
                      <div className="text-sm text-red-600">{error}</div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <Button
                        className="flex-1"
                        onClick={verifyOtpAndFinishSignup}
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Verify & Create"}
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpInput("");
                        }}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              By continuing you agree to our terms and privacy.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
