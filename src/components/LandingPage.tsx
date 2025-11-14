// LandingPage.tsx
import { useState, useEffect } from "react";
import { Globe, MessageSquare, BarChart3, Zap, Shield, Users } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AuthModal } from "./AuthModal";

type Page = "landing" | "chat" | "knowledge" | "dashboard" | "howitworks";

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  const [demoMode, setDemoMode] = useState<boolean>(() => {
    return localStorage.getItem("demoMode") === "true";
  });

  const [demoCount, setDemoCount] = useState<number>(() => {
    return Number(localStorage.getItem("demoCount") || 0);
  });

  // ⭐ Dynamic 100+ languages counter
  const [langCount, setLangCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 100;
    const duration = 1500;

    const counter = setInterval(() => {
      start += 1;
      setLangCount(start);
      if (start >= end) clearInterval(counter);
    }, duration / end);

    return () => clearInterval(counter);
  }, []);

  // ⭐ Dynamic USERS counter
  const [userCount, setUserCount] = useState<number>(() => {
    const saved = localStorage.getItem("userCount");
    if (saved && Number(saved) > 1000) {
      localStorage.setItem("userCount", "0");
      return 0;
    }
    return saved ? Number(saved) : 0;
  });

  // Username stored in navbar
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  // Auto-increase users every 1 min
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => {
        const n = prev + 1;
        localStorage.setItem("userCount", String(n));
        return n;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Increase userCount on login
  useEffect(() => {
    if (isAuthenticated) {
      setUserCount((prev) => {
        const n = prev + 1;
        localStorage.setItem("userCount", String(n));
        return n;
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("demoMode", demoMode ? "true" : "false");
  }, [demoMode]);

  useEffect(() => {
    localStorage.setItem("demoCount", String(demoCount));
  }, [demoCount]);

  // Sync cross-tabs
  useEffect(() => {
    const onStorage = () => {
      setUsername(localStorage.getItem("username") || "");
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
      setUserCount(Number(localStorage.getItem("userCount") || 0));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const openLoginModal = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const startDemo = () => {
    setDemoMode(true);
    setDemoCount(0);
    localStorage.setItem("demoMode", "true");
    localStorage.setItem("demoCount", "0");
    onNavigate("chat");
  };

  const handleAuthSuccess = (name?: string) => {
    setIsAuthenticated(true);
    setAuthModalOpen(false);
    setDemoMode(false);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("demoMode", "false");

    if (name) {
      localStorage.setItem("username", name);
      setUsername(name);
    } else {
      setUsername(localStorage.getItem("username") || "");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDemoMode(false);
    setDemoCount(0);
    setUsername("");
    localStorage.setItem("isAuthenticated", "false");
    localStorage.setItem("demoMode", "false");
    localStorage.setItem("demoCount", "0");
    localStorage.removeItem("username");
  };

  const floatingTexts = [
    { text: "Hello", top: "20%", left: "15%", delay: "0s" },
    { text: "Hola", top: "30%", right: "20%", delay: "0.5s" },
    { text: "नमस्ते", top: "60%", left: "10%", delay: "1s" },
    { text: "Bonjour", top: "70%", right: "15%", delay: "1.5s" },
    { text: "你好", top: "40%", left: "25%", delay: "2s" },
    { text: "مرحبا", top: "50%", right: "30%", delay: "2.5s" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#007BFF] via-[#0056b3] to-[#00B5AD] overflow-x-hidden">
        
        {/* ---------------- NAVBAR ---------------- */}
        <nav className="absolute top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#007BFF]" />
                </div>
                <span className="text-white text-lg font-medium">LinguaConnect</span>
              </div>

              <div className="flex items-center gap-4">

                <button
                  onClick={() => onNavigate("howitworks")}
                  className="text-white hover:text-blue-100 transition"
                >
                  How It Works
                </button>

                <button
                  onClick={() => onNavigate("knowledge")}
                  className="text-white hover:text-blue-100 transition"
                >
                  Knowledge Base
                </button>

                {/* ⭐ UPDATED DASHBOARD BUTTON ⭐ */}
                <Button
                  size="lg"
                  onClick={() => isAuthenticated && onNavigate("dashboard")}
                  disabled={!isAuthenticated}
                  className={
                    "bg-white text-[#007BFF] px-4 py-1.5 rounded-lg " +
                    (!isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50")
                  }
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  {isAuthenticated ? "Dashboard" : "Login to View Dashboard"}
                </Button>

                {!isAuthenticated && (
                  <>
                    <button
                      onClick={openLoginModal}
                      className="text-white border border-white/40 px-4 py-1.5 rounded-lg hover:bg-white/10 transition"
                    >
                      Login
                    </button>

                    <button
                      onClick={openSignupModal}
                      className="bg-white text-[#007BFF] px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
                    >
                      Sign Up
                    </button>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <div className="text-white text-sm px-3 py-1 rounded-lg flex items-center gap-3 select-none">
                      <span className="text-sm opacity-90">Hello,</span>
                      <span className="font-medium">{username || "User"}</span>
                      <span className="animate-wave" style={{ transformOrigin: "70% 70%" }}>👋</span>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-white border border-white/40 px-4 py-1.5 rounded-lg hover:bg-white/10 transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* ---------------- HERO SECTION ---------------- */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

          <div className="absolute inset-0 opacity-10">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1609868714484-2b2556006301"
              alt="World Map"
              className="w-full h-full object-cover"
            />
          </div>

          {floatingTexts.map((item, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                animationDelay: item.delay,
              }}
            >
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                <p className="text-white">{item.text}</p>
              </div>
            </div>
          ))}

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-white">Powered by Lingo CLI</span>
            </div>

            <h1 className="text-white text-4xl sm:text-5xl font-semibold mb-4">
              Talk to anyone, anywhere — in your language.
            </h1>

            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              AI-powered multilingual support for global businesses.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">

              {/* ⭐ CHAT BUTTON LOCKED UNTIL LOGIN ⭐ */}
              <Button
                size="lg"
                onClick={() => isAuthenticated && onNavigate("chat")}
                disabled={!isAuthenticated}
                className={
                  "bg-white text-[#007BFF] " +
                  (!isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50")
                }
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                {isAuthenticated ? "Start Chat" : "Login to Start Chat"}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={startDemo}
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                Try Demo
              </Button>
            </div>

            {/* COUNTERS */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Globe className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white">{langCount}+ Languages</p>
                <p className="text-blue-100">Real-time translation</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white">{userCount.toLocaleString()}+ Users</p>
                <p className="text-blue-100">Trusted worldwide</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white">Enterprise Security</p>
                <p className="text-blue-100">SOC 2 compliant</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-gray-900 mb-4">Why Choose LinguaConnect?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to provide world-class multilingual support
              </p>
            </div>

            {/* 6 Feature Cards — COPY OF YOUR UI */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Real-time Translation</h3>
                <p className="text-gray-600">
                  Instant AI-powered translation across 100+ languages
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Track conversations, languages, satisfaction metrics
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Multilingual Knowledge Base</h3>
                <p className="text-gray-600">
                  Automated FAQ translation and content management
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Sub-second response times</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Enterprise Security</h3>
                <p className="text-gray-600">End-to-end encryption</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">Role-based access, routing</p>
              </div>

            </div>
          </div>
        </section>

        {/* Animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes wave {
            0% { transform: rotate(0deg); }
            15% { transform: rotate(14deg); }
            30% { transform: rotate(-8deg); }
            45% { transform: rotate(14deg); }
            60% { transform: rotate(-4deg); }
            75% { transform: rotate(10deg); }
            100% { transform: rotate(0deg); }
          }
          .animate-wave {
            display: inline-block;
            animation: wave 2s infinite;
          }
        `}</style>

      </div>

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={(name?: string) => handleAuthSuccess(name)}
      />
    </>
  );
}
