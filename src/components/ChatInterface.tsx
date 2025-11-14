import { useState, useRef } from "react";
import {
  Globe,
  Send,
  MoreVertical,
  Mic,
  Paperclip,
  Smile,
  FileText,
  File,
  FileType,
  Share2,
  Check,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
  translatedFrom?: string;
}

export function ChatInterface() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [exportPopup, setExportPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // -----------------------------
  // FILE UPLOAD
  // -----------------------------
  const handleFileUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: `📎 File uploaded: ${file.name}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  // -----------------------------
  // VOICE RECOGNITION
  // -----------------------------
  let recognition: any;
  if ("webkitSpeechRecognition" in window) {
    const SR = (window as any).webkitSpeechRecognition;
    recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
  }

  const startVoice = () => {
    if (!recognition) return alert("Speech Recognition not supported!");

    setListening(true);
    recognition.start();

    recognition.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setInputMessage(text);
    };

    recognition.onend = () => setListening(false);
  };

  // -----------------------------
  // SEND MESSAGE + AI RESPONSE
  // -----------------------------
  const sendMsg = () => {
    if (!inputMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, msg]);
    setInputMessage("");

    setAiTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand. Let me help you!",
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      };
      setAiTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  // -----------------------------
  // EXPORT CHAT
  // -----------------------------
  const generateChatText = () =>
    messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n\n");

  const downloadTXT = () => {
    const blob = new Blob([generateChatText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "chat.txt");
  };

  const downloadPDF = () => {
    const blob = new Blob([generateChatText()], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "chat.pdf");
  };

  const downloadWORD = () => {
    const blob = new Blob([generateChatText()], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, "chat.docx");
  };

  const triggerDownload = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  // -----------------------------
  // SHARE LINK FEATURE
  // -----------------------------
  const generateShareLink = () => {
    const encoded = encodeURIComponent(generateChatText());
    const link = `${window.location.origin}/share?data=${encoded}`;
    setShareLink(link);
    setSharePopup(true);

    navigator.clipboard.writeText(link);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
  ];

  const currentLang = languages.find((l) => l.code === selectedLanguage);

  return (
    <div className="h-[calc(100vh-4rem)] flex relative">
      {/* ---------------- SHARE POPUP ---------------- */}
      {sharePopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-xl shadow-xl border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Share Conversation Link
            </h2>

            <div className="p-3 border rounded-lg bg-gray-50 text-sm break-all">
              {shareLink}
            </div>

            <Button
              className="w-full mt-4 flex items-center gap-2 bg-[#007BFF]"
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                setCopied(true);
              }}
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>

            <Button
              variant="outline"
              className="w-full mt-3"
              onClick={() => setSharePopup(false)}
            >
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

            <Button
              className="w-full mt-4"
              variant="outline"
              onClick={() => setExportPopup(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* ---------------- LEFT CHAT AREA ---------------- */}
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
                <div
                  className={`w-2 h-2 rounded-full ${
                    aiTyping ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                <span>{aiTyping ? "Typing…" : "Online"}</span>
              </div>
            </div>
          </div>

          {/* DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Globe className="w-4 h-4" />
                {currentLang?.flag} {currentLang?.name}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {languages.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setSelectedLanguage(l.code)}
                >
                  {l.flag} {l.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F5F6FA]">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
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
            placeholder="Type your message..."
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={startVoice}
            className={listening ? "text-red-500" : ""}
          >
            <Mic className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            className="bg-[#007BFF] text-white"
            onClick={sendMsg}
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

          {/* QUICK ACTIONS */}
          <div className="mt-4 border-t pt-4">
            <h4 className="text-gray-900 mb-3">Quick Actions</h4>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setExportPopup(true)}
            >
              Export Chat
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={generateShareLink}
            >
              Share Conversation
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-red-600"
            >
              End Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}