// // src/components/KnowledgeBase.tsx
// import { useState, useEffect } from "react";
// import {
//   Search,
//   ChevronRight,
//   Globe,
//   BookOpen,
//   CreditCard,
//   Wrench,
//   HelpCircle,
// } from "lucide-react";

// import { Input } from "./ui/input";
// import { Button } from "./ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";

// import { AuthModal } from "./AuthModal";
// import { ChatInterface } from "./ChatInterface";
// import axios from "axios";

// // -----------------------------------------
// // Multilingual FAQ structure
// // -----------------------------------------
// interface FaqItem {
//   id: string;
//   category: string;
//   translations: {
//     en?: { question: string; answer: string };
//     es?: { question: string; answer: string };
//     hi?: { question: string; answer: string };
//     fr?: { question: string; answer: string };
//     [key: string]: any;
//   };
// }

// // Used for static articles only
// interface Article {
//   id: string;
//   title: string;
//   content: string;
//   category: string;
// }

// const categoriesList = [
//   { id: "account", name: "Account", icon: HelpCircle },
//   { id: "billing", name: "Billing", icon: CreditCard },
//   { id: "troubleshooting", name: "Troubleshooting", icon: Wrench },
//   { id: "general", name: "General", icon: BookOpen },
// ];

// export function KnowledgeBase() {
//   const [selectedCategory, setSelectedCategory] = useState("account");
//   const [selectedLanguage, setSelectedLanguage] = useState("en");
//   const [searchQuery, setSearchQuery] = useState("");

//   const [dynamicFaq, setDynamicFaq] = useState<FaqItem[]>([]);

//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [showChat, setShowChat] = useState(false);

//   const isAuth = localStorage.getItem("isAuthenticated") === "true";

//   // -----------------------------------------
//   // Static Articles (unchanged)
//   // -----------------------------------------
//   const staticArticles: Article[] = [
//     {
//       id: "1",
//       title: "How do I create an account?",
//       content:
//         'To create an account, click the "Sign Up" button in the top right corner. Fill in your email, create a password, and verify your email address.',
//       category: "account",
//     },
//     {
//       id: "2",
//       title: "How do I reset my password?",
//       content:
//         'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a reset link.',
//       category: "account",
//     },
//     {
//       id: "3",
//       title: "Can I change my email address?",
//       content:
//         "Yes! Go to Settings > Account > Email Address and verify your new one.",
//       category: "account",
//     },
//     {
//       id: "4",
//       title: "What payment methods do you accept?",
//       content: "We accept Visa, MasterCard, PayPal, and enterprise bank transfers.",
//       category: "billing",
//     },
//     {
//       id: "5",
//       title: "How do I upgrade my plan?",
//       content:
//         'Navigate to Dashboard > Billing > Plans. Click "Upgrade" and select your plan.',
//       category: "billing",
//     },
//     {
//       id: "6",
//       title: "What is your refund policy?",
//       content: "We offer a 30-day money-back guarantee for all plans.",
//       category: "billing",
//     },
//     {
//       id: "7",
//       title: "Translation not working correctly",
//       content:
//         "Check selected languages, clear cache, verify system status page.",
//       category: "troubleshooting",
//     },
//     {
//       id: "8",
//       title: "Chat interface is slow",
//       content: "Disable browser extensions, try another browser or clear cache.",
//       category: "troubleshooting",
//     },
//     {
//       id: "9",
//       title: "Messages not sending",
//       content:
//         "Check your internet connection and reload the page. Verify account status.",
//       category: "troubleshooting",
//     },
//   ];

//   // -----------------------------------------
//   // Load dynamic multilingual FAQs
//   // -----------------------------------------
//   useEffect(() => {
//     let mounted = true;

//     const loadFaqs = async () => {
//       try {
//         const res = await axios.get("http://localhost:4001/api/faqs");
//         const data = res.data?.data || [];

//         if (!mounted) return;

//         const normalized = data.map((item: any, i: number) => ({
//           id: String(item.id ?? item._id ?? `faq-${i}-${Date.now()}`),
//           category:
//             item.category && categoriesList.some((c) => c.id === item.category)
//               ? item.category
//               : "general",

//           // Ensure translations exist
//           translations: item.translations
//             ? item.translations
//             : {
//                 en: {
//                   question:
//                     item.title || item.question || item.q || "Untitled FAQ",
//                   answer:
//                     item.content || item.answer || item.text || "No answer provided",
//                 },
//               },
//         }));

//         setDynamicFaq(normalized);

//         // save to localStorage for fallback
//         localStorage.setItem("faqs", JSON.stringify(normalized));
//         return;
//       } catch (err) {
//         console.warn("Backend failed, loading localStorage instead");
//       }

//       // LocalStorage fallback
//       try {
//         const raw = localStorage.getItem("faqs");
//         if (!raw) return setDynamicFaq([]);

//         const parsed = JSON.parse(raw);
//         const normalized = parsed.map((item: any, i: number) => ({
//           id: String(item.id ?? `local-${i}-${Date.now()}`),
//           category: item.category || "general",
//           translations: item.translations
//             ? item.translations
//             : {
//                 en: {
//                   question:
//                     item.title || item.question || item.q || "Untitled FAQ",
//                   answer:
//                     item.content || item.answer || item.text || "No answer provided",
//                 },
//               },
//         }));

//         setDynamicFaq(normalized);
//       } catch {
//         setDynamicFaq([]);
//       }
//     };

//     loadFaqs();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // -----------------------------------------
//   // Convert dynamic multilingual FAQ → Article[]
//   // for the UI list
//   // -----------------------------------------
//  // Remove FAQs with missing/blank questions or answers
// const multilingualDynamicArticles: Article[] = dynamicFaq
//   .map((faq) => {
//     const t =
//       faq.translations?.[selectedLanguage] ??
//       faq.translations?.en ??
//       { question: "", answer: "" };

//     return {
//       id: faq.id,
//       title: t.question?.trim() || "",
//       content: t.answer?.trim() || "",
//       category: faq.category,
//     };
//   })
//   .filter((a) => a.title !== "" && a.content !== "");


//   // -----------------------------------------
//   // Combine static + dynamic multilingual articles
//   // -----------------------------------------
//   const allArticles: Article[] = [...staticArticles, ...multilingualDynamicArticles];

//   const filteredArticles = allArticles.filter((article) => {
//     const matchCategory = article.category === selectedCategory;
//     const matchSearch =
//       searchQuery
//         ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           article.content.toLowerCase().includes(searchQuery.toLowerCase())
//         : true;

//     return matchCategory && matchSearch;
//   });

//   const languages = [
//     { code: "en", name: "English", flag: "🇬🇧" },
//     { code: "es", name: "Spanish", flag: "🇪🇸" },
//     { code: "hi", name: "Hindi", flag: "🇮🇳" },
//     { code: "fr", name: "French", flag: "🇫🇷" },
//   ];

//   const currentLanguage =
//     languages.find((l) => l.code === selectedLanguage) || languages[0];
//   const currentCategory =
//     categoriesList.find((c) => c.id === selectedCategory) || categoriesList[0];

//   // -----------------------------------------
//   // Chat handling
//   // -----------------------------------------
//   function handleStartChat() {
//     if (!isAuth) setShowAuthModal(true);
//     else setShowChat(true);
//   }

//   function handleAuthSuccess() {
//     localStorage.setItem("isAuthenticated", "true");
//     setShowAuthModal(false);
//     setShowChat(true);
//   }

//   // -----------------------------------------
//   // UI Rendering
//   // -----------------------------------------
//   return (
//     <div className="min-h-[calc(100vh-4rem)]">
//       {showChat && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
//           <div className="bg-white rounded-xl shadow-2xl p-4 max-w-3xl w-full">
//             <Button
//               className="ml-auto mb-2 bg-red-500 hover:bg-red-600 text-white"
//               onClick={() => setShowChat(false)}
//             >
//               Close Chat
//             </Button>
//             <ChatInterface />
//           </div>
//         </div>
//       )}

//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => setShowAuthModal(false)}
//         initialMode="login"
//         onSuccess={handleAuthSuccess}
//       />

//       {/* HEADER */}
//       <div className="bg-gradient-to-br from-[#007BFF] to-[#00B5AD] text-white py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="mb-2">Knowledge Base</h1>
//               <p className="text-blue-100">
//                 Find answers to common questions in your preferred language
//               </p>
//             </div>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="bg-white/10 border-white/20 text-white hover:bg-white/20"
//                 >
//                   <Globe className="w-4 h-4 mr-2" />
//                   <span>{currentLanguage.flag}</span>
//                   <span className="ml-1">{currentLanguage.name}</span>
//                 </Button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent align="end" className="w-48">
//                 {languages.map((lang) => (
//                   <DropdownMenuItem
//                     key={lang.code}
//                     onClick={() => setSelectedLanguage(lang.code)}
//                     className="flex items-center gap-2"
//                   >
//                     <span>{lang.flag}</span>
//                     <span>{lang.name}</span>
//                     {selectedLanguage === lang.code && (
//                       <span className="ml-auto text-[#007BFF]">✓</span>
//                     )}
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="relative max-w-2xl">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//             <Input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search for answers..."
//               className="pl-12 py-6 bg-white border-0 focus-visible:ring-2 focus-visible:ring-white/50"
//             />
//           </div>
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="flex gap-8">
//           {/* SIDEBAR */}
//           <div className="w-64 flex-shrink-0">
//             <div className="bg-white rounded-xl border p-4 sticky top-20">
//               <h3 className="text-gray-900 mb-4">Categories</h3>

//               <nav className="space-y-1">
//                 {categoriesList.map((cat) => {
//                   const Icon = cat.icon;
//                   return (
//                     <button
//                       key={cat.id}
//                       onClick={() => setSelectedCategory(cat.id)}
//                       className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//                         selectedCategory === cat.id
//                           ? "bg-blue-50 text-[#007BFF]"
//                           : "text-gray-600 hover:bg-gray-50"
//                       }`}
//                     >
//                       <Icon className="w-5 h-5" />
//                       <span>{cat.name}</span>
//                       <ChevronRight className="w-4 h-4 ml-auto" />
//                     </button>
//                   );
//                 })}
//               </nav>

//               <div className="mt-6 pt-6 border-t">
//                 <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border">
//                   <BookOpen className="w-8 h-8 text-[#007BFF] mb-2" />
//                   <p className="text-gray-900 mb-1">Need more help?</p>
//                   <p className="text-gray-600 mb-3">
//                     Chat with our AI assistant
//                   </p>

//                   <Button
//                     className="w-full bg-[#007BFF] hover:bg-[#0056b3]"
//                     onClick={handleStartChat}
//                   >
//                     Start Chat
//                   </Button>

//                   {!isAuth && (
//                     <p className="text-xs text-red-500 text-center mt-2">
//                       Login required to chat
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ARTICLES */}
//           <div className="flex-1">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-gray-900">{currentCategory.name}</h2>
//               <div className="flex items-center gap-2 text-gray-600">
//                 <BookOpen className="w-5 h-5" />
//                 <span>{filteredArticles.length} articles</span>
//               </div>
//             </div>

//             {/* MULTILINGUAL ARTICLES */}
//             <div className="space-y-4">
//               {filteredArticles.map((a, index) => (
//                 <div
//                   key={a.id}
//                   className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
//                 >
//                   <div className="inline-flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full mb-3"></div>

//                   <h3 className="text-gray-900 mb-2 text-lg font-semibold">
//                     {a.title}
//                   </h3>

//                   <p className="text-gray-600 mb-4 whitespace-pre-line">
//                     {a.content}
//                   </p>

//                   <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
//                     <span className="text-[#007BFF]">
//                       Translated to {currentLanguage.name}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {filteredArticles.length === 0 && (
//               <div className="text-center py-16">
//                 <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-gray-900 mb-2">No articles found</h3>
//                 <p className="text-gray-600">
//                   Try adjusting your search or category
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default KnowledgeBase;


// src/components/KnowledgeBase.tsx
import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Globe,
  BookOpen,
  CreditCard,
  Wrench,
  HelpCircle,
} from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { AuthModal } from "./AuthModal";
import { ChatInterface } from "./ChatInterface";

// -----------------------------------------
// Multilingual FAQ structure
// -----------------------------------------
interface FaqItem {
  id: string;
  category: string;
  translations: {
    en?: { question: string; answer: string };
    hi?: { question: string; answer: string };
    es?: { question: string; answer: string };
    fr?: { question: string; answer: string };
    [key: string]: any;
  };
}

// Used for static articles only
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
}

const categoriesList = [
  { id: "account", name: "Account", icon: HelpCircle },
  { id: "billing", name: "Billing", icon: CreditCard },
  { id: "troubleshooting", name: "Troubleshooting", icon: Wrench },
  { id: "general", name: "General", icon: BookOpen },
];

export function KnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState("account");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [searchQuery, setSearchQuery] = useState("");

  const [dynamicFaq, setDynamicFaq] = useState<FaqItem[]>([]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const isAuth = localStorage.getItem("isAuthenticated") === "true";

  // -----------------------------------------
  // Load dynamic multilingual FAQs
  // -----------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadFaqs = async () => {
      try {
        const raw = localStorage.getItem("faqs");
        if (!raw) return setDynamicFaq([]);

        const parsed = JSON.parse(raw);

        const normalized = parsed.map((item: any, i: number) => ({
          id: String(item.id ?? item._id ?? `faq-${i}-${Date.now()}`),
          category:
            item.category && categoriesList.some((c) => c.id === item.category)
              ? item.category
              : "general",

          // FIXED MULTILINGUAL HANDLING ↓↓↓
          translations: {
            en: item.translations?.en ?? {
              question:
                item.title || item.question || item.q || "Untitled FAQ",
              answer:
                item.content || item.answer || item.text || "No answer provided",
            },
            hi: item.translations?.hi ?? { question: "", answer: "" },
            es: item.translations?.es ?? { question: "", answer: "" },
            fr: item.translations?.fr ?? { question: "", answer: "" },
          },
        }));

        if (!mounted) return;
        setDynamicFaq(normalized);
      } catch (err) {
        console.warn("LocalStorage parse failed", err);
        setDynamicFaq([]);
      }
    };

    loadFaqs();
    return () => {
      mounted = false;
    };
  }, []);

    // -----------------------------------------
  // Convert dynamic multilingual FAQ → Article[]
  // -----------------------------------------
  const multilingualDynamicArticles: Article[] = dynamicFaq
    .map((faq) => {
      // FIXED: Proper language switching
      const t =
        faq.translations?.[selectedLanguage] ??
        faq.translations?.en ?? // fallback
        { question: "", answer: "" };

      return {
        id: faq.id,
        title: t.question?.trim() || "",
        content: t.answer?.trim() || "",
        category: faq.category,
      };
    })
    .filter((a) => a.title !== "" && a.content !== "");

  // -----------------------------------------
  // Static default articles (unchanged)
  // -----------------------------------------
  const staticArticles: Article[] = [
    {
      id: "1",
      title: "How do I create an account?",
      content:
        'To create an account, click the "Sign Up" button in the top right corner. Fill in your email, create a password, and verify your email address.',
      category: "account",
    },
    {
      id: "2",
      title: "How do I reset my password?",
      content:
        'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a reset link.',
      category: "account",
    },
    {
      id: "3",
      title: "Can I change my email address?",
      content:
        "Yes! Go to Settings > Account > Email Address and verify your new one.",
      category: "account",
    },
    {
      id: "4",
      title: "What payment methods do you accept?",
      content: "We accept Visa, MasterCard, PayPal, and enterprise bank transfers.",
      category: "billing",
    },
    {
      id: "5",
      title: "How do I upgrade my plan?",
      content:
        'Navigate to Dashboard > Billing > Plans. Click "Upgrade" and select your plan.',
      category: "billing",
    },
    {
      id: "6",
      title: "What is your refund policy?",
      content: "We offer a 30-day money-back guarantee for all plans.",
      category: "billing",
    },
    {
      id: "7",
      title: "Translation not working correctly",
      content:
        "Check selected languages, clear cache, verify system status page.",
      category: "troubleshooting",
    },
    {
      id: "8",
      title: "Chat interface is slow",
      content: "Disable browser extensions, try another browser or clear cache.",
      category: "troubleshooting",
    },
    {
      id: "9",
      title: "Messages not sending",
      content:
        "Check your internet connection and reload the page. Verify account status.",
      category: "troubleshooting",
    },
  ];

  // -----------------------------------------
  // Combine static + dynamic multilingual articles
  // -----------------------------------------
  const allArticles: Article[] = [...staticArticles, ...multilingualDynamicArticles];

  const filteredArticles = allArticles.filter((article) => {
    const matchCategory = article.category === selectedCategory;
    const matchSearch =
      searchQuery
        ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

    return matchCategory && matchSearch;
  });

  // -----------------------------------------
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "fr", name: "French", flag: "🇫🇷" },
  ];

  const currentLanguage =
    languages.find((l) => l.code === selectedLanguage) || languages[0];
  const currentCategory =
    categoriesList.find((c) => c.id === selectedCategory) || categoriesList[0];

  // -----------------------------------------
  // Chat handling
  // -----------------------------------------
  function handleStartChat() {
    if (!isAuth) setShowAuthModal(true);
    else setShowChat(true);
  }

  function handleAuthSuccess() {
    localStorage.setItem("isAuthenticated", "true");
    setShowAuthModal(false);
    setShowChat(true);
  }

  // -----------------------------------------
  // UI Rendering
  // -----------------------------------------
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-2xl p-4 max-w-3xl w-full">
            <Button
              className="ml-auto mb-2 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setShowChat(false)}
            >
              Close Chat
            </Button>
            <ChatInterface />
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
        onSuccess={handleAuthSuccess}
      />

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#00B5AD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="mb-2">Knowledge Base</h1>
              <p className="text-blue-100">
                Find answers to common questions in your preferred language
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{currentLanguage.flag}</span>
                  <span className="ml-1">{currentLanguage.name}</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className="flex items-center gap-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {selectedLanguage === lang.code && (
                      <span className="ml-auto text-[#007BFF]">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="pl-12 py-6 bg-white border-0 focus-visible:ring-2 focus-visible:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* SIDEBAR */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-20">
              <h3 className="text-gray-900 mb-4">Categories</h3>

              <nav className="space-y-1">
                {categoriesList.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-blue-50 text-[#007BFF]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{cat.name}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border">
                  <BookOpen className="w-8 h-8 text-[#007BFF] mb-2" />
                  <p className="text-gray-900 mb-1">Need more help?</p>
                  <p className="text-gray-600 mb-3">
                    Chat with our AI assistant
                  </p>

                  <Button
                    className="w-full bg-[#007BFF] hover:bg-[#0056b3]"
                    onClick={handleStartChat}
                  >
                    Start Chat
                  </Button>

                  {!isAuth && (
                    <p className="text-xs text-red-500 text-center mt-2">
                      Login required to chat
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ARTICLES */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">{currentCategory.name}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <span>{filteredArticles.length} articles</span>
              </div>
            </div>

            {/* SHOW ARTICLES */}
            <div className="space-y-4">
              {filteredArticles.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-gray-900 mb-2 text-lg font-semibold">
                    {a.title}
                  </h3>

                  <p className="text-gray-600 mb-4 whitespace-pre-line">
                    {a.content}
                  </p>

                  <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-[#007BFF]">
                      Showing in {currentLanguage.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KnowledgeBase;
