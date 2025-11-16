// // AuthModal.tsx
// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { createPortal } from "react-dom";

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   initialMode?: "login" | "signup";
//   onSuccess?: (fullName?: string) => void;
// }

// export function AuthModal({
//   isOpen,
//   onClose,
//   initialMode = "login",
//   onSuccess,
// }: AuthModalProps) {
//   const [mode, setMode] = useState<"login" | "signup">(initialMode);

//   // LOGIN FIELDS
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");

//   // SIGNUP FIELDS
//   const [signupFullName, setSignupFullName] = useState("");
//   const [signupEmail, setSignupEmail] = useState("");
//   const [signupPassword, setSignupPassword] = useState("");

//   // OTP FLOW
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpInput, setOtpInput] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // RESET FORM WHEN MODAL OPENS/CLOSES
//   useEffect(() => {
//     setMode(initialMode);

//     if (!isOpen) {
//       setLoginEmail("");
//       setLoginPassword("");
//       setSignupFullName("");
//       setSignupEmail("");
//       setSignupPassword("");
//       setOtpSent(false);
//       setOtpInput("");
//       setError("");
//       setLoading(false);
//     }
//   }, [isOpen, initialMode]);

//   // VALIDATION
//   const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
//   const validPassword = (p: string) => p.length >= 6;

//   // =======================
//   // SAVE USER FUNCTION
//   // =======================
//   const saveUserData = (name: string, email: string, method: "password" | "otp") => {
//     const timestamp = new Date().toISOString();
//     const userId = crypto.randomUUID();

//     const userData = {
//       id: userId,
//       email,
//       fullName: name,
//       loginAt: timestamp,
//       method,
//     };

//     // SESSION
//     localStorage.setItem("username", name);
//     localStorage.setItem("userEmail", email);
//     localStorage.setItem("userId", userId);
//     localStorage.setItem("authMethod", method);
//     localStorage.setItem("isAuthenticated", "true");
//     localStorage.setItem("lastLogin", timestamp);

//     // ============================
//     // 🔥 ADMIN CHECK
//     // ============================
//     if (email === "admin123@gmail.com" && (loginPassword === "admin123" || signupPassword === "admin123")) {
//       localStorage.setItem("isAdmin", "true");
//     } else {
//       localStorage.setItem("isAdmin", "false");
//     }

//     // ADD USER TO DB
//     const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
//     const updatedUsers = [...existingUsers, userData];
//     localStorage.setItem("users", JSON.stringify(updatedUsers));
//   };

//   // SEND OTP
//   const sendOtp = async (email: string) => {
//     setLoading(true);
//     setError("");
//     try {
//       await new Promise((r) => setTimeout(r, 700));
//       setOtpSent(true);
//     } catch {
//       setError("Failed to send OTP. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // VERIFY OTP
//   const verifyOtpAndFinishSignup = async () => {
//     if (!otpInput.trim()) {
//       setError("Enter the OTP sent to your email.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       await new Promise((r) => setTimeout(r, 700));

//       const name = signupFullName.trim() || signupEmail.split("@")[0];

//       saveUserData(name, signupEmail, "otp");

//       onSuccess?.(name);
//       onClose();
//     } catch {
//       setError("OTP verification failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =======================
//   // LOGIN
//   // =======================
//   const handleLogin = async () => {
//     setError("");

//     if (!validEmail(loginEmail)) {
//       setError("Please enter a valid email.");
//       return;
//     }
//     if (!validPassword(loginPassword)) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     setLoading(true);

//     try {
//       await new Promise((r) => setTimeout(r, 800));

//       const nameFromEmail = loginEmail.split("@")[0];
//       const finalName = localStorage.getItem("username") || nameFromEmail;

//       saveUserData(finalName, loginEmail, "password");

//       onSuccess?.(finalName);
//       onClose();
//     } catch {
//       setError("Login failed. Check credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // SIGNUP START → OTP
//   const handleSignupStart = async () => {
//     setError("");

//     if (!signupFullName.trim()) {
//       setError("Please enter your full name.");
//       return;
//     }
//     if (!validEmail(signupEmail)) {
//       setError("Please enter a valid email.");
//       return;
//     }
//     if (!validPassword(signupPassword)) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     await sendOtp(signupEmail);
//   };

//   // =======================
//   // UI RETURN
//   // =======================
//   return (
//     <>
//       {isOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//           <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">

//             {/* CLOSE */}
//             <button
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//               onClick={() => {
//                 setOtpSent(false);
//                 onClose();
//               }}
//             >
//               <X />
//             </button>

//             {/* HEADER */}
//             <div className="mb-4">
//               <h2 className="text-lg font-semibold">
//                 {mode === "login" ? "Login to LinguaConnect" : "Create an account"}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 {mode === "login"
//                   ? "Welcome back — enter your details to continue."
//                   : "Create an account to unlock access."}
//               </p>
//             </div>

//             {/* LOGIN MODE */}
//             {mode === "login" ? (
//               <div className="space-y-3">
//                 <Input
//                   placeholder="Email"
//                   value={loginEmail}
//                   onChange={(e) => setLoginEmail(e.target.value)}
//                 />
//                 <Input
//                   placeholder="Password"
//                   type="password"
//                   value={loginPassword}
//                   onChange={(e) => setLoginPassword(e.target.value)}
//                 />

//                 {error && <div className="text-sm text-red-600">{error}</div>}

//                 <div className="flex gap-3 mt-4">
//                   <Button className="flex-1" onClick={handleLogin} disabled={loading}>
//                     {loading ? "Logging in..." : "Login"}
//                   </Button>

//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setMode("signup")}
//                   >
//                     Create account
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {!otpSent ? (
//                   <>
//                     <Input
//                       placeholder="Full Name"
//                       value={signupFullName}
//                       onChange={(e) => setSignupFullName(e.target.value)}
//                     />
//                     <Input
//                       placeholder="Email"
//                       value={signupEmail}
//                       onChange={(e) => setSignupEmail(e.target.value)}
//                     />
//                     <Input
//                       placeholder="Password"
//                       type="password"
//                       value={signupPassword}
//                       onChange={(e) => setSignupPassword(e.target.value)}
//                     />

//                     {error && <div className="text-sm text-red-600">{error}</div>}

//                     <div className="flex gap-3 mt-4">
//                       <Button className="flex-1" onClick={handleSignupStart} disabled={loading}>
//                         {loading ? "Sending OTP..." : "Send OTP"}
//                       </Button>

//                       <Button
//                         variant="outline"
//                         className="flex-1"
//                         onClick={() => setMode("login")}
//                       >
//                         Back to Login
//                       </Button>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-sm text-gray-700">
//                       OTP sent to <span className="font-medium">{signupEmail}</span>
//                     </div>

//                     <Input
//                       placeholder="Enter OTP"
//                       value={otpInput}
//                       onChange={(e) => setOtpInput(e.target.value)}
//                     />

//                     {error && <div className="text-sm text-red-600">{error}</div>}

//                     <div className="flex gap-3 mt-4">
//                       <Button
//                         className="flex-1"
//                         onClick={verifyOtpAndFinishSignup}
//                         disabled={loading}
//                       >
//                         {loading ? "Verifying..." : "Verify & Create"}
//                       </Button>

//                       <Button
//                         variant="outline"
//                         className="flex-1"
//                         onClick={() => {
//                           setOtpSent(false);
//                           setOtpInput("");
//                         }}
//                       >
//                         Edit Details
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             <div className="mt-4 text-xs text-gray-500">
//               By continuing you agree to our terms and privacy.
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


// **********************
// AuthModal.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

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
      setLoading(false);
    }
  }, [isOpen, initialMode]);

  // lock body scroll while modal open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const target = document.getElementById("modal-root") ?? document.body;

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError("");
    if (!validateEmail(loginEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!loginPassword || loginPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulate
      onSuccess?.(); // notify parent
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError("");
    if (!signupFullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!validateEmail(signupEmail)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700)); // simulate
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otpInput.trim()) {
      setError("Enter the OTP sent to your email.");
      return;
    }
    if (!(otpInput === "000000" || otpInput.length >= 6)) {
      setError("Invalid OTP. Try 000000 for demo.");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      onSuccess?.(signupFullName.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const overlay = (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-[2147483647] flex"
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Right corner container */}
      <div
        role="dialog"
        aria-modal="true"
        className="pointer-events-auto"
        style={{
          position: "fixed",
          top: "4rem",
          right: "1.25rem",
          width: "360px",
          maxWidth: "calc(100% - 2rem)",
          borderRadius: "12px",
          background: "white",
          boxShadow: "0 10px 30px rgba(2,6,23,0.2)",
          padding: "1.25rem",
          transform: "none",
          willChange: "transform",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
          }}
        >
          <X />
        </button>

        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 6 }}>
          {mode === "login" ? "Login to LinguaConnect" : "Create an account"}
        </h2>

        <p style={{ color: "#6b7280", marginBottom: 12, fontSize: "0.875rem" }}>
          {mode === "login"
            ? "Welcome back — enter your details to continue."
            : otpSent
            ? "Enter the OTP sent to your email to verify."
            : "Create an account to unlock access."}
        </p>

        {error && (
          <div style={{ color: "#dc2626", marginBottom: 10, fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        {mode === "login" ? (
          <>
            <label style={{ display: "block", marginBottom: 6, fontSize: "0.875rem" }}>
              Email
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: 6,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                autoComplete="email"
              />
            </label>

            <label style={{ display: "block", marginBottom: 6, fontSize: "0.875rem" }}>
              Password
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: 6,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
                autoComplete="current-password"
              />
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: 8,
                  background: "#007BFF",
                  color: "white",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setOtpSent(false);
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "0.6rem",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid #d1d5db",
                  color: "#111827",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Create account
              </button>
            </div>
          </>
        ) : (
          <>
            {!otpSent ? (
              <>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.875rem" }}>
                  Full Name
                  <input
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: 6,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                    autoComplete="name"
                  />
                </label>

                <label style={{ display: "block", marginBottom: 6, fontSize: "0.875rem" }}>
                  Email
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: 6,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                    autoComplete="email"
                  />
                </label>

                <label style={{ display: "block", marginBottom: 6, fontSize: "0.875rem" }}>
                  Password
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: 6,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                    autoComplete="new-password"
                  />
                </label>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: 8,
                      background: "#007BFF",
                      color: "white",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setOtpSent(false);
                    }}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: 8,
                      background: "transparent",
                      border: "1px solid #d1d5db",
                      color: "#111827",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <label style={{ display: "block", marginBottom: 6, fontSize: "0.875rem" }}>
                  Enter OTP (try 000000)
                  <input
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "0.5rem",
                      marginTop: 6,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </label>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: 8,
                      background: "#007BFF",
                      color: "white",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtpInput("");
                    }}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: 8,
                      background: "transparent",
                      border: "1px solid #d1d5db",
                      color: "#111827",
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    Resend
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, target);
}