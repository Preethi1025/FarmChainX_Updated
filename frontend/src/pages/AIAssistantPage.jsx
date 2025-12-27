import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FreeAIAgent from './FreeAIAgent';
import { ArrowLeft, Bot, Sparkles, Globe, Shield, TrendingUp, MessageCircle, Zap, BookOpen, Brain, Leaf } from 'lucide-react';

const AIAssistantPage = () => {
  const navigate = useNavigate();

  const exampleQuestions = [
    "What are the best practices for organic tomato farming?",
    "How to prevent common rice diseases?",
    "What is the ideal soil pH for potatoes?",
    "How much water does spinach need?",
    "What are the current market prices for wheat?",
    "How to store apples for longer shelf life?"
  ];

  const handleExampleClick = (question) => {
    // You can implement auto-fill functionality here if needed
    console.log("Example question:", question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={18} />
                <span className="font-medium hidden sm:inline">Back</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl shadow-lg">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FarmChainX AI Assistant</h1>
                  <p className="text-sm text-gray-600 hidden md:block">Powered by Groq AI • Real-time crop insights</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-full border border-primary-200">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary-700">Live AI Assistant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Instructions & Examples */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">AI Stats</h3>
                <Brain className="text-primary-600" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Queries Today</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-semibold text-emerald-600">~2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className="font-semibold text-blue-600">95%</span>
                </div>
              </div>
            </div>

            {/* Example Questions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-yellow-500" size={20} />
                <h3 className="font-semibold text-gray-900">Try These Examples</h3>
              </div>
              <div className="space-y-3">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-primary-600 mt-0.5">💡</span>
                      <span className="text-sm text-gray-700 group-hover:text-primary-700">
                        {question}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl shadow-lg border border-primary-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What Can I Help With?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Leaf className="text-emerald-600" size={16} />
                  </div>
                  <span className="text-sm text-gray-700">Crop Cultivation Tips</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <TrendingUp className="text-blue-600" size={16} />
                  </div>
                  <span className="text-sm text-gray-700">Market Price Analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Shield className="text-purple-600" size={16} />
                  </div>
                  <span className="text-sm text-gray-700">Disease Prevention</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <BookOpen className="text-amber-600" size={16} />
                  </div>
                  <span className="text-sm text-gray-700">Nutritional Information</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main AI Assistant Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
              <div className="p-6">
                {/* Welcome Message */}
                <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <MessageCircle className="text-primary-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Hello! I'm your Farming Assistant 🤖</h2>
                      <p className="text-gray-600 mt-1">
                        Ask me anything about crops, farming techniques, market insights, or agricultural best practices.
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Agent Component */}
                <div className="mb-6">
                  <FreeAIAgent />
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="text-blue-600" size={18} />
                        <h4 className="font-semibold text-gray-900">Real-time Data</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Access current market prices and agricultural trends updated in real-time.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="text-emerald-600" size={18} />
                        <h4 className="font-semibold text-gray-900">Global Knowledge</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Trained on global agricultural databases and expert farming knowledge.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-purple-600" size={18} />
                        <h4 className="font-semibold text-gray-900">Verified Information</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        All responses are cross-verified with trusted agricultural sources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-primary-100 to-emerald-100 border border-primary-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Pro Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <span className="text-primary-600 mt-0.5">1</span>
                <div>
                  <h4 className="font-medium text-gray-900">Be Specific</h4>
                  <p className="text-sm text-gray-600">
                    Include crop variety, region, and specific concerns for more accurate answers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary-600 mt-0.5">2</span>
                <div>
                  <h4 className="font-medium text-gray-900">Ask Follow-ups</h4>
                  <p className="text-sm text-gray-600">
                    Our AI remembers context, so ask follow-up questions for detailed discussions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              FarmChainX AI Assistant • Powered by Groq AI • Always Free for Farmers & Buyers
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Note: This is a free service with rate limits. For commercial use, contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;