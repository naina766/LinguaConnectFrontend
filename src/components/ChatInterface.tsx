import { useState, useRef ,useEffect } from "react";
// import { jsPDF } from "jspdf";
// import { Document, Packer, Paragraph, TextRun } from "docx";


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
  const [selectedLanguage, setSelectedLanguage] = useState("en_XX");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [exportPopup, setExportPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [showStickers, setShowStickers] = useState(false);

  const stickerRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (stickerRef.current && !stickerRef.current.contains(e.target as Node)) {
        setShowStickers(false);
      }
    };

    if (showStickers) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStickers]);

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
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const SR = (window as any).webkitSpeechRecognition;
      const recog = new SR();

      recog.interimResults = true;
      recog.continuous = false;
      recog.lang = "en-US";

      recognitionRef.current = recog;
    }
  }, []);


  const startVoice = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      alert("Speech Recognition is not supported in your browser");
      return;
    }

    // Detect language for speech recognition
    const speechLang =
      selectedLanguage.startsWith("hin") ? "hi-IN" :
        selectedLanguage.startsWith("fra") ? "fr-FR" :
          selectedLanguage.startsWith("spa") ? "es-ES" :
            selectedLanguage.startsWith("deu") ? "de-DE" :
              selectedLanguage.startsWith("ita") ? "it-IT" :
                selectedLanguage.startsWith("jpn") ? "ja-JP" :
                  selectedLanguage.startsWith("kor") ? "ko-KR" :
                    selectedLanguage.startsWith("zho") ? "zh-CN" :
                      "en-US"; // default

    recognition.lang = speechLang;

    try {
      recognition.start();
      setListening(true);
    } catch (err) {
      console.log("Mic already active");
    }

    recognition.onresult = (e: any) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setInputMessage(text);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
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

    // --- Frontend only: show selected language ---
    console.log("User selected language:", selectedLanguage);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `AI Response in ${selectedLanguage}`,
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

  const downloadPDF = async () => {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF();
  const text = generateChatText();

  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 15, 15);
  doc.save("chat.pdf");
};


  const downloadWORD = async () => {
  const { Document, Packer, Paragraph, TextRun } = await import("docx");

  const chatText = generateChatText();

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: chatText.split("\n").map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line)],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "chat.docx";
  a.click();
};

  const triggerDownload = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
  };

  const endChat = () => {
    if (messages.length === 0) {
      // no messages, just clear
      setMessages([]);
      return;
    }

    const confirmEnd = window.confirm("Are you sure you want to end this chat?");
    if (confirmEnd) {
      setMessages([]);
    }
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
    // { code: "khk_Cyrl", name: "Halh Mongolian" },
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


  const currentLang = languages.find((l) => l.code === selectedLanguage);

  return (
    <div className="h-[calc(100vh-4rem)] flex relative">
      {/* ---------------- SHARE POPUP ---------------- */}
      {sharePopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-74 p-6 rounded-xl shadow-xl border">
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
              <Button variant="outline" className="flex gap-2 items-center px-4 py-2 rounded-lg shadow-sm">
                <Globe className="w-4 h-4" />
                {currentLang?.name || "Select Language"}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-72 rounded-xl shadow-xl border bg-white p-0 dropdown-custom-surface"
            >
              <div className="max-h-80 overflow-y-auto custom-scroll p-3">

                {/* Search */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search language..."
                    className="w-full p-2 border rounded-md text-sm"
                    value={languageSearch}
                    onChange={(e) => setLanguageSearch(e.target.value)}
                  />
                </div>

                {/* List */}
                <div className="space-y-1">
                  {languages
                    .filter((lang) =>
                      lang.name.toLowerCase().includes(languageSearch.toLowerCase())
                    )
                    .map((lang) => (
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
        {/* INPUT BAR (FIXED) */}


        <div className="border-t px-6 py-4 flex items-center gap-2 relative sticky bottom-0 bg-white z-10">
          {/* hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* ATTACHMENT BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-5 h-5" />
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
                  ></div>
                ))}
              </div>

              <span className="text-sm text-red-500 font-medium">Listening…</span>
            </div>
          )}
          {/* STICKER BUTTON */}
          {/* STICKER BUTTON */}


          {/* INPUT FIELD */}
          <Input
            className="flex-1"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            placeholder="Type your message..."
          />

          {/* MIC BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={startVoice}
            className={listening ? "text-red-500" : ""}
          >
            <Mic className="w-5 h-5" />
          </Button>

          {/* SEND BUTTON */}
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
              onClick={endChat}
            >
              End Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}