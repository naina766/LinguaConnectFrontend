import { ArrowRight, User, Globe, Brain, MessageSquare, Zap, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'User Sends Message',
      description: 'Customer writes a message in their native language',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      detail: 'User can type in any of 100+ supported languages without changing settings',
    },
    {
      id: 2,
      title: 'Lingo Translate',
      description: 'Message is translated using Lingo CLI AI',
      icon: Globe,
      color: 'from-purple-500 to-purple-600',
      detail: 'Advanced neural translation with context awareness and cultural nuances',
    },
    {
      id: 3,
      title: 'AI Processing',
      description: 'AI assistant understands and processes the request',
      icon: Brain,
      color: 'from-pink-500 to-pink-600',
      detail: 'Natural language understanding with intent recognition and sentiment analysis',
    },
    {
      id: 4,
      title: 'Lingo Translate Back',
      description: 'Response is translated to user\'s language',
      icon: Globe,
      color: 'from-orange-500 to-orange-600',
      detail: 'Maintains tone, context, and technical accuracy across languages',
    },
    {
      id: 5,
      title: 'User Receives Reply',
      description: 'Customer gets response in their native language',
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      detail: 'Seamless experience with instant delivery and conversation history',
    },
  ];

  const features = [
    {
      title: 'Real-time Translation',
      description: 'Sub-second translation powered by advanced AI models',
      icon: Zap,
    },
    {
      title: 'Context Awareness',
      description: 'Understands conversation context and maintains consistency',
      icon: Brain,
    },
    {
      title: 'Cultural Adaptation',
      description: 'Respects cultural nuances and local expressions',
      icon: Globe,
    },
    {
      title: 'Quality Assurance',
      description: 'Continuous learning and improvement from user feedback',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F6FA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#007BFF] to-[#00B5AD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-4">How It Works</h1>
          <p className="text-blue-100 max-w-2xl mx-auto">
            See how LinguaConnect breaks down language barriers using AI-powered translation and intelligent conversation flow
          </p>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          {/* Desktop Flow */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="relative">
                      {/* Step Card */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 w-56 hover:shadow-xl transition-shadow">
                        <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-center mb-3">
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mb-2">
                            <span className="text-gray-900">{step.id}</span>
                          </div>
                        </div>
                        <h3 className="text-gray-900 text-center mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-center mb-4">{step.description}</p>
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-gray-100">
                          <p className="text-gray-600">{step.detail}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="flex items-center mx-4">
                        <ArrowRight className="w-8 h-8 text-[#007BFF]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Flow */}
          <div className="lg:hidden space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id}>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                    <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center mb-3">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full mb-2">
                        <span className="text-gray-900">{step.id}</span>
                      </div>
                    </div>
                    <h3 className="text-gray-900 text-center mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-center mb-4">{step.description}</p>
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-3 border border-gray-100">
                      <p className="text-gray-600">{step.detail}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-4">
                      <ArrowRight className="w-8 h-8 text-[#007BFF] transform rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-gray-900 mb-4">Powered by Advanced Technology</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform leverages cutting-edge AI to deliver exceptional multilingual experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#007BFF] to-[#00B5AD] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technical Specs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="mb-6">Technical Specifications</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">100+ Languages Supported</p>
                    <p className="text-gray-400">Including major world languages and regional dialects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">Sub-second Response Time</p>
                    <p className="text-gray-400">Average translation and processing under 1.2 seconds</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">99.9% Uptime SLA</p>
                    <p className="text-gray-400">Enterprise-grade reliability and availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">ISO 27001 Certified</p>
                    <p className="text-gray-400">Industry-standard security and compliance</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-6">Integration & APIs</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">RESTful API</p>
                    <p className="text-gray-400">Easy integration with your existing systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">WebSocket Support</p>
                    <p className="text-gray-400">Real-time bidirectional communication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">SDK Available</p>
                    <p className="text-gray-400">JavaScript, Python, Ruby, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white">Webhook Events</p>
                    <p className="text-gray-400">Real-time notifications for key events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span>Powered by Lingo CLI - Next-generation AI Translation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
