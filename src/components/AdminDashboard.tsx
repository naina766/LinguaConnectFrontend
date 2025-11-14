// AdminDashboard.tsx
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

/**
 * Updated AdminDashboard.tsx
 * - "View Reports" opens an in-page popup modal (no navigation)
 * - Modal shows dynamic analytics and a scrollable message table
 * - Filters: time-range and text search
 * - Download JSON / CSV of filtered messages or whole report
 * - Uses localStorage keys:
 *    - chatMessages (array of { id, timestamp, sender, language, text, ... })
 *    - userCount
 *    - languages
 *    - faqs
 *
 * Copy-paste to replace your existing AdminDashboard.tsx
 */

// ---------- helpers ----------
const readMessages = (): any[] => {
  try {
    const raw = localStorage.getItem("chatMessages");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const readLanguages = (): string[] => {
  try {
    const raw = localStorage.getItem("languages");
    return raw ? JSON.parse(raw) : ["English", "Hindi", "Spanish"];
  } catch {
    return ["English", "Hindi", "Spanish"];
  }
};

const readFaqs = (): any[] => {
  try {
    const raw = localStorage.getItem("faqs");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ---------- component ----------
export function AdminDashboard() {
  // auth redirect (hard)
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    window.location.href = "/";
    return null;
  }

  // core state
  const [messages, setMessages] = useState<any[]>(() => readMessages());
  const [userCount, setUserCount] = useState<number>(() => Number(localStorage.getItem("userCount") || 0));
  const [languages, setLanguages] = useState<string[]>(() => readLanguages());
  const [faqs, setFaqs] = useState<any[]>(() => readFaqs());

  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">("7d");

  // UI: reports modal
  const [reportsOpen, setReportsOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [reportLanguageFilter, setReportLanguageFilter] = useState<string>(""); // "" = all
  const [reportPage, setReportPage] = useState(1);
  const rowsPerPage = 12;

  // file input for FAQ upload
  const fileRef = useRef<HTMLInputElement | null>(null);

  // keep local state synced to localStorage across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === "chatMessages") setMessages(readMessages());
      if (!e.key || e.key === "userCount") setUserCount(Number(localStorage.getItem("userCount") || 0));
      if (!e.key || e.key === "languages") setLanguages(readLanguages());
      if (!e.key || e.key === "faqs") setFaqs(readFaqs());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // keep localStorage in sync when we update messages/languages/faqs locally
  useEffect(() => localStorage.setItem("chatMessages", JSON.stringify(messages)), [messages]);
  useEffect(() => localStorage.setItem("languages", JSON.stringify(languages)), [languages]);
  useEffect(() => localStorage.setItem("faqs", JSON.stringify(faqs)), [faqs]);

  // ---------------- analytics calculations ----------------
  const now = Date.now();
  const rangeMillis: Record<string, number> = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
  };

  const filteredByTime = useMemo(() => {
    return messages.filter((m) => now - (m.timestamp || 0) <= rangeMillis[timeRange]);
  }, [messages, timeRange, now]);

  // counts
  const totalConversations = filteredByTime.filter((m) => m.sender === "user").length;
  const uniqueUsers = userCount;

  const languageCounts = useMemo(() => {
    const obj: Record<string, number> = {};
    filteredByTime.forEach((m) => {
      const lang = m.language || "Unknown";
      obj[lang] = (obj[lang] || 0) + 1;
    });
    return obj;
  }, [filteredByTime]);

  const topLanguages = Object.keys(languageCounts).length;
  const conversationsByLanguage = Object.keys(languageCounts).map((lang) => ({
    language: lang,
    count: languageCounts[lang],
    fill: "#007BFF",
  }));

  // avg response time (user -> assistant)
  const avgResponseTime = useMemo(() => {
    let totalRT = 0;
    let rtCount = 0;
    for (let i = 0; i < filteredByTime.length; i++) {
      const m = filteredByTime[i];
      if (m.sender === "user") {
        const next = filteredByTime[i + 1];
        if (next && next.sender === "assistant") {
          totalRT += next.timestamp - m.timestamp;
          rtCount++;
        }
      }
    }
    return rtCount > 0 ? (totalRT / rtCount / 1000).toFixed(1) + "s" : "0.0s";
  }, [filteredByTime]);

  // weekly stats
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyStats = useMemo(() => {
    const map: Record<string, { conversations: number; translations: number }> = {};
    days.forEach((d) => (map[d] = { conversations: 0, translations: 0 }));
    filteredByTime.forEach((m) => {
      const d = days[new Date(m.timestamp || 0).getDay()];
      if (m.sender === "user") map[d].conversations++;
      else map[d].translations++;
    });
    return days.map((d) => ({ day: d, conversations: map[d].conversations, translations: map[d].translations }));
  }, [filteredByTime]);

  // language distribution (pie)
  const languageDistribution = useMemo(() => {
    const keys = Object.keys(languageCounts);
    if (keys.length === 0) return languages.map((l) => ({ name: l, value: 0, color: "#" + Math.floor(Math.random() * 16777215).toString(16) }));
    const total = filteredByTime.length || 1;
    return keys.map((k) => ({ name: k, value: Number(((languageCounts[k] / total) * 100).toFixed(1)), color: "#" + Math.floor(Math.random() * 16777215).toString(16) }));
  }, [languageCounts, filteredByTime.length, languages]);

  // ---------------- Reports modal: filtering + pagination ----------------
  // create a derived list of messages according to modal filters
  const modalFilteredMessages = useMemo(() => {
    let list = [...filteredByTime]; // already time-filtered globally by header timeRange
    if (reportLanguageFilter) list = list.filter((m) => (m.language || "Unknown") === reportLanguageFilter);
    if (reportSearch && reportSearch.trim().length > 0) {
      const q = reportSearch.trim().toLowerCase();
      list = list.filter((m) => {
        return (m.text || "").toString().toLowerCase().includes(q) || (m.sender || "").toLowerCase().includes(q) || (m.language || "").toLowerCase().includes(q);
      });
    }
    // sort desc by timestamp
    list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return list;
  }, [filteredByTime, reportLanguageFilter, reportSearch]);

  const pageCount = Math.max(1, Math.ceil(modalFilteredMessages.length / rowsPerPage));
  useEffect(() => {
    if (reportPage > pageCount) setReportPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount]);

  const pagedMessages = useMemo(() => {
    const start = (reportPage - 1) * rowsPerPage;
    return modalFilteredMessages.slice(start, start + rowsPerPage);
  }, [modalFilteredMessages, reportPage]);

  // ---------------- actions: exports / uploads / clear ----------------
  const downloadObjectAsJson = (obj: any, filename = "report.json") => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const exportFilteredAsCsv = (rows: any[], filename = "messages.csv") => {
    const header = ["timestamp", "sender", "language", "text"];
    const csvRows = [header, ...rows.map((m) => [m.timestamp, m.sender, m.language || "", (m.text || "").toString().replace(/\r?\n/g, " ")])];
    const csv = csvRows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const exportFullReport = (format: "json" | "csv" = "json") => {
    const payload = {
      meta: { generatedAt: new Date().toISOString(), totalMessages: messages.length, filteredCount: filteredByTime.length, userCount },
      messages: filteredByTime,
      languages,
      faqs,
      weeklyStats,
      languageCounts,
    };
    if (format === "json") {
      downloadObjectAsJson(payload, "lingua-full-report.json");
    } else {
      exportFilteredAsCsv(payload.messages, "lingua-full-report.csv");
    }
  };

  const exportModalFiltered = (format: "json" | "csv" = "json") => {
    if (format === "json") {
      downloadObjectAsJson({ meta: { generatedAt: new Date().toISOString(), selectedCount: modalFilteredMessages.length }, messages: modalFilteredMessages }, "lingua-filtered-messages.json");
    } else {
      exportFilteredAsCsv(modalFilteredMessages, "lingua-filtered-messages.csv");
    }
  };

  const handleFaqFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const txt = await file.text();
      try {
        const parsed = JSON.parse(txt);
        const next = Array.isArray(parsed) ? [...faqs, ...parsed] : [...faqs, parsed];
        setFaqs(next);
        localStorage.setItem("faqs", JSON.stringify(next));
        alert("FAQs uploaded.");
      } catch {
        const entry = { id: Date.now(), text: txt };
        const next = [...faqs, entry];
        setFaqs(next);
        localStorage.setItem("faqs", JSON.stringify(next));
        alert("Text FAQ uploaded.");
      }
    } catch {
      alert("Failed reading file.");
    }
  };

  const onFaqFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    handleFaqFile(f);
    if (e.target) e.currentTarget.value = "";
  };

  const clearMessages = () => {
    if (!confirm("Clear all chat messages? This cannot be undone.")) return;
    setMessages([]);
    localStorage.removeItem("chatMessages");
    alert("Messages cleared.");
  };

  const simulateConversation = () => {
    const ts = Date.now();
    const newMsgs = [
      { id: `m-${ts}-1`, timestamp: ts - 60000, sender: "user", language: languages[0] || "English", text: "Demo: Hello there" },
      { id: `m-${ts}-2`, timestamp: ts - 58000, sender: "assistant", language: languages[0] || "English", text: "Demo: Hi how can I help?" },
    ];
    const next = [...messages, ...newMsgs];
    setMessages(next);
    alert("Demo conversation added.");
  };

  // add language (prompt)
  const addLanguage = () => {
    const name = prompt("Enter new language:");
    if (!name) return;
    if (languages.includes(name)) return alert("Language exists");
    const next = [...languages, name];
    setLanguages(next);
    localStorage.setItem("languages", JSON.stringify(next));
    alert("Language added.");
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA] p-8">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your multilingual support platform</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-lg">
              {(["24h", "7d", "30d", "90d"] as const).map((r) => (
                <button key={r} onClick={() => setTimeRange(r)} className={`px-4 py-2 rounded-md ${timeRange === r ? "bg-[#007BFF] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2" onClick={() => exportFullReport("json")}>
                <Download className="w-4 h-4" /> Export JSON
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => exportFullReport("csv")}>
                <Download className="w-4 h-4" /> Export CSV
              </Button>
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => { setReportsOpen(true); setReportSearch(""); setReportLanguageFilter(""); setReportPage(1); }}>
                <FileText className="w-4 h-4" /> View Reports
              </Button>
            </div>
          </div>
        </div>

        {/* stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Conversations", value: totalConversations, icon: MessageSquare, color: "from-blue-500 to-blue-600", change: "+12.5%" },
            { title: "Active Users", value: uniqueUsers, icon: Users, color: "from-green-500 to-green-600", change: "+8.2%" },
            { title: "Top Languages Used", value: topLanguages, icon: Globe, color: "from-purple-500 to-purple-600", change: "+3" },
            { title: "Avg Response Time", value: avgResponseTime, icon: TrendingUp, color: "from-orange-500 to-orange-600", change: "-0.3s" },
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
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                <Plus className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Add Language</h3>
                <p className="text-gray-600">Enable new language support</p>
                <div className="mt-3">
                  <Button size="sm" onClick={addLanguage}>Add</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Upload className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Upload FAQs</h3>
                <p className="text-gray-600">Add knowledge base content</p>
                <div className="mt-3">
                  <input ref={fileRef} type="file" accept=".json,.txt" onChange={onFaqFileChange} className="hidden" />
                  <Button size="sm" onClick={() => fileRef.current?.click()}>Upload</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">View Reports</h3>
                <p className="text-gray-600">Detailed analytics & insights</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => { setReportsOpen(true); setReportSearch(""); setReportLanguageFilter(""); setReportPage(1); }}>Open</Button>
                  <Button size="sm" variant="outline" onClick={clearMessages}>Clear Messages</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* charts */}
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
                  <Pie data={languageDistribution} innerRadius={55} outerRadius={90} dataKey="value">
                    {languageDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {languageDistribution.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* weekly */}
        <Card className="shadow-sm border-0">
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
                <Line type="monotone" dataKey="conversations" stroke="#007BFF" strokeWidth={3} />
                <Line type="monotone" dataKey="translations" stroke="#00B5AD" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm" onClick={simulateConversation}>Simulate Conversation</Button>
              <Button size="sm" variant="outline" onClick={() => downloadObjectAsJson({ messages, languages, faqs }, "admin-data.json")}>Download Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Reports Modal (in-page popup) ---------------- */}
      {reportsOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-xl overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">Reports</h3>
                <p className="text-sm text-gray-500">Dynamic analytics & message explorer</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border rounded px-3 py-1">
                  <label className="text-sm text-gray-600">Language</label>
                  <select value={reportLanguageFilter} onChange={(e) => { setReportLanguageFilter(e.target.value); setReportPage(1); }} className="ml-2 bg-transparent outline-none">
                    <option value="">All</option>
                    {Object.keys(languageCounts).map((l) => <option key={l} value={l}>{l}</option>)}
                    {languages.filter((l) => !Object.keys(languageCounts).includes(l)).map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 border rounded px-3 py-1">
                  <input
                    placeholder="Search messages..."
                    value={reportSearch}
                    onChange={(e) => { setReportSearch(e.target.value); setReportPage(1); }}
                    className="outline-none text-sm"
                  />
                  <button className="text-sm text-gray-600" onClick={() => { setReportSearch(""); setReportLanguageFilter(""); setReportPage(1); }}>Reset</button>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportModalFiltered("json")}>
                    <Download className="w-4 h-4" /> JSON
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportModalFiltered("csv")}>
                    <Download className="w-4 h-4" /> CSV
                  </Button>
                  <Button size="sm" onClick={() => { setReportsOpen(false); setReportPage(1); }}>Close</Button>
                </div>

                <button onClick={() => { setReportsOpen(false); setReportPage(1); }} className="ml-2 p-2 rounded hover:bg-gray-100">
                  <XIcon />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* left: summary cards */}
              <div className="lg:col-span-1 space-y-3">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-sm text-gray-600">Summary</h4>
                  <div className="mt-2 text-gray-900">Total messages (time filter): <span className="font-medium">{filteredByTime.length}</span></div>
                  <div className="text-gray-900">Filtered messages: <span className="font-medium">{modalFilteredMessages.length}</span></div>
                  <div className="text-gray-900">Active users: <span className="font-medium">{userCount}</span></div>
                  <div className="text-gray-900">Avg response time: <span className="font-medium">{avgResponseTime}</span></div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-sm text-gray-600 mb-2">Top Languages</h4>
                  <div className="space-y-2">
                    {Object.keys(languageCounts).length === 0 && languages.map((l) => (
                      <div key={l} className="flex items-center justify-between text-sm text-gray-700">
                        <div>{l}</div>
                        <div>0</div>
                      </div>
                    ))}
                    {Object.keys(languageCounts).map((l) => (
                      <div key={l} className="flex items-center justify-between text-sm text-gray-700">
                        <div>{l}</div>
                        <div>{languageCounts[l]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-sm text-gray-600 mb-2">Quick actions</h4>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => exportFullReport("json")}>Download full report (JSON)</Button>
                    <Button size="sm" variant="outline" onClick={() => exportFullReport("csv")}>Download full report (CSV)</Button>
                    <Button size="sm" onClick={simulateConversation}>Simulate conversation</Button>
                    <Button size="sm" variant="outline" onClick={clearMessages}>Clear all messages</Button>
                  </div>
                </div>
              </div>

              {/* middle+right: message table (2 cols span) */}
              <div className="lg:col-span-2">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Showing {modalFilteredMessages.length} messages — page {reportPage} / {pageCount}</div>
                  <div className="flex items-center gap-2">
                    <select value={rowsPerPage} onChange={() => { /* rowsPerPage is const for now */ }} className="hidden" />
                  </div>
                </div>

                <div className="overflow-auto bg-white rounded shadow">
                  <table className="min-w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-sm text-gray-600">Time</th>
                        <th className="px-3 py-2 text-sm text-gray-600">Sender</th>
                        <th className="px-3 py-2 text-sm text-gray-600">Language</th>
                        <th className="px-3 py-2 text-sm text-gray-600">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedMessages.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-3 py-6 text-center text-sm text-gray-500">No messages found</td>
                        </tr>
                      )}
                      {pagedMessages.map((m: any) => (
                        <tr key={m.id || `${m.timestamp}-${Math.random()}`} className="border-t">
                          <td className="px-3 py-3 text-sm text-gray-700">{new Date(m.timestamp || 0).toLocaleString()}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{m.sender}</td>
                          <td className="px-3 py-3 text-sm text-gray-700">{m.language || "Unknown"}</td>
                          <td className="px-3 py-3 text-sm text-gray-700 whitespace-pre-wrap">{m.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* pagination */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Page {reportPage} of {pageCount}</div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setReportPage((p) => Math.max(1, p - 1))}>Prev</Button>
                    <Button size="sm" onClick={() => setReportPage((p) => Math.min(pageCount, p + 1))}>Next</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setReportPage(1); setReportSearch(""); setReportLanguageFilter(""); }}>Reset</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-600">Generated at: {new Date().toLocaleString()}</div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => exportModalFiltered("json")}>Download filtered (JSON)</Button>
                <Button size="sm" variant="outline" onClick={() => exportModalFiltered("csv")}>Download filtered (CSV)</Button>
                <Button size="sm" onClick={() => { setReportsOpen(false); setReportPage(1); }}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
