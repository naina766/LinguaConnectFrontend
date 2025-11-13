import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const statsCards = [
    {
      title: 'Total Conversations',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Users',
      value: '3,842',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Top Languages Used',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const conversationsByLanguage = [
    { language: 'English', count: 4500, fill: '#007BFF' },
    { language: 'Spanish', count: 2800, fill: '#00B5AD' },
    { language: 'Hindi', count: 2200, fill: '#6366f1' },
    { language: 'French', count: 1500, fill: '#8b5cf6' },
    { language: 'German', count: 1000, fill: '#ec4899' },
    { language: 'Chinese', count: 543, fill: '#f59e0b' },
  ];

  const weeklyStats = [
    { day: 'Mon', conversations: 1200, translations: 3400 },
    { day: 'Tue', conversations: 1900, translations: 4200 },
    { day: 'Wed', conversations: 1600, translations: 3800 },
    { day: 'Thu', conversations: 2100, translations: 4900 },
    { day: 'Fri', conversations: 2400, translations: 5200 },
    { day: 'Sat', conversations: 1800, translations: 3900 },
    { day: 'Sun', conversations: 1543, translations: 3543 },
  ];

  const languageDistribution = [
    { name: 'English', value: 35, color: '#007BFF' },
    { name: 'Spanish', value: 22, color: '#00B5AD' },
    { name: 'Hindi', value: 18, color: '#6366f1' },
    { name: 'French', value: 12, color: '#8b5cf6' },
    { name: 'Others', value: 13, color: '#94a3b8' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your multilingual support platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
              {['24h', '7d', '30d', '90d'].map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-[#007BFF] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
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
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">{stat.change}</span>
                        <span className="text-gray-500">vs last period</span>
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Add Language</h3>
                  <p className="text-gray-600">Enable new language support</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">Upload FAQs</h3>
                  <p className="text-gray-600">Add knowledge base content</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-1">View Reports</h3>
                  <p className="text-gray-600">Detailed analytics & insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Conversations by Language */}
          <Card className="lg:col-span-2 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#007BFF]" />
                Conversations by Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversationsByLanguage}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="language" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Language Distribution */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00B5AD]" />
                Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {languageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {languageDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#007BFF]" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversations" 
                  stroke="#007BFF" 
                  strokeWidth={3}
                  dot={{ fill: '#007BFF', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="translations" 
                  stroke="#00B5AD" 
                  strokeWidth={3}
                  dot={{ fill: '#00B5AD', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#007BFF] rounded-full"></div>
                <span className="text-gray-600">Conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00B5AD] rounded-full"></div>
                <span className="text-gray-600">Translations</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
