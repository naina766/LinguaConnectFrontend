import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AdminDashboard } from './components/AdminDashboard';
import { HowItWorks } from './components/HowItWorks';
import { Globe, MessageSquare, BookOpen, LayoutDashboard, Workflow } from 'lucide-react';

type Page = 'landing' | 'chat' | 'knowledge' | 'dashboard' | 'howitworks';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatInterface />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'dashboard':
        return <AdminDashboard />;
      case 'howitworks':
        return <HowItWorks />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  if (currentPage === 'landing') {
    return renderPage();
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900">LinguaConnect</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage('landing')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'landing' ? 'bg-blue-50 text-[#007BFF]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('chat')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentPage === 'chat' ? 'bg-blue-50 text-[#007BFF]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Chat
              </button>
              <button
                onClick={() => setCurrentPage('knowledge')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentPage === 'knowledge' ? 'bg-blue-50 text-[#007BFF]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Knowledge Base
              </button>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentPage === 'dashboard' ? 'bg-blue-50 text-[#007BFF]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('howitworks')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentPage === 'howitworks' ? 'bg-blue-50 text-[#007BFF]' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Workflow className="w-4 h-4" />
                How It Works
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {renderPage()}
    </div>
  );
}
