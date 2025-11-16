// // src/components/AdminDashboard.tsx
// import axios from "axios";
// import { useState, useEffect, useRef, useMemo } from "react";
// import {
//   MessageSquare,
//   Globe,
//   Users,
//   TrendingUp,
//   Download,
//   Plus,
//   Upload,
//   FileText,
//   BarChart3,
//   X as XIcon,
// } from "lucide-react";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";

// import api from "../api/axiosInstance.ts";

// // ---------- constants ----------
// const timeRanges = ["24h", "7d", "30d", "90d"] as const;
// const ROWS_PER_PAGE = 12;

// // ---------- types ----------
// interface Stats {
//   totalConversations: { value: number; change: number };
//   activeUsers: { value: number; change: number };
//   topLanguagesUsed: { value: number; change: number };
//   avgResponseTime: { value: number; change: number };
//   conversationsByLanguage: { language: string; count: number; fill?: string }[];
//   languageDistribution: { name: string; value: number; color: string }[];
//   weeklyStats: { day: string; conversations: number; translations: number }[];
//   messages: any[];
// }

// // ---------- component ----------
// export function AdminDashboard() {
//   const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
//   if (!isAuthenticated) {
//     window.location.href = "/";
//     return null;
//   }

//   const [messages, setMessages] = useState<any[]>([]);
//   const [languages, setLanguages] = useState<string[]>([]);
//   const [faqs, setFaqs] = useState<any[]>([]);
//   const [timeRange, setTimeRange] =
//     useState<(typeof timeRanges)[number]>("24h");
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [reportsOpen, setReportsOpen] = useState(false);
//   const [reportSearch, setReportSearch] = useState("");
//   const [reportLanguageFilter, setReportLanguageFilter] = useState<string>("");
//   const [reportPage, setReportPage] = useState(1);

//   const [addLangOpen, setAddLangOpen] = useState(false);
//   const [faqFile, setFaqFile] = useState<File | null>(null);
//   const [newLangName, setNewLangName] = useState("");
//   const [newLangCode, setNewLangCode] = useState("");

//   const [userCount, setUserCount] = useState<number>(0);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const fetchStats = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/admin/stats?period=${timeRange}`);
//       const d = res.data?.data || null;
//       setStats(d);
//       setMessages(d?.messages || []);
//       if (d?.activeUsers?.value != null) setUserCount(d.activeUsers.value);
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLanguages = async () => {
//     try {
//       const res = await api.get("/api/admin/stats/languages");
//       const langs = res.data?.data || [];
//       setLanguages(langs.map((l: any) => l.code));
//     } catch (err) {
//       console.error("Error fetching languages:", err);
//     }
//   };

//   const fetchFaqs = async () => {
//     try {
//       const res = await axios.get("http://localhost:4001/api/faqs");
//       setFaqs(res.data?.data || []);
//     } catch (err) {
//       console.error("Error fetching faqs:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, [timeRange]);

//   useEffect(() => {
//     fetchLanguages();
//     fetchFaqs();
//   }, []);

//   const filteredMessages = useMemo(() => {
//     let list = messages || [];
//     if (reportLanguageFilter) {
//       list = list.filter((m) => m.language === reportLanguageFilter);
//     }
//     if (reportSearch?.trim()) {
//       const q = reportSearch.trim().toLowerCase();
//       list = list.filter(
//         (m: any) =>
//           (m.text || "").toLowerCase().includes(q) ||
//           (m.sender || "").toLowerCase().includes(q) ||
//           (m.language || "").toLowerCase().includes(q)
//       );
//     }
//     return list;
//   }, [messages, reportLanguageFilter, reportSearch]);

//   const modalFilteredMessages = filteredMessages.slice(
//     (reportPage - 1) * ROWS_PER_PAGE,
//     reportPage * ROWS_PER_PAGE
//   );

//   const pageCount = Math.max(
//     1,
//     Math.ceil(filteredMessages.length / ROWS_PER_PAGE)
//   );

//   const downloadJSON = (data: any, filename = "report.json") => {
//     const blob = new Blob([JSON.stringify(data, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const downloadCSV = (data: any[], filename = "report.csv") => {
//     if (!data || data.length === 0) {
//       alert("No data to export");
//       return;
//     }
//     const headers = Object.keys(data[0] || {});
//     const csv = [
//       headers.join(","),
//       ...data.map((row) =>
//         headers.map((h) => `"${(row as any)[h] || ""}"`).join(",")
//       ),
//     ].join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const onFaqFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFaqFile(e.target.files[0]);
//     }
//   };

//   const handleUploadFAQs = async () => {
//     if (!faqFile) return;

//     const reader = new FileReader();
//     reader.onload = async () => {
//       try {
//         const faqsJson = JSON.parse(reader.result as string);

//         const res = await api.post("/api/admin/upload-faqs", {
//           faqs: faqsJson,
//         });

//         alert(res.data?.message || "Uploaded FAQs");

//         fetchFaqs();
//         setFaqFile(null);
//       } catch (err) {
//         console.error(err);
//         alert("Failed to upload FAQs");
//       }
//     };

//     reader.readAsText(faqFile);
//   };

//   const simulateConversation = () => {
//     if (!languages.length) return alert("No languages available.");
//     const ts = Date.now();
//     const newMsgs = [
//       {
//         id: `m-${ts}-1`,
//         timestamp: ts - 60000,
//         sender: "user",
//         language: languages[0],
//         text: "Demo: Hello there",
//       },
//       {
//         id: `m-${ts}-2`,
//         timestamp: ts - 58000,
//         sender: "assistant",
//         language: languages[0],
//         text: "Demo: Hi, how can I help?",
//       },
//     ];
//     setMessages((prev) => [...prev, ...newMsgs]);
//     alert("Demo conversation added.");
//   };

//   const clearMessages = () => {
//     setMessages([]);
//     alert("All messages cleared.");
//   };

//   const handleAddLanguage = async () => {
//     const code = newLangCode.trim().toLowerCase();
//     const name = newLangName.trim();

//     if (!name) return alert("Please enter a language name");
//     if (!code) return alert("Please enter a language code");

//     try {
//       const res = await api.post("/api/admin/add-language", { code, name });

//       alert(res.data?.message || "Language added");

//       setNewLangName("");
//       setNewLangCode("");
//       setAddLangOpen(false);

//       fetchLanguages();
//       fetchStats();
//     } catch (err: any) {
//       console.error(err);
//       alert(err?.response?.data?.message || "Failed to add language");
//     }
//   };

//   const exportFullReport = (format: "json" | "csv") => {
//     if (!stats) return alert("No stats available");

//     if (format === "json") {
//       downloadJSON(stats, "dashboard_report.json");
//     } else {
//       const data = stats.languageDistribution || [];
//       downloadCSV(data, "dashboard_report.csv");
//     }
//   };

//   const totalConversations = stats?.totalConversations?.value || 0;
//   const activeUsers = stats?.activeUsers?.value || 0;
//   const topLanguages = stats?.topLanguagesUsed?.value || 0;
//   const avgResponseTime = stats?.avgResponseTime?.value || 0;
//   const conversationsByLanguage = stats?.conversationsByLanguage || [];
//   const languageDistribution = stats?.languageDistribution || [];
//   const weeklyStats = stats?.weeklyStats || [];

//   const languageCounts: Record<string, number> = {};
//   messages.forEach((m) => {
//     if (!m?.language) return;
//     languageCounts[m.language] = (languageCounts[m.language] || 0) + 1;
//   });

//   // ---------------------- FIXED FUNCTION (Missing One) ----------------------
//   const downloadObjectAsJson = (data: any, filename = "admin-data.json") => {
//     const blob = new Blob([JSON.stringify(data, null, 2)], {
//       type: "application/json",
//     });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();
//     URL.revokeObjectURL(url);
//   };
//   // -------------------------------------------------------------------------

//   return (
//     <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA] p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
//             <p className="text-gray-600">
//               Monitor and manage your multilingual support platform
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {/* Time Range */}
//             <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-lg">
//               {timeRanges.map((r) => (
//                 <button
//                   key={r}
//                   onClick={() => setTimeRange(r)}
//                   className={`px-4 py-2 rounded-md ${
//                     timeRange === r
//                       ? "bg-[#007BFF] text-white"
//                       : "text-gray-600 hover:bg-gray-50"
//                   }`}
//                 >
//                   {r}
//                 </button>
//               ))}
//             </div>

//             {/* Export Buttons */}
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2"
//                 onClick={() => exportFullReport("json")}
//               >
//                 <Download className="w-4 h-4" /> Export JSON
//               </Button>

//               <Button
//                 variant="outline"
//                 className="flex items-center gap-2"
//                 onClick={() => exportFullReport("csv")}
//               >
//                 <Download className="w-4 h-4" /> Export CSV
//               </Button>

//               <Button
//                 variant="ghost"
//                 className="flex items-center gap-2"
//                 onClick={() => {
//                   setReportsOpen(true);
//                   setReportSearch("");
//                   setReportLanguageFilter("");
//                   setReportPage(1);
//                 }}
//               >
//                 <FileText className="w-4 h-4" /> View Reports
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {[
//             {
//               title: "Total Conversations",
//               value: totalConversations,
//               icon: MessageSquare,
//               color: "from-blue-500 to-blue-600",
//               change: "+12.5%",
//             },
//             {
//               title: "Active Users",
//               value: activeUsers,
//               icon: Users,
//               color: "from-green-500 to-green-600",
//               change: "+8.2%",
//             },
//             {
//               title: "Top Languages Used",
//               value: topLanguages,
//               icon: Globe,
//               color: "from-purple-500 to-purple-600",
//               change: "+3",
//             },
//             {
//               title: "Avg Response Time",
//               value: avgResponseTime,
//               icon: TrendingUp,
//               color: "from-orange-500 to-orange-600",
//               change: "-0.3s",
//             },
//           ].map((stat, idx) => {
//             const Icon = stat.icon;
//             return (
//               <Card key={idx} className="border-0 shadow-sm">
//                 <CardContent className="p-6">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-gray-600 mb-1">{stat.title}</p>
//                       <h2 className="text-gray-900 mb-1">{stat.value}</h2>
//                       <div className="flex items-center gap-1 text-green-600">
//                         <TrendingUp className="w-4 h-4" /> {stat.change}
//                       </div>
//                     </div>

//                     <div
//                       className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
//                     >
//                       <Icon className="w-6 h-6 text-white" />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* Add Language */}
//           <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-blue-50 to-white">
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="w-12 h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
//                 <Plus className="text-white w-6 h-6" />
//               </div>

//               <div>
//                 <h3 className="text-gray-900 mb-1">Add Language</h3>
//                 <p className="text-gray-600">Enable new language support</p>
//                 <div className="mt-3">
//                   <Button size="sm" onClick={() => setAddLangOpen(true)}>
//                     Add
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Upload FAQs */}
//           <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-green-50 to-white">
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
//                 <Upload className="text-white w-6 h-6" />
//               </div>

//               <div>
//                 <h3 className="text-gray-900 mb-1">Upload FAQs</h3>
//                 <p className="text-gray-600">Add knowledge base content</p>

//                 <div className="mt-3">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".json,.txt"
//                     className="hidden"
//                     onChange={(e) => {
//                       onFaqFileChange(e);
//                       handleUploadFAQs();
//                     }}
//                   />

//                   <Button size="sm" onClick={() => fileInputRef.current?.click()}>
//                     Upload
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* View Reports */}
//           <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-purple-50 to-white">
//             <CardContent className="p-6 flex items-center gap-4">
//               <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
//                 <FileText className="text-white w-6 h-6" />
//               </div>

//               <div>
//                 <h3 className="text-gray-900 mb-1">View Reports</h3>
//                 <p className="text-gray-600">Detailed analytics & insights</p>

//                 <div className="mt-3 flex gap-2">
//                   <Button
//                     size="sm"
//                     onClick={() => {
//                       setReportsOpen(true);
//                       setReportSearch("");
//                       setReportLanguageFilter("");
//                       setReportPage(1);
//                     }}
//                   >
//                     Open
//                   </Button>

//                   <Button size="sm" variant="outline" onClick={clearMessages}>
//                     Clear Messages
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Add Language Modal */}
//         {addLangOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
//             <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
//               <div className="p-4 border-b flex items-center justify-between">
//                 <h3 className="text-lg font-semibold">Add Language</h3>

//                 <button
//                   onClick={() => setAddLangOpen(false)}
//                   className="p-2 rounded hover:bg-gray-100"
//                 >
//                   <XIcon />
//                 </button>
//               </div>

//               <div className="p-4">
//                 <label className="block text-sm text-gray-600 mb-2">
//                   Language name
//                 </label>

//                 <input
//                   value={newLangName}
//                   onChange={(e) => setNewLangName(e.target.value)}
//                   className="w-full border rounded px-3 py-2 mb-3"
//                   placeholder="e.g. Japanese"
//                 />

//                 <label className="block text-sm text-gray-600 mb-2">
//                   Language code
//                 </label>

//                 <input
//                   value={newLangCode}
//                   onChange={(e) => setNewLangCode(e.target.value)}
//                   className="w-full border rounded px-3 py-2"
//                   placeholder="e.g. ja"
//                 />
//               </div>

//               <div className="p-4 flex items-center justify-end gap-2 border-t">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => setAddLangOpen(false)}
//                 >
//                   Cancel
//                 </Button>

//                 <Button size="sm" onClick={handleAddLanguage}>
//                   Add
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <Card className="lg:col-span-2 shadow-sm border-0">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BarChart3 className="text-[#007BFF] w-5 h-5" />
//                 Conversations by Language
//               </CardTitle>
//             </CardHeader>

//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={conversationsByLanguage}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                   <XAxis dataKey="language" stroke="#94a3b8" />
//                   <YAxis stroke="#94a3b8" />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#007BFF" radius={[8, 8, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>

//           <Card className="shadow-sm border-0">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Globe className="text-[#00B5AD] w-5 h-5" />
//                 Distribution
//               </CardTitle>
//             </CardHeader>

//             <CardContent>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={languageDistribution}
//                     innerRadius={55}
//                     outerRadius={90}
//                     dataKey="value"
//                   >
//                     {languageDistribution.map((entry, i) => (
//                       <Cell key={i} fill={entry.color} />
//                     ))}
//                   </Pie>
//                 </PieChart>
//               </ResponsiveContainer>

//               <div className="mt-4 space-y-2">
//                 {languageDistribution.map((item, i) => (
//                   <div key={i} className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: item.color }}
//                       />
//                       <span className="text-gray-600">{item.name}</span>
//                     </div>

//                     <span className="text-gray-900">{item.value}%</span>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Weekly Chart */}
//         <Card className="shadow-sm border-0 mb-8">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <TrendingUp className="w-5 h-5 text-[#007BFF]" />
//               Weekly Activity
//             </CardTitle>
//           </CardHeader>

//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={weeklyStats}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                 <XAxis dataKey="day" stroke="#94a3b8" />
//                 <YAxis stroke="#94a3b8" />
//                 <Tooltip />

//                 <Line
//                   type="monotone"
//                   dataKey="conversations"
//                   stroke="#007BFF"
//                   strokeWidth={3}
//                 />

//                 <Line
//                   type="monotone"
//                   dataKey="translations"
//                   stroke="#00B5AD"
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>

//             <div className="mt-4 flex flex-wrap items-center gap-3">
//               <Button size="sm" onClick={simulateConversation}>
//                 Simulate Conversation
//               </Button>

//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={() =>
//                   downloadObjectAsJson(
//                     { messages, languages, faqs },
//                     "admin-data.json"
//                   )
//                 }
//               >
//                 Download Data
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Reports Modal */}
//       {reportsOpen && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
//           <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl overflow-hidden">
//             <div className="flex items-center justify-between p-4 border-b">
//               <div>
//                 <h3 className="text-lg font-semibold">Reports</h3>
//                 <p className="text-sm text-gray-500">
//                   Dynamic analytics & message explorer
//                 </p>
//               </div>

//               <button
//                 onClick={() => {
//                   setReportsOpen(false);
//                   setReportPage(1);
//                 }}
//                 className="p-2 rounded hover:bg-gray-100"
//               >
//                 <XIcon />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
//               {/* Summary Panel */}
//               <div className="lg:col-span-1 space-y-3">
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="text-sm text-gray-600">Summary</h4>
//                   <div className="mt-2 text-gray-900">
//                     Total messages:
//                     <span className="font-medium ml-1">
//                       {filteredMessages.length}
//                     </span>
//                   </div>

//                   <div className="text-gray-900">
//                     Filtered:
//                     <span className="font-medium ml-1">
//                       {modalFilteredMessages.length}
//                     </span>
//                   </div>

//                   <div className="text-gray-900">
//                     Active users:
//                     <span className="font-medium ml-1">{activeUsers}</span>
//                   </div>

//                   <div className="text-gray-900">
//                     Avg response:
//                     <span className="font-medium ml-1">
//                       {avgResponseTime}s
//                     </span>
//                   </div>
//                 </div>

//                 {/* Language Stats Panel */}
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="text-sm text-gray-600 mb-2">Top Languages</h4>

//                   <div className="space-y-2">
//                     {Object.keys(languageCounts).map((l) => (
//                       <div
//                         key={l}
//                         className="flex items-center justify-between text-sm text-gray-700"
//                       >
//                         <div>{l}</div>
//                         <div>{languageCounts[l]}</div>
//                       </div>
//                     ))}

//                     {/* Empty state */}
//                     {Object.keys(languageCounts).length === 0 &&
//                       languages.map((l: any) => (
//                         <div
//                           key={l}
//                           className="flex items-center justify-between text-sm text-gray-700"
//                         >
//                           <div>{l}</div>
//                           <div>0</div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="bg-gray-50 p-4 rounded">
//                   <h4 className="text-sm text-gray-600 mb-2">Quick actions</h4>

//                   <div className="flex flex-col gap-2">
//                     <Button
//                       size="sm"
//                       onClick={() => downloadJSON(stats, "full-report.json")}
//                     >
//                       Download report (JSON)
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => downloadCSV(messages, "full-report.csv")}
//                     >
//                       Download report (CSV)
//                     </Button>

//                     <Button size="sm" onClick={simulateConversation}>
//                       Simulate conversation
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={clearMessages}
//                     >
//                       Clear messages
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               {/* Messages Table */}
//               <div className="lg:col-span-2">
//                 <div className="mb-2 flex items-center justify-between">
//                   <div className="text-sm text-gray-600">
//                     Showing {modalFilteredMessages.length} messages — page{" "}
//                     {reportPage} / {pageCount}
//                   </div>
//                 </div>

//                 <div className="overflow-auto bg-white rounded shadow">
//                   <table className="min-w-full text-left">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-sm text-gray-600">
//                           Time
//                         </th>
//                         <th className="px-3 py-2 text-sm text-gray-600">
//                           Sender
//                         </th>
//                         <th className="px-3 py-2 text-sm text-gray-600">
//                           Language
//                         </th>
//                         <th className="px-3 py-2 text-sm text-gray-600">
//                           Message
//                         </th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {modalFilteredMessages.length === 0 && (
//                         <tr>
//                           <td
//                             colSpan={4}
//                             className="px-3 py-6 text-center text-sm text-gray-500"
//                           >
//                             No messages found
//                           </td>
//                         </tr>
//                       )}

//                       {modalFilteredMessages.map((m: any) => (
//                         <tr
//                           key={m.id || `${m.timestamp}-${Math.random()}`}
//                           className="border-t"
//                         >
//                           <td className="px-3 py-3 text-sm text-gray-700">
//                             {new Date(m.timestamp || 0).toLocaleString()}
//                           </td>

//                           <td className="px-3 py-3 text-sm text-gray-700">
//                             {m.sender}
//                           </td>

//                           <td className="px-3 py-3 text-sm text-gray-700">
//                             {m.language || "Unknown"}
//                           </td>

//                           <td className="px-3 py-3 text-sm text-gray-700 whitespace-pre-wrap">
//                             {m.text}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="mt-3 flex items-center justify-between">
//                   <div className="text-sm text-gray-600">
//                     Page {reportPage} of {pageCount}
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() => setReportPage((p) => Math.max(1, p - 1))}
//                     >
//                       Prev
//                     </Button>

//                     <Button
//                       size="sm"
//                       onClick={() =>
//                         setReportPage((p) => Math.min(pageCount, p + 1))
//                       }
//                     >
//                       Next
//                     </Button>

//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => {
//                         setReportPage(1);
//                         setReportSearch("");
//                         setReportLanguageFilter("");
//                       }}
//                     >
//                       Reset
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex items-center justify-between p-4 border-t">
//               <div className="text-sm text-gray-600">
//                 Generated at: {new Date().toLocaleString()}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() =>
//                     downloadJSON(modalFilteredMessages, "filtered.json")
//                   }
//                 >
//                   JSON
//                 </Button>

//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() =>
//                     downloadCSV(modalFilteredMessages, "filtered.csv")
//                   }
//                 >
//                   CSV
//                 </Button>

//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     setReportsOpen(false);
//                     setReportPage(1);
//                   }}
//                 >
//                   Close
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;

// src/components/AdminDashboard.tsx
import axios from "axios";
import { useState, useEffect, useRef, useMemo } from "react";
import {
  MessageSquare,
  Globe,
  Users,
  TrendingUp,
  Download,
  Plus,
  Upload,
  FileText,
  BarChart3,
  X as XIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import api from "../api/axiosInstance.ts";

// ---------- constants ----------
const timeRanges = ["24h", "7d", "30d", "90d"] as const;
const ROWS_PER_PAGE = 12;
const FAQ_STORAGE_KEY = "faqs";

// ---------- types ----------
interface Stats {
  totalConversations: { value: number; change: number } | any;
  activeUsers: { value: number; change: number } | any;
  topLanguagesUsed: { value: number; change: number } | any;
  avgResponseTime: { value: number; change: number } | any;
  conversationsByLanguage: { language: string; count: number; fill?: string }[];
  languageDistribution: { name: string; value: number; color: string }[];
  weeklyStats: { day: string; conversations: number; translations: number }[];
  messages: any[];
}

interface FaqItem {
  id?: string | number;
  title?: string;
  content?: string;
  text?: string;
  category?: string;
}

// ---------- component ----------
export function AdminDashboard() {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  const [messages, setMessages] = useState<any[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [timeRange, setTimeRange] =
    useState<(typeof timeRanges)[number]>("24h");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const [reportsOpen, setReportsOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [reportLanguageFilter, setReportLanguageFilter] = useState<string>("");
  const [reportPage, setReportPage] = useState(1);

  const [addLangOpen, setAddLangOpen] = useState(false);
  const [faqFile, setFaqFile] = useState<File | null>(null);
  const [newLangName, setNewLangName] = useState("");
  const [newLangCode, setNewLangCode] = useState("");

  const [userCount, setUserCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- new states for manual FAQ ----
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newFaqCategory, setNewFaqCategory] = useState("general");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const categories = [
    { id: "general", name: "General" },
    { id: "account", name: "Account" },
    { id: "billing", name: "Billing" },
    { id: "troubleshooting", name: "Troubleshooting" },
  ];

  // ------------------- LocalStorage helpers -------------------
  const readLocalFaqs = (): FaqItem[] => {
    try {
      const raw = localStorage.getItem(FAQ_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn("Failed to read faqs from localStorage", err);
      return [];
    }
  };

  const writeLocalFaqs = (items: FaqItem[]) => {
    try {
      localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(items));
      // notify other tabs/components that faqs updated
      window.dispatchEvent(new Event("faqsUpdated"));
    } catch (err) {
      console.warn("Failed to write faqs to localStorage", err);
    }
  };

  // ------------------- Fetching / syncing -------------------
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/stats?period=${timeRange}`);
      const d = res.data?.data || null;
      setStats(d);
      setMessages(d?.messages || []);
      if (d?.activeUsers?.value != null) setUserCount(d.activeUsers.value);
    } catch (err) {
      console.error("Error fetching stats:", err);
      // If backend stats fail it's okay — keep previous state or leave null
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const res = await api.get("/api/admin/stats/languages");
      const langs = res.data?.data || [];
      setLanguages(langs.map((l: any) => l.code));
    } catch (err) {
      console.error("Error fetching languages:", err);
      // fallback: if languages are empty, keep as-is
    }
  };

  // Fetch FAQs from backend and also store into localStorage for KnowledgeBase
  const fetchFaqs = async () => {
    try {
      const res = await axios.get("http://localhost:4001/api/faqs");
      const data = res.data?.data || [];

      // normalize to simple objects we store locally (backend may return different fields)
      const normalized: FaqItem[] = (Array.isArray(data) ? data : []).map(
        (it: any, i: number) => ({
          id: it.id ?? it._id ?? `backend-${i}-${Date.now()}`,
          title: it.title ?? it.question ?? it.q ?? "",
          content: it.content ?? it.answer ?? it.text ?? "",
          category: it.category ?? "general",
        })
      );

      setFaqs(normalized);

      // Save normalized to localStorage so KnowledgeBase can read it
      try {
        writeLocalFaqs(normalized);
      } catch (e) {
        console.warn("Could not write normalized faqs to localStorage", e);
      }
    } catch (err) {
      console.error("Error fetching faqs from backend:", err);

      // fallback: read from localStorage
      const local = readLocalFaqs();
      setFaqs(local);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  useEffect(() => {
    fetchLanguages();
    fetchFaqs();

    // Listen for cross-tab/local updates
    const onLocalUpdate = () => {
      const local = readLocalFaqs();
      setFaqs(local);
    };
    window.addEventListener("storage", onLocalUpdate);
    window.addEventListener("faqsUpdated", onLocalUpdate);

    return () => {
      window.removeEventListener("storage", onLocalUpdate);
      window.removeEventListener("faqsUpdated", onLocalUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMessages = useMemo(() => {
    let list = messages || [];
    if (reportLanguageFilter) {
      list = list.filter((m) => m.language === reportLanguageFilter);
    }
    if (reportSearch?.trim()) {
      const q = reportSearch.trim().toLowerCase();
      list = list.filter(
        (m: any) =>
          (m.text || "").toLowerCase().includes(q) ||
          (m.sender || "").toLowerCase().includes(q) ||
          (m.language || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, reportLanguageFilter, reportSearch]);

  const modalFilteredMessages = filteredMessages.slice(
    (reportPage - 1) * ROWS_PER_PAGE,
    reportPage * ROWS_PER_PAGE
  );

  const pageCount = Math.max(
    1,
    Math.ceil(filteredMessages.length / ROWS_PER_PAGE)
  );

  const downloadJSON = (data: any, filename = "report.json") => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any[], filename = "report.csv") => {
    if (!data || data.length === 0) {
      alert("No data to export");
      return;
    }
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((h) => `"${(row as any)[h] || ""}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFaqFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFaqFile(e.target.files[0]);
    }
  };

  // When uploading, try backend; if backend fails, merge into localStorage
  const handleUploadFAQs = async () => {
    if (!faqFile) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const faqsJson = JSON.parse(reader.result as string);

        // attempt backend upload
        let uploaded = false;
        try {
          // try admin-specific endpoint first
          await api.post("/api/admin/upload-faqs", {
            faqs: faqsJson,
          });
          uploaded = true;
          alert("Uploaded FAQs to backend");
        } catch (err) {
          // try bulk endpoint
          try {
            await axios.post("http://localhost:4001/api/faqs/bulk", {
              faqs: faqsJson,
            });
            uploaded = true;
            alert("Uploaded FAQs to backend (bulk)");
          } catch (err2) {
            console.warn("Backend upload failed, will fallback to localStorage", err2);
          }
        }

        // If backend didn't accept, save into localStorage
        if (!uploaded) {
          // Normalize incoming JSON to our local format
          const normalizedIncoming: FaqItem[] = (Array.isArray(faqsJson) ? faqsJson : []).map(
            (it: any, i: number) => ({
              id: it.id ?? it._id ?? `local-upload-${Date.now()}-${i}`,
              title: it.title ?? it.question ?? it.q ?? "",
              content: it.content ?? it.answer ?? it.text ?? "",
              category: it.category ?? "general",
            })
          );

          // Merge with existing local faqs
          const existing = readLocalFaqs();
          const merged = [...existing, ...normalizedIncoming];
          writeLocalFaqs(merged);
          setFaqs(merged);
          alert("Saved FAQs to localStorage (backend unavailable)");
        } else {
          // successful upload: refresh from backend (and localStorage will be set there)
          await fetchFaqs();
        }

        setFaqFile(null);
      } catch (err) {
        console.error(err);
        alert("Failed to upload FAQs (invalid JSON)");
      }
    };

    reader.readAsText(faqFile);
  };

  const simulateConversation = () => {
    if (!languages.length) return alert("No languages available.");
    const ts = Date.now();
    const newMsgs = [
      {
        id: `m-${ts}-1`,
        timestamp: ts - 60000,
        sender: "user",
        language: languages[0],
        text: "Demo: Hello there",
      },
      {
        id: `m-${ts}-2`,
        timestamp: ts - 58000,
        sender: "assistant",
        language: languages[0],
        text: "Demo: Hi, how can I help?",
      },
    ];
    setMessages((prev) => [...prev, ...newMsgs]);
    alert("Demo conversation added.");
  };

  const clearMessages = () => {
    setMessages([]);
    alert("All messages cleared.");
  };

  const handleAddLanguage = async () => {
    const code = newLangCode.trim().toLowerCase();
    const name = newLangName.trim();

    if (!name) return alert("Please enter a language name");
    if (!code) return alert("Please enter a language code");

    try {
      const res = await api.post("/api/admin/add-language", { code, name });

      alert(res.data?.message || "Language added");

      setNewLangName("");
      setNewLangCode("");
      setAddLangOpen(false);

      fetchLanguages();
      fetchStats();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add language");
    }
  };

  const exportFullReport = (format: "json" | "csv") => {
    if (!stats) return alert("No stats available");

    if (format === "json") {
      downloadJSON(stats, "dashboard_report.json");
    } else {
      const data = stats.languageDistribution || [];
      downloadCSV(data, "dashboard_report.csv");
    }
  };

  const totalConversations = stats?.totalConversations?.value || 0;
  const activeUsers = stats?.activeUsers?.value || 0;
  const topLanguages = stats?.topLanguagesUsed?.value || 0;
  const avgResponseTime = stats?.avgResponseTime?.value || 0;
  const conversationsByLanguage = stats?.conversationsByLanguage || [];
  const languageDistribution = stats?.languageDistribution || [];
  const weeklyStats = stats?.weeklyStats || [];

  const languageCounts: Record<string, number> = {};
  messages.forEach((m) => {
    if (!m?.language) return;
    languageCounts[m.language] = (languageCounts[m.language] || 0) + 1;
  });

  // ---------------------- Download helper ----------------------
  const downloadObjectAsJson = (data: any, filename = "admin-data.json") => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  // -------------------------------------------------------------------------

  // ---------------------- NEW: generate answer using chat endpoint ----------------------
  const generateAnswerFromModel = async () => {
    const question = newFaqQuestion.trim();
    if (!question) return alert("Enter a question first");
    setGeneratingAnswer(true);
    try {
      const res = await axios.post("http://localhost:4001/api/chatbot/reply", {
        question,
      });
      const reply =
        res.data?.reply ||
        res.data?.data?.reply ||
        res.data?.data?.botReplyOriginal ||
        "";
      setNewFaqAnswer(String(reply));
    } catch (err) {
      console.error("Failed to generate answer", err);
      alert("Failed to generate answer from model");
    } finally {
      setGeneratingAnswer(false);
    }
  };

  // Save new FAQ: try backend; fallback to localStorage
  const saveNewFaq = async () => {
    const title = (newFaqQuestion || "").trim();
    const content = (newFaqAnswer || "").trim();
    const category = newFaqCategory || "general";
    if (!title) return alert("Question cannot be empty");
    if (!content) return alert("Answer cannot be empty (generate or type it)");

    const payload = { title, content, category };

    try {
      // try to save to backend
      await axios.post("http://localhost:4001/api/faqs", payload);

      // refresh from backend and localStorage
      await fetchFaqs();

      // reset modal
      setNewFaqQuestion("");
      setNewFaqAnswer("");
      setNewFaqCategory("general");
      setAddFaqOpen(false);

      alert("FAQ saved to backend successfully");
    } catch (err) {
      console.warn("Failed to save FAQ to backend - saving to localStorage instead", err);

      // fallback: write to localStorage
      try {
        const local = readLocalFaqs();

        // create a local id so it shows in UI
        const localId = `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const localEntry: FaqItem = {
          id: localId,
          title,
          content,
          category,
        };

        const merged = [...local, localEntry];
        writeLocalFaqs(merged);

        setFaqs(merged);

        // reset modal
        setNewFaqQuestion("");
        setNewFaqAnswer("");
        setNewFaqCategory("general");
        setAddFaqOpen(false);

        alert("Backend offline — saved FAQ to localStorage");
      } catch (err2) {
        console.error("Failed to save FAQ to localStorage", err2);
        alert("Failed to save FAQ (backend & localStorage both failed)");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">
              Monitor and manage your multilingual support platform
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-lg">
              {timeRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-2 rounded-md ${
                    timeRange === r
                      ? "bg-[#007BFF] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => exportFullReport("json")}
              >
                <Download className="w-4 h-4" /> Export JSON
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => exportFullReport("csv")}
              >
                <Download className="w-4 h-4" /> Export CSV
              </Button>

              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => {
                  setReportsOpen(true);
                  setReportSearch("");
                  setReportLanguageFilter("");
                  setReportPage(1);
                }}
              >
                <FileText className="w-4 h-4" /> View Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Conversations",
              value: totalConversations,
              icon: MessageSquare,
              color: "from-blue-500 to-blue-600",
              change: "+12.5%",
            },
            {
              title: "Active Users",
              value: activeUsers,
              icon: Users,
              color: "from-green-500 to-green-600",
              change: "+8.2%",
            },
            {
              title: "Top Languages Used",
              value: topLanguages,
              icon: Globe,
              color: "from-purple-500 to-purple-600",
              change: "+3",
            },
            {
              title: "Avg Response Time",
              value: avgResponseTime,
              icon: TrendingUp,
              color: "from-orange-500 to-orange-600",
              change: "-0.3s",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">{stat.title}</p>
                      <h2 className="text-gray-900 mb-1">{stat.value}</h2>
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" /> {stat.change}
                      </div>
                    </div>

                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Add Language */}
          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                <Plus className="text-white w-6 h-6" />
              </div>

              <div>
                <h3 className="text-gray-900 mb-1">Add Language</h3>
                <p className="text-gray-600">Enable new language support</p>
                <div className="mt-3">
                  <Button size="sm" onClick={() => setAddLangOpen(true)}>
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload FAQs */}
          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Upload className="text-white w-6 h-6" />
              </div>

              <div>
                <h3 className="text-gray-900 mb-1">Upload FAQs</h3>
                <p className="text-gray-600">Add knowledge base content</p>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,.txt"
                    className="hidden"
                    onChange={(e) => {
                      onFaqFileChange(e);
                      handleUploadFAQs();
                    }}
                  />

                  <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                    Upload
                  </Button>

                  <Button size="sm" variant="outline" onClick={() => setAddFaqOpen(true)}>
                    Add FAQ (manual)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Reports */}
          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="text-white w-6 h-6" />
              </div>

              <div>
                <h3 className="text-gray-900 mb-1">View Reports</h3>
                <p className="text-gray-600">Detailed analytics & insights</p>

                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setReportsOpen(true);
                      setReportSearch("");
                      setReportLanguageFilter("");
                      setReportPage(1);
                    }}
                  >
                    Open
                  </Button>

                  <Button size="sm" variant="outline" onClick={clearMessages}>
                    Clear Messages
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Language Modal */}
        {addLangOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add Language</h3>

                <button
                  onClick={() => setAddLangOpen(false)}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <XIcon />
                </button>
              </div>

              <div className="p-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Language name
                </label>

                <input
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  className="w-full border rounded px-3 py-2 mb-3"
                  placeholder="e.g. Japanese"
                />

                <label className="block text-sm text-gray-600 mb-2">
                  Language code
                </label>

                <input
                  value={newLangCode}
                  onChange={(e) => setNewLangCode(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g. ja"
                />
              </div>

              <div className="p-4 flex items-center justify-end gap-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddLangOpen(false)}
                >
                  Cancel
                </Button>

                <Button size="sm" onClick={handleAddLanguage}>
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add FAQ Modal (manual) */}
        {addFaqOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add FAQ (Manual)</h3>

                <button
                  onClick={() => setAddFaqOpen(false)}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <XIcon />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <label className="block text-sm text-gray-600">Question</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  placeholder="e.g. How do I change my email?"
                />

                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={generateAnswerFromModel} disabled={generatingAnswer}>
                    {generatingAnswer ? "Generating…" : "Generate Answer"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewFaqAnswer("");
                    }}
                  >
                    Clear Answer
                  </Button>

                  <div className="ml-auto">
                    <label className="block text-sm text-gray-600">Category</label>
                    <select
                      value={newFaqCategory}
                      onChange={(e) => setNewFaqCategory(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="block text-sm text-gray-600">Answer (editable)</label>
                <textarea
                  className="w-full border rounded px-3 py-2 min-h-[120px]"
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                />

                <div className="flex items-center justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setAddFaqOpen(false)}>
                    Cancel
                  </Button>

                  <Button size="sm" onClick={saveNewFaq}>
                    Save FAQ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-[#007BFF] w-5 h-5" />
                Conversations by Language
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversationsByLanguage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="language" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#007BFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-[#00B5AD] w-5 h-5" />
                Distribution
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageDistribution}
                    innerRadius={55}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {languageDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {languageDistribution.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-600">{item.name}</span>
                    </div>

                    <span className="text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card className="shadow-sm border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#007BFF]" />
              Weekly Activity
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="conversations"
                  stroke="#007BFF"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="translations"
                  stroke="#00B5AD"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={simulateConversation}>
                Simulate Conversation
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  downloadObjectAsJson(
                    { messages, languages, faqs },
                    "admin-data.json"
                  )
                }
              >
                Download Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Modal */}
      {reportsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Reports</h3>
                <p className="text-sm text-gray-500">
                  Dynamic analytics & message explorer
                </p>
              </div>

              <button
                onClick={() => {
                  setReportsOpen(false);
                  setReportPage(1);
                }}
                className="p-2 rounded hover:bg-gray-100"
              >
                <XIcon />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Summary Panel */}
              <div className="lg:col-span-1 space-y-3">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-sm text-gray-600">Summary</h4>
                  <div className="mt-2 text-gray-900">
                    Total messages:
                    <span className="font-medium ml-1">
                      {filteredMessages.length}
                    </span>
                  </div>

                  <div className="text-gray-900">
                    Filtered:
                    <span className="font-medium ml-1">
                      {modalFilteredMessages.length}
                    </span>
                  </div>

                  <div className="text-gray-900">
                    Active users:
                    <span className="font-medium ml-1">{activeUsers}</span>
                  </div>

                  <div className="text-gray-900">
                    Avg response:
                    <span className="font-medium ml-1">
                      {avgResponseTime}s
                    </span>
                  </div>
                </div>

                {/* Language Stats Panel */}
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-sm text-gray-600 mb-2">Top Languages</h4>

                  <div className="space-y-2">
                    {Object.keys(languageCounts).map((l) => (
                      <div
                        key={l}
                        className="flex items-center justify-between text-sm text-gray-700"
                      >
                        <div>{l}</div>
                        <div>{languageCounts[l]}</div>
                      </div>
                    ))}

                    {/* Empty state */}
                    {Object.keys(languageCounts).length === 0 &&
                      languages.map((l: any) => (
                        <div
                          key={l}
                          className="flex items-center justify-between text-sm text-gray-700"
                        >
                          <div>{l}</div>
                          <div>0</div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-sm text-gray-600 mb-2">Quick actions</h4>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => downloadJSON(stats, "full-report.json")}
                    >
                      Download report (JSON)
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadCSV(messages, "full-report.csv")}
                    >
                      Download report (CSV)
                    </Button>

                    <Button size="sm" onClick={simulateConversation}>
                      Simulate conversation
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearMessages}
                    >
                      Clear messages
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Table */}
              <div className="lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {modalFilteredMessages.length} messages — page{" "}
                    {reportPage} / {pageCount}
                  </div>
                </div>

                <div className="overflow-auto bg-white rounded shadow">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-sm text-gray-600">
                          Time
                        </th>
                        <th className="px-3 py-2 text-sm text-gray-600">
                          Sender
                        </th>
                        <th className="px-3 py-2 text-sm text-gray-600">
                          Language
                        </th>
                        <th className="px-3 py-2 text-sm text-gray-600">
                          Message
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {modalFilteredMessages.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-6 text-center text-sm text-gray-500"
                          >
                            No messages found
                          </td>
                        </tr>
                      )}

                      {modalFilteredMessages.map((m: any) => (
                        <tr
                          key={m.id || `${m.timestamp}-${Math.random()}`}
                          className="border-t"
                        >
                          <td className="px-3 py-3 text-sm text-gray-700">
                            {new Date(m.timestamp || 0).toLocaleString()}
                          </td>

                          <td className="px-3 py-3 text-sm text-gray-700">
                            {m.sender}
                          </td>

                          <td className="px-3 py-3 text-sm text-gray-700">
                            {m.language || "Unknown"}
                          </td>

                          <td className="px-3 py-3 text-sm text-gray-700 whitespace-pre-wrap">
                            {m.text}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {reportPage} of {pageCount}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReportPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </Button>

                    <Button
                      size="sm"
                      onClick={() =>
                        setReportPage((p) => Math.min(pageCount, p + 1))
                      }
                    >
                      Next
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setReportPage(1);
                        setReportSearch("");
                        setReportLanguageFilter("");
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">
                Generated at: {new Date().toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadJSON(modalFilteredMessages, "filtered.json")
                  }
                >
                  JSON
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadCSV(modalFilteredMessages, "filtered.csv")
                  }
                >
                  CSV
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    setReportsOpen(false);
                    setReportPage(1);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
