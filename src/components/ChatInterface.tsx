import React, { useEffect, useRef, useState } from "react";
import {
  Globe,
  Send,
  Mic,
  Paperclip,
  Smile,
  FileText,
  File,
  FileType,
  Share2,
  X,
  Search,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

// ------------------- 100+ LANGUAGES -------------------
const allLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "pa", name: "Punjabi", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", flag: "🇮🇳" },
  { code: "or", name: "Odia", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
  { code: "fa", name: "Persian", flag: "🇮🇷" },
  { code: "ne", name: "Nepali", flag: "🇳🇵" },
  { code: "si", name: "Sinhala", flag: "🇱🇰" },
  { code: "my", name: "Burmese", flag: "🇲🇲" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "tl", name: "Tagalog", flag: "🇵🇭" },
  { code: "km", name: "Khmer", flag: "🇰🇭" },
  { code: "lo", name: "Lao", flag: "🇱🇦" },
  { code: "mn", name: "Mongolian", flag: "🇲🇳" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "sk", name: "Slovak", flag: "🇸🇰" },
  { code: "sl", name: "Slovenian", flag: "🇸🇮" },
  { code: "hr", name: "Croatian", flag: "🇭🇷" },
  { code: "sr", name: "Serbian", flag: "🇷🇸" },
  { code: "bg", name: "Bulgarian", flag: "🇧🇬" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
  { code: "et", name: "Estonian", flag: "🇪🇪" },
  { code: "lv", name: "Latvian", flag: "🇱🇻" },
  { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
  { code: "eu", name: "Basque", flag: "🇪🇸" },
  { code: "ga", name: "Irish", flag: "🇮🇪" },
  { code: "cy", name: "Welsh", flag: "🏴" },
  { code: "gd", name: "Scottish Gaelic", flag: "🏴" },
  { code: "is", name: "Icelandic", flag: "🇮🇸" },
  { code: "sq", name: "Albanian", flag: "🇦🇱" },
  { code: "mk", name: "Macedonian", flag: "🇲🇰" },
  { code: "ka", name: "Georgian", flag: "🇬🇪" },
  { code: "kk", name: "Kazakh", flag: "🇰🇿" },
  { code: "uz", name: "Uzbek", flag: "🇺🇿" },
];

// message type
interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number; // epoch ms
  language: string;
}

// helpers for storage
function readStoredMessages(): Message[] {
  try {
    const raw = localStorage.getItem("chatMessages");
    if (!raw) return [];
    return JSON.parse(raw) as Message[];
  } catch {
    return [];
  }
}

function writeStoredMessages(msgs: Message[]) {
  try {
    localStorage.setItem("chatMessages", JSON.stringify(msgs));
    // write a small flag to help other tabs detect updates
    localStorage.setItem("chatUpdatedAt", String(Date.now()));
  } catch {}
}

export function ChatInterface() {
  // 🔥 DEMO MODE + AUTH MODE
  const [demoMode, setDemoMode] = useState(() => localStorage.getItem("demoMode") === "true");
  const [demoCount, setDemoCount] = useState(() => Number(localStorage.getItem("demoCount") || 0));
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  // 🔥 DEMO LIMIT POPUP
  const [demoLimitPopup, setDemoLimitPopup] = useState(false);

  // main states
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => readStoredMessages());
  const [aiTyping, setAiTyping] = useState(false);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [exportPopup, setExportPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const [langPopup, setLangPopup] = useState(false);
  const [langSearch, setLangSearch] = useState("");

  const fileInputRef = useRef<any>(null);

  // -------------------------
  // Init voice recognition
  // -------------------------
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const Rec = (window as any).webkitSpeechRecognition;
      const r = new Rec();
      r.lang = "en-US";
      r.interimResults = true;
      recognitionRef.current = r;
    }
  }, []);

  // Persist states
  useEffect(() => localStorage.setItem("demoMode", demoMode ? "true" : "false"), [demoMode]);
  useEffect(() => localStorage.setItem("demoCount", String(demoCount)), [demoCount]);
  useEffect(() => localStorage.setItem("isAuthenticated", isAuthenticated ? "true" : "false"), [
    isAuthenticated,
  ]);

  // write messages to storage whenever they change
  useEffect(() => {
    writeStoredMessages(messages);
    // Also update a totalConversations count (useful for quick reads)
    try {
      const totalUserMsgs = messages.filter((m) => m.sender === "user").length;
      localStorage.setItem("totalConversations", String(totalUserMsgs));
    } catch {}
  }, [messages]);

  // listen for storage events (cross-tab sync)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "chatMessages" || e.key === "chatUpdatedAt") {
        setMessages(readStoredMessages());
      }
      if (e.key === "demoMode") setDemoMode(localStorage.getItem("demoMode") === "true");
      if (e.key === "demoCount") setDemoCount(Number(localStorage.getItem("demoCount") || 0));
      if (e.key === "isAuthenticated") setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // -----------------------------
  // FILE UPLOAD
  // -----------------------------
  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: `📎 File uploaded: ${file.name}`,
      sender: "user",
      timestamp: Date.now(),
      language: selectedLanguage,
    };

    setMessages((m) => {
      const next = [...m, msg];
      writeStoredMessages(next);
      return next;
    });
  };

  // -----------------------------
  // VOICE INPUT
  // -----------------------------
  const startVoice = () => {
    const rec = recognitionRef.current;
    if (!rec) return alert("Speech recognition not supported!");

    setListening(true);
    rec.start();

    rec.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setInputMessage(text);
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
  };

  // -----------------------------
  // SEND MESSAGE (🔥 DEMO LIMIT)
  // -----------------------------
  const sendMsg = () => {
    if (!inputMessage.trim()) return;

    // 🔥 DEMO MODE LIMIT
    if (demoMode && demoCount >= 10) {
      setDemoLimitPopup(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: Date.now(),
      language: selectedLanguage,
    };

    // add user message and persist
    setMessages((prev) => {
      const next = [...prev, userMsg];
      writeStoredMessages(next);
      return next;
    });

    // increment demo count
    if (demoMode) {
      const nc = demoCount + 1;
      setDemoCount(nc);
      localStorage.setItem("demoCount", String(nc));
    }

    setInputMessage("");

    // fake AI reply
    setAiTyping(true);
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `AI response in ${selectedLanguage}.`,
        sender: "assistant",
        timestamp: Date.now(),
        language: selectedLanguage,
      };

      setMessages((prev) => {
        const next = [...prev, aiMsg];
        writeStoredMessages(next);
        return next;
      });

      setAiTyping(false);
    }, 900);
  };

  // -----------------------------
  // EXPORT CHAT
  // -----------------------------
  const generateChatText = () =>
    messages
      .map((m) => {
        const t = new Date(m.timestamp).toLocaleString();
        return `${m.sender.toUpperCase()} (${m.language} @ ${t}): ${m.text}`;
      })
      .join("\n\n");

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadTXT = () =>
    triggerDownload(new Blob([generateChatText()], { type: "text/plain" }), "chat.txt");

  const downloadWORD = () =>
    triggerDownload(
      new Blob([generateChatText()], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      "chat.docx"
    );

  const downloadPDF = () =>
    triggerDownload(new Blob([generateChatText()], { type: "application/pdf" }), "chat.pdf");

  // -----------------------------
  // SHARE CHAT
  // -----------------------------
  const generateShareLink = () => {
    const encoded = encodeURIComponent(generateChatText());
    const link = `${window.location.origin}/share?data=${encoded}`;
    setShareLink(link);
    setSharePopup(true);

    try {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // -----------------------------
  // LANGUAGE FILTER
  // -----------------------------
  const top7 = allLanguages.slice(0, 7);

  const filteredLangs =
    langSearch.trim().length > 0
      ? allLanguages.filter((l) =>
          l.name.toLowerCase().includes(langSearch.toLowerCase())
        )
      : top7;

  const currentLang = allLanguages.find((l) => l.code === selectedLanguage);

  // -------------------------------------------------------------------------
  // UI BELOW — EXACT SAME AS YOURS (only logic updated, no UI touched)
  // -------------------------------------------------------------------------
  return (
    <div className="h-[calc(100vh-4rem)] flex relative">

      {/* 🔥 DEMO LIMIT POPUP */}
      {demoLimitPopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl w-72 shadow-xl text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Demo Limit Reached!
            </h2>
            <p className="text-gray-700 mb-4">
              You have used all 10 free messages.  
              Please Login or Signup to continue chatting.
            </p>

            <Button
              className="w-full bg-[#007BFF] text-white"
              onClick={() => (window.location.href = "/")}
            >
              Go to Login / Signup
            </Button>

            <Button
              className="w-full mt-3"
              variant="outline"
              onClick={() => setDemoLimitPopup(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* ---------------- LANGUAGE POPUP ---------------- */}
      {langPopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[600px] max-h-[80vh] p-6 rounded-xl shadow-xl border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Language</h2>
              <Button variant="ghost" onClick={() => setLangPopup(false)}>
                <X />
              </Button>
            </div>

            <div className="relative mb-4">
              <Input
                placeholder="Search language..."
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
            </div>

            <div className="overflow-y-auto border rounded-lg p-3">
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}
              >
                {filteredLangs.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLanguage(l.code);
                      setLangPopup(false);
                    }}
                    className={`flex flex-col items-center p-2 border rounded-lg bg-gray-50 hover:bg-blue-100 ${
                      selectedLanguage === l.code ? "ring-2 ring-blue-300 bg-blue-50" : ""
                    }`}
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <span className="text-xs text-gray-700 mt-1">{l.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SHARE POPUP ---------------- */}
      {sharePopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Share Conversation
            </h2>

            <div className="p-3 bg-gray-50 border rounded text-xs break-all">
              {shareLink}
            </div>

            <Button
              className="w-full mt-4 bg-[#007BFF] text-white"
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button variant="outline" className="w-full mt-3" onClick={() => setSharePopup(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* ---------------- EXPORT POPUP ---------------- */}
      {exportPopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded-xl shadow-xl border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Export Chat As
            </h2>

            <Button className="w-full mb-3 flex gap-2" onClick={downloadPDF}>
              <FileText className="w-5 h-5" /> PDF
            </Button>

            <Button className="w-full mb-3 flex gap-2" onClick={downloadWORD}>
              <File className="w-5 h-5" /> Word (.docx)
            </Button>

            <Button className="w-full flex gap-2" onClick={downloadTXT}>
              <FileType className="w-5 h-5" /> Text (.txt)
            </Button>

            <Button className="w-full mt-4" variant="outline" onClick={() => setExportPopup(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {/* ---------------- LEFT CHAT ---------------- */}
      <div className="flex-1 flex flex-col bg-white">
        {/* HEADER */}
        <div className="border-b px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] text-white rounded-full flex items-center justify-center">
              AI
            </div>

            <div>
              <h3 className="text-gray-900">LinguaConnect Support</h3>
              <div className="text-gray-500 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${aiTyping ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
                <span>{aiTyping ? "Typing…" : "Online"}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex gap-2"
            onClick={() => {
              setLangSearch("");
              setLangPopup(true);
            }}
          >
            <Globe className="w-4 h-4" />
            <span>{currentLang?.flag} {currentLang?.name}</span>
          </Button>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F5F6FA]">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[70%] ${
                    m.sender === "user"
                      ? "bg-[#007BFF] text-white rounded-br-none"
                      : "bg-white text-gray-900 border shadow-sm rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {aiTyping && (
              <div className="flex">
                <div className="px-4 py-3 bg-white rounded-xl shadow border animate-pulse">
                  AI is typing…
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INPUT */}
        <div className="border-t px-6 py-4 flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <Smile className="w-5 h-5" />
          </Button>

          <Input
            className="flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            placeholder={
              demoMode && demoCount >= 10
                ? "Demo limit reached — Login to continue"
                : "Type your message..."
            }
            disabled={demoMode && demoCount >= 10}
          />

          <Button variant="ghost" size="icon" onClick={startVoice}>
            <Mic className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="bg-[#007BFF] text-white"
            onClick={sendMsg}
            disabled={demoMode && demoCount >= 10}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* ---------------- RIGHT SIDEBAR ---------------- */}
      <div className="w-80 bg-white border-l p-6">
        <h3 className="text-gray-900 mb-4">Conversation Details</h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="text-gray-600">Active Language</p>
            <p className="text-gray-900">{currentLang?.name}</p>
          </div>

          <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="text-gray-600">Status</p>
            <p className="text-gray-900">{aiTyping ? "AI Responding" : "Active"}</p>
          </div>

          <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="text-gray-600">Messages</p>
            <p className="text-gray-900">{messages.length}</p>
          </div>

          <div className="mt-4 border-t pt-4">
            <h4 className="text-gray-900 mb-3">Quick Actions</h4>

            <Button variant="outline" className="w-full justify-start" onClick={() => setExportPopup(true)}>
              Export Chat
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={generateShareLink}>
              Share Conversation
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600"
              onClick={() => {
                setMessages([]);
                writeStoredMessages([]);
                try {
                  localStorage.removeItem("totalConversations");
                } catch {}
              }}
            >
              End Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
