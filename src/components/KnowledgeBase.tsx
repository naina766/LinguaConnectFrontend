import { useState } from 'react';
import { Search, ChevronRight, Globe, BookOpen, CreditCard, Wrench, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
}

export function KnowledgeBase() {
  const [selectedCategory, setSelectedCategory] = useState('account');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
  ];

  const categories = [
    { id: 'account', name: 'Account', icon: HelpCircle },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: Wrench },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'How do I create an account?',
      content: 'To create an account, click the "Sign Up" button in the top right corner. Fill in your email, create a password, and verify your email address. You\'ll be ready to start using LinguaConnect immediately.',
      category: 'account',
    },
    {
      id: '2',
      title: 'How do I reset my password?',
      content: 'Click on "Forgot Password" on the login page. Enter your email address, and we\'ll send you a secure link to reset your password. The link expires after 24 hours for security.',
      category: 'account',
    },
    {
      id: '3',
      title: 'Can I change my email address?',
      content: 'Yes! Go to Settings > Account > Email Address. Enter your new email and verify it through the confirmation link we\'ll send you. Your old email will remain active until verification is complete.',
      category: 'account',
    },
    {
      id: '4',
      title: 'What payment methods do you accept?',
      content: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through our encrypted payment gateway.',
      category: 'billing',
    },
    {
      id: '5',
      title: 'How do I upgrade my plan?',
      content: 'Navigate to Dashboard > Billing > Plans. Select your desired plan and click "Upgrade." Your new features will be activated immediately, and billing will be prorated for the current month.',
      category: 'billing',
    },
    {
      id: '6',
      title: 'What is your refund policy?',
      content: 'We offer a 30-day money-back guarantee for all plans. If you\'re not satisfied, contact our support team within 30 days of purchase for a full refund, no questions asked.',
      category: 'billing',
    },
    {
      id: '7',
      title: 'Translation not working correctly',
      content: 'First, ensure you\'ve selected the correct source and target languages. Clear your browser cache and try again. If the issue persists, check our Status Page for any ongoing incidents or contact support.',
      category: 'troubleshooting',
    },
    {
      id: '8',
      title: 'Chat interface is slow',
      content: 'Slow performance can be caused by network issues or browser extensions. Try disabling extensions, clearing cache, or using a different browser. Contact support if you\'re consistently experiencing delays over 2 seconds.',
      category: 'troubleshooting',
    },
    {
      id: '9',
      title: 'Messages not sending',
      content: 'Check your internet connection first. If connected, try refreshing the page. Verify that your account is active and not suspended. For persistent issues, check browser console for errors and report them to our support team.',
      category: 'troubleshooting',
    },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = article.category === selectedCategory;
    const matchesSearch = searchQuery
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];
  const currentCategory = categories.find(cat => cat.id === selectedCategory) || categories[0];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
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
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>{currentLanguage.flag}</span>
                  <span className="ml-1">{currentLanguage.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map(lang => (
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

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="pl-12 py-6 bg-white border-0 focus-visible:ring-2 focus-visible:ring-white/50"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
              <h3 className="text-gray-900 mb-4">Categories</h3>
              <nav className="space-y-1">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-[#007BFF]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{category.name}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-gray-100">
                  <BookOpen className="w-8 h-8 text-[#007BFF] mb-2" />
                  <p className="text-gray-900 mb-1">Need more help?</p>
                  <p className="text-gray-600 mb-3">
                    Chat with our AI support assistant
                  </p>
                  <Button className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white">
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-gray-900">{currentCategory.name}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <BookOpen className="w-5 h-5" />
                <span>{filteredArticles.length} articles</span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredArticles.map(article => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4">{article.content}</p>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                          <span className="text-[#007BFF]">
                            Translated to {currentLanguage.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => setSelectedLanguage(lang.code)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                            selectedLanguage === lang.code
                              ? 'bg-blue-50 ring-2 ring-[#007BFF]'
                              : 'hover:bg-gray-50'
                          }`}
                          title={lang.name}
                        >
                          <span>{lang.flag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or browse different categories
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
