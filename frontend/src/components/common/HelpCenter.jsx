// HelpCenter.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  ChevronDown, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  ShoppingCart, 
  Truck, 
  Shield, 
  CreditCard, 
  User,
  HelpCircle,
  BookOpen,
  BarChart,
  Smartphone,
  Download,
  Video,
  Star,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './HelpCenter.css';

const HelpCenter = ({ userType, userId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactTopic, setContactTopic] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Learn how to set up your account and navigate the platform'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      description: 'Buying and selling agricultural products'
    },
    {
      id: 'traceability',
      title: 'Traceability',
      icon: <Truck className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Track product journey from farm to table'
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Payment processing and financial questions'
    },
    {
      id: 'account',
      title: 'Account & Security',
      icon: <Shield className="h-6 w-6" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      description: 'Manage your account and security settings'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'App issues and technical troubleshooting'
    }
  ];

  const faqs = {
    'getting-started': [
      {
        id: 'gs-1',
        question: 'How do I create an account on FarmChainX?',
        answer: 'To create an account:\n\n1. Click "Sign Up" on the homepage\n2. Select your role (Farmer/Producer or Buyer)\n3. Fill in your business details\n4. Verify your email address\n5. Complete your profile with required documentation\n\nFarmers need to provide agricultural business registration, while buyers need business identification.',
        tags: ['account', 'registration', 'setup']
      },
      {
        id: 'gs-2',
        question: 'What are the different user types and their permissions?',
        answer: 'FarmChainX offers three main user types:\n\n• **Farmers/Producers**: Can list products, manage inventory, and track shipments\n• **Buyers/Distributors**: Can browse marketplace, place orders, and track deliveries\n• **Logistics Partners**: Can manage transportation and update traceability data\n\nEach role has specific permissions tailored to their needs in the agricultural supply chain.',
        tags: ['roles', 'permissions', 'users']
      },
      {
        id: 'gs-3',
        question: 'How do I complete my business verification?',
        answer: 'Business verification is required for all commercial accounts:\n\n**For Farmers:**\n- Agricultural business license\n- Land ownership/lease documents\n- Quality certifications (optional)\n\n**For Buyers:**\n- Business registration\n- Tax identification number\n- Purchase authorization documents\n\nUpload documents in your account settings under "Business Verification". Verification typically takes 1-2 business days.',
        tags: ['verification', 'business', 'documents']
      }
    ],
    'marketplace': [
      {
        id: 'mp-1',
        question: 'How do I list products for sale as a farmer?',
        answer: 'To list products:\n\n1. Go to "My Products" in your dashboard\n2. Click "Add New Product"\n3. Fill in product details (name, category, quantity)\n4. Set pricing and minimum order quantity\n5. Upload product images\n6. Add traceability information\n7. Set delivery options\n8. Publish listing\n\nProducts go live immediately and are visible to all verified buyers.',
        tags: ['listing', 'products', 'selling']
      },
      {
        id: 'mp-2',
        question: 'What are the commission fees for transactions?',
        answer: 'FarmChainX charges the following fees:\n\n• **Transaction Fee**: 3% of total order value\n• **Payment Processing**: 2.9% + $0.30 per transaction\n• **Premium Features**: Optional subscription plans available\n\nFees are automatically deducted from payments. Farmers receive net amount after fees. No listing fees or monthly charges for basic accounts.',
        tags: ['fees', 'commission', 'pricing']
      },
      {
        id: 'mp-3',
        question: 'How do I handle disputes with buyers/sellers?',
        answer: 'Dispute Resolution Process:\n\n1. **Direct Resolution**: Try to resolve directly with the other party within 48 hours\n2. **Platform Mediation**: If unresolved, open a dispute ticket from the order page\n3. **Evidence Submission**: Provide photos, documents, or communication records\n4. **Platform Decision**: FarmChainX team reviews and makes binding decision\n5. **Resolution**: Refund or compensation as determined\n\nAll disputes must be raised within 7 days of delivery.',
        tags: ['disputes', 'resolution', 'conflicts']
      }
    ],
    'traceability': [
      {
        id: 'tr-1',
        question: 'How does the blockchain traceability work?',
        answer: 'Our traceability system:\n\n1. **Data Recording**: Each product gets a unique QR code linked to blockchain\n2. **Milestone Updates**: Farmers log planting, harvesting, and processing data\n3. **Transport Tracking**: Logistics partners update location and conditions\n4. **Quality Checks**: Temperature, humidity, and handling data recorded\n5. **End-to-End Visibility**: Buyers scan QR code for complete journey history\n\nAll data is immutable and timestamped on the blockchain for transparency.',
        tags: ['blockchain', 'tracking', 'transparency']
      },
      {
        id: 'tr-2',
        question: 'What traceability data is visible to buyers?',
        answer: 'Buyers can access:\n\n• **Farm Details**: Location, farmer information, farming practices\n• **Growing Data**: Planting date, harvest date, organic certifications\n• **Processing**: Cleaning, packaging, quality control results\n• **Transport**: Real-time location, temperature logs, handling\n• **Certifications**: Organic, fair trade, sustainability certificates\n\nSensitive farm location data is anonymized for security.',
        tags: ['data', 'visibility', 'buyers']
      }
    ],
    'payments': [
      {
        id: 'pb-1',
        question: 'What payment methods are accepted?',
        answer: 'Accepted Payment Methods:\n\n• Credit/Debit Cards (Visa, MasterCard, American Express)\n• Bank Transfers (ACH)\n• Digital Wallets (PayPal, Apple Pay, Google Pay)\n• Wire Transfers (for large orders)\n• FarmChainX Wallet (platform credit system)\n\nAll payments are processed through secure, PCI-compliant gateways.',
        tags: ['payments', 'methods', 'security']
      },
      {
        id: 'pb-2',
        question: 'When do farmers receive payment for orders?',
        answer: 'Payment Schedule:\n\n1. **Order Placed**: Buyer payment held in escrow\n2. **Order Confirmed**: Farmer accepts order\n3. **Order Shipped**: Payment remains in escrow\n4. **Delivery Confirmed**: Payment released to farmer (minus fees)\n5. **Funds Available**: Within 1-3 business days to bank account\n\nFarmers can track payment status in their dashboard.',
        tags: ['payouts', 'timing', 'escrow']
      }
    ]
  };

  const popularArticles = [
    { id: 'pa-1', title: 'Setting Up Your Farm Profile', category: 'getting-started', views: 1245 },
    { id: 'pa-2', title: 'Understanding Quality Grading', category: 'marketplace', views: 892 },
    { id: 'pa-3', title: 'QR Code Traceability Guide', category: 'traceability', views: 1567 },
    { id: 'pa-4', title: 'Payment Processing Timeline', category: 'payments', views: 743 },
    { id: 'pa-5', title: 'Two-Factor Authentication Setup', category: 'account', views: 621 },
  ];

  const quickActions = [
    { icon: <Download />, label: 'Download User Guides', action: () => window.open('/guides', '_blank') },
    { icon: <Video />, label: 'Watch Tutorial Videos', action: () => navigate('/tutorials') },
    { icon: <FileText />, label: 'View Documentation', action: () => window.open('/docs', '_blank') },
    { icon: <MessageSquare />, label: 'Live Chat Support', action: () => setShowContactForm(true) },
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = Object.entries(faqs).reduce((acc, [category, categoryFaqs]) => {
    if (activeCategory !== 'all' && activeCategory !== category) return acc;
    
    const filtered = categoryFaqs.filter(faq => 
      searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {});

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setExpandedFaqs(prev => ({ ...prev, [location.hash.substring(1)]: true }));
      }
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Focus on first result if found
      const firstResult = Object.values(filteredFaqs)[0]?.[0];
      if (firstResult) {
        navigate(`#${firstResult.id}`);
      }
    }
  };

  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  const handleContactClick = (topic) => {
    setContactTopic(topic);
    setShowContactForm(true);
  };

  const renderContactForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Contact Support</h3>
            <button 
              onClick={() => setShowContactForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={contactTopic}
                onChange={(e) => setContactTopic(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="What do you need help with?"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Please describe your issue in detail..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option>Low - General Inquiry</option>
                <option>Medium - Functional Issue</option>
                <option>High - Transaction Problem</option>
                <option>Critical - Security Concern</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex space-x-3">
            <button
              onClick={() => setShowContactForm(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Support ticket created successfully! We\'ll contact you within 24 hours.');
                setShowContactForm(false);
              }}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="help-center bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">Help Center</h1>
            </div>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Find answers, guides, and resources to make the most of FarmChainX platform
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers, guides, or topics..."
                  className="w-full px-6 py-4 pl-14 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-sm text-primary-200">Try searching for:</span>
                {['payments', 'traceability', 'account setup', 'shipping', 'verification'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1,245</p>
                <p className="text-sm text-gray-600">Articles</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">98.7%</p>
                <p className="text-sm text-gray-600">Resolution Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Support Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                <p className="text-sm text-gray-600">Satisfaction Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-lg ${activeCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`cursor-pointer group ${activeCategory === category.id ? 'ring-2 ring-primary-500' : ''}`}
              >
                <div className={`${category.bgColor} p-6 rounded-2xl transition-all duration-300 group-hover:shadow-lg h-full`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.title}</h3>
                      <p className="text-gray-600 text-sm">{category.description}</p>
                      <div className="mt-4">
                        <span className="inline-flex items-center text-sm text-primary-600 group-hover:text-primary-700">
                          Browse articles
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularArticles.map((article) => {
              const category = helpCategories.find(c => c.id === article.category);
              return (
                <Link
                  key={article.id}
                  to={`#${article.id}`}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 block"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${category?.bgColor}`}>
                      {category?.icon && React.cloneElement(category.icon, { className: "h-5 w-5" })}
                    </div>
                    <span className="text-sm text-gray-500">{article.views} views</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {category?.description}
                  </p>
                  <span className="inline-flex items-center text-sm text-primary-600">
                    Read article
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
              {activeCategory !== 'all' && (
                <span className="text-primary-600 ml-2">
                  • {helpCategories.find(c => c.id === activeCategory)?.title}
                </span>
              )}
            </h2>
            {searchQuery && (
              <p className="text-gray-600">
                Found {Object.values(filteredFaqs).flat().length} results for "{searchQuery}"
              </p>
            )}
          </div>

          {Object.keys(filteredFaqs).length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any articles matching "{searchQuery}". Try different keywords or browse by category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  searchInputRef.current?.focus();
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            Object.entries(filteredFaqs).map(([categoryId, categoryFaqs]) => (
              <div key={categoryId} className="mb-10">
                {activeCategory === 'all' && (
                  <div className="flex items-center mb-6">
                    <div className={`p-2 rounded-lg ${helpCategories.find(c => c.id === categoryId)?.bgColor} mr-3`}>
                      {helpCategories.find(c => c.id === categoryId)?.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {helpCategories.find(c => c.id === categoryId)?.title}
                    </h3>
                  </div>
                )}
                
                <div className="space-y-4">
                  {categoryFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      id={faq.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="bg-primary-100 text-primary-700 rounded-lg p-2 mr-4">
                            <HelpCircle className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {faq.tags.map(tag => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-gray-400 transition-transform ${expandedFaqs[faq.id] ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {expandedFaqs[faq.id] && (
                        <div className="px-6 pb-4">
                          <div className="pl-14 prose prose-sm max-w-none">
                            {faq.answer.split('\n\n').map((paragraph, idx) => (
                              <p key={idx} className="text-gray-700 mb-3">
                                {paragraph.split('\n').map((line, lineIdx) => (
                                  <React.Fragment key={lineIdx}>
                                    {line}
                                    {lineIdx < paragraph.split('\n').length - 1 && <br />}
                                  </React.Fragment>
                                ))}
                              </p>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div className="flex space-x-4">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${faq.id}`);
                                  alert('Link copied to clipboard!');
                                }}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                Copy link
                              </button>
                              <button
                                onClick={() => handleContactClick(faq.question)}
                                className="text-sm text-primary-600 hover:text-primary-700"
                              >
                                Still need help?
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated 2 days ago
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center">
                    <div className="bg-primary-100 text-primary-700 p-3 rounded-lg mr-4 group-hover:bg-primary-200 transition-colors">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {index === 0 && 'PDF guides for all user types'}
                        {index === 1 && 'Step-by-step video tutorials'}
                        {index === 2 && 'Technical documentation and API'}
                        {index === 3 && 'Chat with our support team'}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-primary-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white rounded-2xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-white/20 p-3 rounded-xl mr-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Still Need Help?</h2>
            </div>
            
            <p className="text-primary-100 mb-8">
              Our support team is ready to assist you with any questions or issues.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-primary-200 text-sm">Available 24/7</p>
                </div>
                <button
                  onClick={() => handleContactClick('Live Chat Inquiry')}
                  className="ml-auto bg-white text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Start Chat
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-primary-200 text-sm">+91 9686322533</p>
                </div>
                <button
                  onClick={() => window.location.href = 'tel:+91 9686322533'}
                  className="ml-auto border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Call Now
                </button>
              </div>
              
              <div className="flex items-center">
                <div className="bg-white/10 p-3 rounded-lg mr-4">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-primary-200 text-sm">support@farmchainx.com</p>
                </div>
                <button
                  onClick={() => window.location.href = 'mailto:support@farmchainx.com'}
                  className="ml-auto border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Send Email
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <h4 className="font-semibold mb-3">Response Time Guarantee</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="font-semibold">Urgent Issues</div>
                  <div className="text-primary-200">Under 1 hour</div>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <div className="font-semibold">General Support</div>
                  <div className="text-primary-200">Within 24 hours</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-primary-900 text-white rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Connect with other farmers, buyers, and agricultural experts. Share experiences, 
              learn best practices, and grow together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/community/forum')}
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Visit Community Forum
              </button>
              <button
                onClick={() => navigate('/webinars')}
                className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                View Upcoming Webinars
              </button>
            </div>
          </div>
        </div>
      </div>

      {showContactForm && renderContactForm()}
    </div>
  );
};

export default HelpCenter;