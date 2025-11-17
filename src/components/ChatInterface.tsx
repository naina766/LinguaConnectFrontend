// ChatInterface.tsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Globe,
  Send,
  Mic,
  Paperclip,
  Smile,
  FileText,
  File,
  FileType,
  Search,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

/**
 * NOTE:
 * - This component uses the lightweight chatbot endpoints:
 *   POST /api/chatbot/reply  (body: { question })
 *   POST /api/chatbot/audio  (multipart form-data: audio)
 *
 * - If you want the conversationId-based endpoints (/api/chats/*) instead,
 *   tell me and I'll swap the requests.
 */

// ---------- small languages list (extendable) ----------
const languages = [
  { code: "ace_Arab", name: "Acehnese (Arabic script)" },
  { code: "ace_Latn", name: "Acehnese (Latin script)" },
  { code: "acm_Arab", name: "Mesopotamian Arabic" },
  { code: "acq_Arab", name: "Ta'izzi-Adeni Arabic" },
  { code: "aeb_Arab", name: "Tunisian Arabic" },
  { code: "afr_Latn", name: "Afrikaans" },
  { code: "ajp_Arab", name: "South Levantine Arabic" },
  { code: "aka_Latn", name: "Akan" },
  { code: "als_Latn", name: "Tosk Albanian" },
  { code: "amh_Ethi", name: "Amharic" },
  { code: "apc_Arab", name: "North Levantine Arabic" },
  { code: "arb_Arab", name: "Modern Standard Arabic" },
  { code: "ars_Arab", name: "Najdi Arabic" },
  { code: "ary_Arab", name: "Moroccan Arabic" },
  { code: "arz_Arab", name: "Egyptian Arabic" },
  { code: "asm_Beng", name: "Assamese" },
  { code: "ast_Latn", name: "Asturian" },
  { code: "awa_Deva", name: "Awadhi" },
  { code: "ayr_Latn", name: "Aymara" },
  { code: "azb_Arab", name: "South Azerbaijani" },
  { code: "azj_Latn", name: "North Azerbaijani" },
  { code: "bak_Cyrl", name: "Bashkir" },
  { code: "bam_Latn", name: "Bambara" },
  { code: "ban_Latn", name: "Balinese" },
  { code: "bel_Cyrl", name: "Belarusian" },
  { code: "bem_Latn", name: "Bemba" },
  { code: "ben_Beng", name: "Bengali" },
  { code: "bho_Deva", name: "Bhojpuri" },
  { code: "bjn_Arab", name: "Banjar (Arabic script)" },
  { code: "bjn_Latn", name: "Banjar (Latin script)" },
  { code: "bod_Tibt", name: "Tibetan" },
  { code: "bos_Latn", name: "Bosnian" },
  { code: "bug_Latn", name: "Buginese" },
  { code: "bul_Cyrl", name: "Bulgarian" },
  { code: "cat_Latn", name: "Catalan" },
  { code: "ceb_Latn", name: "Cebuano" },
  { code: "ces_Latn", name: "Czech" },
  { code: "cjk_Latn", name: "Chokwe" },
  { code: "ckb_Arab", name: "Central Kurdish" },
  { code: "crh_Latn", name: "Crimean Tatar" },
  { code: "cym_Latn", name: "Welsh" },
  { code: "dan_Latn", name: "Danish" },
  { code: "deu_Latn", name: "German" },
  { code: "dik_Latn", name: "Dinka" },
  { code: "dyu_Latn", name: "Dyula" },
  { code: "dzo_Tibt", name: "Dzongkha" },
  { code: "ell_Grek", name: "Greek" },
  { code: "eng_Latn", name: "English" },
  { code: "epo_Latn", name: "Esperanto" },
  { code: "est_Latn", name: "Estonian" },
  { code: "eus_Latn", name: "Basque" },
  { code: "ewe_Latn", name: "Ewe" },
  { code: "fao_Latn", name: "Faroese" },
  { code: "fas_Arab", name: "Persian" },
  { code: "fij_Latn", name: "Fijian" },
  { code: "fin_Latn", name: "Finnish" },
  { code: "fon_Latn", name: "Fon" },
  { code: "fra_Latn", name: "French" },
  { code: "fur_Latn", name: "Friulian" },
  { code: "fuv_Latn", name: "Nigerian Fulfulde" },
  { code: "gaz_Latn", name: "West Central Oromo" },
  { code: "gla_Latn", name: "Scottish Gaelic" },
  { code: "gle_Latn", name: "Irish" },
  { code: "glg_Latn", name: "Galician" },
  { code: "grn_Latn", name: "Guarani" },
  { code: "guj_Gujr", name: "Gujarati" },
  { code: "hat_Latn", name: "Haitian Creole" },
  { code: "hau_Latn", name: "Hausa" },
  { code: "heb_Hebr", name: "Hebrew" },
  { code: "hin_Deva", name: "Hindi" },
  { code: "hne_Deva", name: "Chhattisgarhi" },
  { code: "hrv_Latn", name: "Croatian" },
  { code: "hun_Latn", name: "Hungarian" },
  { code: "hye_Armn", name: "Armenian" },
  { code: "ibb_Latn", name: "Ibibio" },
  { code: "ibo_Latn", name: "Igbo" },
  { code: "ilo_Latn", name: "Ilocano" },
  { code: "ind_Latn", name: "Indonesian" },
  { code: "isl_Latn", name: "Icelandic" },
  { code: "ita_Latn", name: "Italian" },
  { code: "jav_Latn", name: "Javanese" },
  { code: "jpn_Jpan", name: "Japanese" },
  { code: "kab_Latn", name: "Kabyle" },
  { code: "kam_Latn", name: "Kamba" },
  { code: "kan_Knda", name: "Kannada" },
  { code: "kas_Arab", name: "Kashmiri (Arabic)" },
  { code: "kas_Deva", name: "Kashmiri (Devanagari)" },
  { code: "kat_Geor", name: "Georgian" },
  { code: "kaz_Cyrl", name: "Kazakh" },
  { code: "kbp_Latn", name: "Kabiyè" },
  { code: "kea_Latn", name: "Kabuverdianu" },
  { code: "khk_Cyrl", name: "Mongolian" },
  { code: "khm_Khmr", name: "Khmer" },
  { code: "kik_Latn", name: "Kikuyu" },
  { code: "kin_Latn", name: "Kinyarwanda" },
  { code: "kir_Cyrl", name: "Kyrgyz" },
  { code: "kmb_Latn", name: "Kimbundu" },
  { code: "kmr_Latn", name: "Northern Kurdish" },
  { code: "knc_Arab", name: "Central Kanuri (Arabic)" },
  { code: "knc_Latn", name: "Central Kanuri (Latin)" },
  { code: "kon_Latn", name: "Kongo" },
  { code: "kor_Hang", name: "Korean" },
  { code: "lao_Laoo", name: "Lao" },
  { code: "lis_Lisu", name: "Lisu" },
  { code: "lit_Latn", name: "Lithuanian" },
  { code: "lns_Latn", name: "Lamnso’" },
  { code: "lug_Latn", name: "Ganda" },
  { code: "luo_Latn", name: "Luo" },
  { code: "lus_Latn", name: "Mizo" },
  { code: "lvs_Latn", name: "Latvian" },
  { code: "mag_Deva", name: "Magahi" },
  { code: "mai_Deva", name: "Maithili" },
  { code: "mal_Mlym", name: "Malayalam" },
  { code: "mar_Deva", name: "Marathi" },
  { code: "min_Latn", name: "Minangkabau" },
  { code: "mlg_Latn", name: "Malagasy" },
  { code: "mlt_Latn", name: "Maltese" },
  { code: "mni_Mtei", name: "Meiteilon (Manipuri)" },
  { code: "mya_Mymr", name: "Burmese" },
  { code: "nld_Latn", name: "Dutch" },
  { code: "nno_Latn", name: "Norwegian Nynorsk" },
  { code: "nob_Latn", name: "Norwegian Bokmål" },
  { code: "npi_Deva", name: "Nepali" },
  { code: "nya_Latn", name: "Nyanja" },
  { code: "oci_Latn", name: "Occitan" },
  { code: "ory_Orya", name: "Odia" },
  { code: "pag_Latn", name: "Pangasinan" },
  { code: "pan_Guru", name: "Punjabi" },
  { code: "pap_Latn", name: "Papiamento" },
  { code: "pes_Arab", name: "Western Persian" },
  { code: "plt_Latn", name: "Plateau Malagasy" },
  { code: "pol_Latn", name: "Polish" },
  { code: "por_Latn", name: "Portuguese" },
  { code: "prs_Arab", name: "Dari Persian" },
  { code: "quy_Latn", name: "Quechua" },
  { code: "ron_Latn", name: "Romanian" },
  { code: "run_Latn", name: "Rundi" },
  { code: "rus_Cyrl", name: "Russian" },
  { code: "sag_Latn", name: "Sango" },
  { code: "san_Deva", name: "Sanskrit" },
  { code: "sat_Olck", name: "Santali" },
  { code: "scn_Latn", name: "Sicilian" },
  { code: "shn_Mymr", name: "Shan" },
  { code: "sin_Sinh", name: "Sinhala" },
  { code: "slk_Latn", name: "Slovak" },
  { code: "slv_Latn", name: "Slovenian" },
  { code: "smo_Latn", name: "Samoan" },
  { code: "sna_Latn", name: "Shona" },
  { code: "snd_Arab", name: "Sindhi" },
  { code: "som_Latn", name: "Somali" },
  { code: "sot_Latn", name: "Southern Sotho" },
  { code: "spa_Latn", name: "Spanish" },
  { code: "srd_Latn", name: "Sardinian" },
  { code: "srp_Cyrl", name: "Serbian" },
  { code: "ssw_Latn", name: "Swati" },
  { code: "sun_Latn", name: "Sundanese" },
  { code: "swe_Latn", name: "Swedish" },
  { code: "swh_Latn", name: "Swahili" },
  { code: "szl_Latn", name: "Silesian" },
  { code: "tam_Taml", name: "Tamil" },
  { code: "tat_Cyrl", name: "Tatar" },
  { code: "tel_Telu", name: "Telugu" },
  { code: "tgk_Cyrl", name: "Tajik" },
  { code: "tgl_Latn", name: "Tagalog" },
  { code: "tha_Thai", name: "Thai" },
  { code: "tir_Ethi", name: "Tigrinya" },
  { code: "tpi_Latn", name: "Tok Pisin" },
  { code: "tsn_Latn", name: "Tswana" },
  { code: "tso_Latn", name: "Tsonga" },
  { code: "tuk_Latn", name: "Turkmen" },
  { code: "tur_Latn", name: "Turkish" },
  { code: "twi_Latn", name: "Twi" },
  { code: "uig_Arab", name: "Uyghur" },
  { code: "ukr_Cyrl", name: "Ukrainian" },
  { code: "umb_Latn", name: "Umbundu" },
  { code: "urd_Arab", name: "Urdu" },
  { code: "uzn_Latn", name: "Uzbek" },
  { code: "vec_Latn", name: "Venetian" },
  { code: "vie_Latn", name: "Vietnamese" },
  { code: "war_Latn", name: "Waray" },
  { code: "wol_Latn", name: "Wolof" },
  { code: "xho_Latn", name: "Xhosa" },
  { code: "ydd_Hebr", name: "Yiddish" },
  { code: "yor_Latn", name: "Yoruba" },
  { code: "zho_Hans", name: "Chinese (Simplified)" },
  { code: "zho_Hant", name: "Chinese (Traditional)" },
  { code: "zsm_Latn", name: "Standard Malay" },
  { code: "zul_Latn", name: "Zulu" },
];

// ---------------------- Types ----------------------
interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: number;
  language: string;
  translatedFrom?: string;
}

// ---------------------- storage helpers ----------------------
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
    localStorage.setItem("chatUpdatedAt", String(Date.now()));
  } catch {}
}

// ---------------------- main component ----------------------
export function ChatInterface() {
  // DEMO + AUTH flags persisted
  const [demoMode, setDemoMode] = useState<boolean>(
    () => localStorage.getItem("demoMode") === "true"
  );
  const [demoCount, setDemoCount] = useState<number>(() =>
    Number(localStorage.getItem("demoCount") || 0)
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  // UI state
  const [demoLimitPopup, setDemoLimitPopup] = useState(false);
  const [exportPopup, setExportPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(() =>
    readStoredMessages()
  );
  const [aiTyping, setAiTyping] = useState(false);

  const [listening, setListening] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng_Latn");

  const stickerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio recording
  const [recordingAudio, setRecordingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // message container ref for autoscroll
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  // persist flags
  useEffect(
    () => localStorage.setItem("demoMode", demoMode ? "true" : "false"),
    [demoMode]
  );
  useEffect(
    () => localStorage.setItem("demoCount", String(demoCount)),
    [demoCount]
  );
  useEffect(
    () =>
      localStorage.setItem(
        "isAuthenticated",
        isAuthenticated ? "true" : "false"
      ),
    [isAuthenticated]
  );

  // persist messages
  useEffect(() => {
    writeStoredMessages(messages);
    try {
      const userCount = messages.filter((m) => m.sender === "user").length;
      localStorage.setItem("totalConversations", String(userCount));
    } catch {}
  }, [messages]);

  // cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "chatMessages" || e.key === "chatUpdatedAt") {
        setMessages(readStoredMessages());
      }
      if (e.key === "demoMode")
        setDemoMode(localStorage.getItem("demoMode") === "true");
      if (e.key === "demoCount")
        setDemoCount(Number(localStorage.getItem("demoCount") || 0));
      if (e.key === "isAuthenticated")
        setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // click-outside for sticker box
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        stickerRef.current &&
        !stickerRef.current.contains(e.target as Node)
      ) {
        setShowStickers(false);
      }
    };
    if (showStickers) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStickers]);

  // init speech recognition (if available)
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const Rec = (window as any).webkitSpeechRecognition;
      const r = new Rec();
      r.interimResults = true;
      r.continuous = false;
      r.lang = "en-US";
      recognitionRef.current = r;
    }
  }, []);

  function guessSpeechLocale(code: string) {
    const c = code.toLowerCase();
    if (c.includes("hin")) return "hi-IN";
    if (c.includes("fra")) return "fr-FR";
    if (c.includes("spa")) return "es-ES";
    if (c.includes("deu")) return "de-DE";
    if (c.includes("ita")) return "it-IT";
    if (c.includes("jpn")) return "ja-JP";
    if (c.includes("kor")) return "ko-KR";
    if (c.includes("zho")) return "zh-CN";
    if (c.includes("urd")) return "ur-PK";
    if (c.includes("ara")) return "ar-SA";
    return "en-US";
  }

  const startVoice = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      alert("Speech recognition not supported in this browser");
      return;
    }
    try {
      rec.lang = guessSpeechLocale(selectedLanguage);
      rec.start();
      setListening(true);
    } catch {}
    rec.onresult = (e: any) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++)
        txt += e.results[i][0].transcript;
      setInputMessage(txt);
    };
    rec.onend = () => setListening(false);
  };

// -----------------------------
// SEND AUDIO TO BACKEND (FIXED)
// -----------------------------
const sendAudioToBackend = async (audioBlob: Blob) => {
  console.log("▶️ Sending audio... size:", audioBlob.size);

  if (audioBlob.size < 2000) {
    console.warn("❗ Audio too short, ignoring");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: "⚠️ Audio too short. Please speak longer.",
        sender: "assistant",
        timestamp: Date.now(),
        language: selectedLanguage,
      },
    ]);
    return;
  }

  const userMsg: Message = {
    id: Date.now().toString(),
    text: "🎤 Voice message",
    sender: "user",
    timestamp: Date.now(),
    language: selectedLanguage,
  };

  setMessages((prev) => [...prev, userMsg]);
  setAiTyping(true);

  try {
    const fd = new FormData();
    fd.append("audio", audioBlob); // MUST match backend: upload.single("audio")
    fd.append("language", selectedLanguage);

    const res = await axios.post(
      "https://linguaconnect-hackathon-1.onrender.com/api/audio/audio-chat",
      fd,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log("AI response from backend:", res.data);

    const replyText =
      res.data?.data?.botReplyTranslated ||
      res.data?.data?.botReplyOriginal ||
      "No reply received.";

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: replyText,
      sender: "assistant",
      timestamp: Date.now(),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, aiMsg]);
  } catch (err) {
    console.error("Audio send failed", err);

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 2).toString(),
        text: "Failed to get AI reply from audio.",
        sender: "assistant",
        timestamp: Date.now(),
        language: selectedLanguage,
      },
    ]);
  } finally {
    setAiTyping(false);
  }
};


  // -----------------------------
  // AUDIO RECORDING (hold-to-record)
  // -----------------------------
// AUDIO RECORDING (FIXED)
// -----------------------------
const startAudioRecording = async () => {
  try {
    if (!navigator.mediaDevices) {
      alert("Audio recording not supported");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm"
    });

    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

      console.log("🎤 Final audio blob size:", blob.size);

      await sendAudioToBackend(blob);

      stream.getTracks().forEach((t) => t.stop());
    };

    recorder.start();
    setRecordingAudio(true);

  } catch (err) {
    console.error("Failed to start recording", err);
  }
};

const stopAudioRecording = () => {
  if (mediaRecorderRef.current && recordingAudio) {
    mediaRecorderRef.current.stop();
    setRecordingAudio(false);
  }
};


  // -----------------------------
  // FILE UPLOAD (single handler)
  // -----------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: `📎 File uploaded: ${file.name}`,
      sender: "user",
      timestamp: Date.now(),
      language: selectedLanguage,
    };
    setMessages((prev) => {
      const next = [...prev, msg];
      writeStoredMessages(next);
      return next;
    });
  };

  // -----------------------------
  // SEND MESSAGE (only ONE sendMsg, async)
  // -----------------------------
  const sendMsg = async () => {
  if (!inputMessage.trim()) return;

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

  setMessages((prev) => {
    const next = [...prev, userMsg];
    writeStoredMessages(next);
    return next;
  });

  if (demoMode) {
    const newCount = demoCount + 1;
    setDemoCount(newCount);
    localStorage.setItem("demoCount", String(newCount));
  }

  setInputMessage("");
  setAiTyping(true);

  try {
    const res = await axios.post(
      "https://linguaconnect-hackathon-1.onrender.com/api/chatbot/reply",
      { question: userMsg.text }
    );

    const replyText =
      res.data?.data?.botReplyTranslated ||
      res.data?.data?.botReplyOriginal ||
      res.data?.reply ||
      "No reply received.";

    console.log("AI reply:", replyText);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: replyText,
      sender: "assistant",
      timestamp: Date.now(),
      language: selectedLanguage,
    };

    setMessages((prev) => {
      const next = [...prev, aiMsg];
      writeStoredMessages(next);
      return next;
    });
  } catch (err) {
    console.error("Text send failed", err);
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 2).toString(),
        text: "Failed to get AI reply.",
        sender: "assistant",
        timestamp: Date.now(),
        language: selectedLanguage,
      },
    ]);
  } finally {
    setAiTyping(false);
  }
};

  // auto-scroll to bottom when messages change or aiTyping toggles
  useEffect(() => {
    const container = messagesContainerRef.current;
    // small timeout so DOM updates finish
    if (container) {
      // scroll smoothly to bottom
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, aiTyping]);

  // -----------------------------
  // EXPORT / DOWNLOAD
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
    triggerDownload(
      new Blob([generateChatText()], { type: "text/plain" }),
      "chat.txt"
    );
  const downloadWORD = () =>
    triggerDownload(
      new Blob([generateChatText()], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }),
      "chat.docx"
    );
  const downloadPDF = () =>
    triggerDownload(
      new Blob([generateChatText()], { type: "application/pdf" }),
      "chat.pdf"
    );

  // -----------------------------
  // SHARE
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
  // Language filtering
  // -----------------------------
  const filteredLanguages =
    languageSearch.trim().length > 0
      ? languages.filter((l) =>
          l.name.toLowerCase().includes(languageSearch.toLowerCase())
        )
      : languages.slice(0, 40);

  const currentLang = languages.find((l) => l.code === selectedLanguage) || {
    code: selectedLanguage,
    name: selectedLanguage,
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="h-[calc(100vh-4rem)] flex relative">
      {/* DEMO LIMIT POPUP */}
      {demoLimitPopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-xl w-72 shadow-xl text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              Demo Limit Reached!
            </h2>
            <p className="text-gray-700 mb-4">
              You have used all 10 free messages. Please Login or Signup to
              continue chatting.
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

      {/* EXPORT POPUP */}
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

      {/* SHARE POPUP */}
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

      {/* LEFT CHAT AREA */}
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

          {/* LANGUAGE DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 items-center px-4 py-2 rounded-lg shadow-sm"
              >
                <Globe className="w-4 h-4" />
                {currentLang?.name}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-72 rounded-xl shadow-xl border bg-white p-0 dropdown-custom-surface">
              <div className="max-h-80 overflow-y-auto custom-scroll p-3">
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search language..."
                      className="w-full p-2 border rounded-md text-sm"
                      value={languageSearch}
                      onChange={(e) => setLanguageSearch(e.target.value)}
                    />
                    <Search className="absolute right-3 top-3 text-gray-500 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  {filteredLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      className="p-2 rounded-md cursor-pointer hover:bg-blue-50 transition-all"
                      onClick={() => setSelectedLanguage(lang.code)}
                    >
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#F5F6FA]">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  What’s on the agenda today?
                </h2>
                <p className="text-gray-500 mt-2">
                  Type a message below to begin the conversation.
                </p>
              </div>
            ) : (
              messages.map((m) => (
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
              ))
            )}

            {aiTyping && (
              <div className="flex">
                <div className="px-4 py-3 bg-white rounded-xl shadow border animate-pulse">
                  AI is typing…
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INPUT BAR */}
        <div className="border-t px-6 py-4 flex items-center gap-2 relative sticky bottom-0 bg-white z-10">
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
            disabled={demoMode && demoCount >= 10}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStickers(!showStickers)}
            disabled={demoMode && demoCount >= 10}
          >
            <Smile className="w-5 h-5" />
          </Button>

          {listening && (
            <div className="flex items-center gap-2 ml-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-70 animate-[pulseRing_1.4s_ease-out_infinite]"></div>
                <Mic className="w-5 h-5 text-red-600 relative z-10" />
              </div>
              <div className="flex items-end gap-[3px] h-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-red-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-sm text-red-500 font-medium">
                Listening…
              </span>
            </div>
          )}

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

          <Button
            variant="ghost"
            size="icon"
            onMouseDown={() => startAudioRecording()}
            onMouseUp={() => stopAudioRecording()}
            onClick={startVoice}
            className={recordingAudio || listening ? "text-red-500" : ""}
            disabled={demoMode && demoCount >= 10}
          >
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

      {/* RIGHT SIDEBAR */}
      <div className="w-80 bg-white border-l p-6">
        <h3 className="text-gray-900 mb-4">Conversation Details</h3>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="text-gray-600">Active Language</p>
            <p className="text-gray-900">{currentLang?.name}</p>
          </div>

          <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="text-gray-600">Status</p>
            <p className="text-gray-900">
              {aiTyping ? "AI Responding" : "Active"}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border rounded-xl">
            <p className="text-gray-600">Messages</p>
            <p className="text-gray-900">{messages.length}</p>
          </div>

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

export default ChatInterface;
