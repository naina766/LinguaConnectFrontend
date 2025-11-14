import { useState, useEffect } from "react";
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

// Helper
const readMessages = () => {
  try {
    const raw = localStorage.getItem("chatMessages");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const [messages, setMessages] = useState(() => readMessages());
  const [userCount, setUserCount] = useState(() =>
    Number(localStorage.getItem("userCount") || 0)
  );

  // Re-read data when localStorage changes
  useEffect(() => {
    const onStorage = () => {
      setMessages(readMessages());
      setUserCount(Number(localStorage.getItem("userCount") || 0));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // -----------------------------
  // FILTER BY TIME RANGE
  // -----------------------------
  const now = Date.now();
  const rangeMap: any = {
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
    "90d": 90 * 24 * 60 * 60 * 1000,
  };

  const filteredMessages = messages.filter(
    (m: any) => now - m.timestamp <= rangeMap[timeRange]
  );

  // -----------------------------
  // CALCULATE STATS
  // -----------------------------
  const userMessages = filteredMessages.filter((m: any) => m.sender === "user");

  // 1️⃣ Total Conversations
  const totalConversations = userMessages.length;

  // 2️⃣ Active Users (AU1 mode – unique logins)
  const uniqueUsers = userCount;

  // 3️⃣ Language Usage
  const languageCounts: any = {};
  filteredMessages.forEach((m: any) => {
    if (!languageCounts[m.language]) languageCounts[m.language] = 0;
    languageCounts[m.language]++;
  });

  const topLanguages = Object.keys(languageCounts).length;

  const conversationsByLanguage = Object.keys(languageCounts).map((lang) => ({
    language: lang,
    count: languageCounts[lang],
    fill: "#007BFF",
  }));

  // 4️⃣ Average Response Time
  let totalRT = 0;
  let rtCount = 0;
  for (let i = 0; i < filteredMessages.length; i++) {
    const m = filteredMessages[i];
    if (m.sender === "user") {
      const next = filteredMessages[i + 1];
      if (next && next.sender === "assistant") {
        totalRT += next.timestamp - m.timestamp;
        rtCount++;
      }
    }
  }

  const avgResponseTime =
    rtCount > 0 ? (totalRT / rtCount / 1000).toFixed(1) + "s" : "0.0s";

  // -----------------------------
  // PIE CHART (LANG DISTRIBUTION)
  // -----------------------------
  const languageDistribution = Object.keys(languageCounts).map((lang) => {
    const total = filteredMessages.length;
    const percent = ((languageCounts[lang] / total) * 100).toFixed(1);
    return {
      name: lang,
      value: Number(percent),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };
  });

  // -----------------------------
  // WEEKLY ACTIVITY (Mon-Sun)
  // -----------------------------
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyMap: any = {};

  days.forEach((d) => (weeklyMap[d] = { conversations: 0, translations: 0 }));

  filteredMessages.forEach((m: any) => {
    const d = days[new Date(m.timestamp).getDay()];
    if (m.sender === "user") weeklyMap[d].conversations++;
    else weeklyMap[d].translations++;
  });

  const weeklyStats = days.map((d) => ({
    day: d,
    conversations: weeklyMap[d].conversations,
    translations: weeklyMap[d].translations,
  }));

  // -----------------------------
  // STAT CARDS
  // -----------------------------
  const statsCards = [
    {
      title: "Total Conversations",
      value: totalConversations,
      change: "+12.5%",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Active Users",
      value: uniqueUsers,
      change: "+8.2%",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Top Languages Used",
      value: topLanguages,
      change: "+3",
      icon: Globe,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Avg Response Time",
      value: avgResponseTime,
      change: "-0.3s",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // -----------------------------
  // EXPORT ANALYTICS
  // -----------------------------
  const exportAnalytics = () => {
    const data = {
      totalConversations,
      activeUsers: uniqueUsers,
      languages: languageCounts,
      weeklyStats,
      messages: filteredMessages,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lingua-analytics.json";
    a.click();
  };

  // -----------------------------
  // UI (unchanged)
  // -----------------------------
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
            <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-lg">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md ${
                    timeRange === range
                      ? "bg-[#007BFF] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <Button variant="outline" className="flex items-center gap-2" onClick={exportAnalytics}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-sm">
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

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6 flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                <Plus className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Add Language</h3>
                <p className="text-gray-600">Enable new language support</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6 flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Upload className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Upload FAQs</h3>
                <p className="text-gray-600">Add knowledge base content</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-0 hover:shadow-md bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">View Reports</h3>
                <p className="text-gray-600">Detailed analytics & insights</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* LEFT BAR CHART */}
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

          {/* RIGHT PIE CHART */}
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
                    {languageDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {languageDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
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

        {/* WEEKLY ACTIVITY */}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
