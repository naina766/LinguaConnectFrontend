import { Globe, MessageSquare, BarChart3, Zap, Shield, Users } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Page = 'landing' | 'chat' | 'knowledge' | 'dashboard' | 'howitworks';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const floatingTexts = [
    { text: 'Hello', lang: 'English', top: '20%', left: '15%', delay: '0s' },
    { text: 'Hola', lang: 'Spanish', top: '30%', right: '20%', delay: '0.5s' },
    { text: 'नमस्ते', lang: 'Hindi', top: '60%', left: '10%', delay: '1s' },
    { text: 'Bonjour', lang: 'French', top: '70%', right: '15%', delay: '1.5s' },
    { text: '你好', lang: 'Chinese', top: '40%', left: '25%', delay: '2s' },
    { text: 'مرحبا', lang: 'Arabic', top: '50%', right: '30%', delay: '2.5s' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#007BFF] via-[#0056b3] to-[#00B5AD]">
      {/* Header */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#007BFF]" />
              </div>
              <span className="text-white">LinguaConnect</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('howitworks')} className="text-white hover:text-blue-100 transition-colors">
                How It Works
              </button>
              <button onClick={() => onNavigate('knowledge')} className="text-white hover:text-blue-100 transition-colors">
                Knowledge Base
              </button>
              <button onClick={() => onNavigate('dashboard')} className="text-white hover:text-blue-100 transition-colors">
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* World Map Background */}
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1609868714484-2b2556006301?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMG1hcCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYyODg2OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="World Map"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Floating Language Texts */}
        {floatingTexts.map((item, index) => (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
              animationDuration: '3s',
              animationIterationCount: 'infinite',
            }}
          >
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <p className="text-white">{item.text}</p>
            </div>
          </div>
        ))}

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span className="text-white">Powered by Lingo CLI</span>
          </div>
          
          <h1 className="text-white mb-4">
            Talk to anyone, anywhere — in your language.
          </h1>
          
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            AI-powered multilingual support for global businesses. Break language barriers and provide exceptional customer service in over 100 languages.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button 
              onClick={() => onNavigate('chat')}
              size="lg"
              className="bg-white text-[#007BFF] hover:bg-blue-50"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Start Chat
            </Button>
            <Button 
              onClick={() => onNavigate('chat')}
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              Try Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Globe className="w-8 h-8 text-white mb-2 mx-auto" />
              <p className="text-white">100+ Languages</p>
              <p className="text-blue-100">Real-time translation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Users className="w-8 h-8 text-white mb-2 mx-auto" />
              <p className="text-white">50K+ Users</p>
              <p className="text-blue-100">Trusted worldwide</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <Shield className="w-8 h-8 text-white mb-2 mx-auto" />
              <p className="text-white">Enterprise Security</p>
              <p className="text-blue-100">SOC 2 compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Why Choose LinguaConnect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to provide world-class multilingual support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Real-time Translation</h3>
              <p className="text-gray-600">
                Instant AI-powered translation across 100+ languages with context awareness
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track conversations, popular languages, and customer satisfaction metrics
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Multilingual Knowledge Base</h3>
              <p className="text-gray-600">
                Automated FAQ translation and language-specific content management
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Sub-second response times powered by optimized AI models
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">
                End-to-end encryption and compliance with global data protection laws
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Multi-agent support with role-based access and conversation routing
              </p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}