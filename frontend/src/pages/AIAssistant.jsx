import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Loader2, Sparkles, Copy, BookOpen, TrendingUp, Droplets, Bug, DollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const AIAssistant = ({ onClose, userType = 'FARMER' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  // Popular crops
  const popularCrops = [
    { name: 'Rice', icon: '🌾', color: 'from-green-500 to-emerald-600' },
    { name: 'Wheat', icon: '🌾', color: 'from-amber-500 to-yellow-600' },
    { name: 'Tomato', icon: '🍅', color: 'from-red-500 to-rose-600' },
    { name: 'Potato', icon: '🥔', color: 'from-purple-500 to-violet-600' },
    { name: 'Cotton', icon: '👕', color: 'from-blue-500 to-cyan-600' },
    { name: 'Sugarcane', icon: '🎋', color: 'from-teal-500 to-emerald-600' },
    { name: 'Banana', icon: '🍌', color: 'from-yellow-500 to-amber-600' },
    { name: 'Mango', icon: '🥭', color: 'from-orange-500 to-amber-600' },
  ];

  useEffect(() => {
    let welcomeText = '';
    
    if (userType === 'BUYER') {
      welcomeText = `🤖 **BUYER'S AI ASSISTANT**\n\nI can help you with:\n• Crop nutrition information\n• Calories and health benefits\n• Best uses for each crop\n• Potential drawbacks/allergies\n• Market prices and quality tips\n• Storage and shelf life\n\n**Ask me:** "Nutritional value of apples" or "How to choose fresh vegetables"`;
    } else if (userType === 'FARMER') {
      welcomeText = `🤖 **FARMER'S AI ASSISTANT**\n\nPowered by Google Gemini AI. I will provide you with **COMPREHENSIVE** farming information including:\n\n📊 **Basic Information** - Category, season, duration\n🌱 **Growing Requirements** - Soil, climate, water needs\n🚜 **Cultivation Practices** - Land prep, sowing methods\n💧 **Irrigation Management** - Water requirements, schedule\n🧪 **Fertilizer Management** - NPK ratios, organic options\n🐛 **Pest & Disease Control** - Common issues, solutions\n💰 **Economic Analysis** - Costs, yield, profit margin\n⚠️ **Risks & Challenges** - Mitigation strategies\n✅ **Success Tips** - Best practices\n📍 **Regional Suitability** - Best states in India\n🌿 **Organic Farming** - Sustainable methods\n🚀 **Modern Technologies** - Latest advancements\n\n**Ask me about ANY crop:** "Tell me about Banana farming" or "How to grow Dragon Fruit?"`;
    } else if (userType === 'DISTRIBUTOR') {
      welcomeText = `🤖 **DISTRIBUTOR'S AI ASSISTANT**\n\nI can help you with:\n• Logistics optimization\n• Storage requirements\n• Transportation best practices\n• Market demand analysis\n• Shelf life management\n• Quality control\n\n**Ask me:** "Best way to transport tomatoes" or "Storage requirements for potatoes"`;
    } else {
      welcomeText = `🤖 **AI FARMING ASSISTANT**\n\nPowered by Google Gemini AI. I will provide you with **COMPREHENSIVE** farming information including:\n\n📊 **Basic Information** - Category, season, duration\n🌱 **Growing Requirements** - Soil, climate, water needs\n🚜 **Cultivation Practices** - Land prep, sowing methods\n💧 **Irrigation Management** - Water requirements, schedule\n🧪 **Fertilizer Management** - NPK ratios, organic options\n🐛 **Pest & Disease Control** - Common issues, solutions\n💰 **Economic Analysis** - Costs, yield, profit margin\n⚠️ **Risks & Challenges** - Mitigation strategies\n✅ **Success Tips** - Best practices\n📍 **Regional Suitability** - Best states in India\n🌿 **Organic Farming** - Sustainable methods\n🚀 **Modern Technologies** - Latest advancements\n\n**Ask me about ANY crop:** "Tell me about Banana farming" or "How to grow Dragon Fruit?"`;
    }
    
    const welcomeMsg = {
      id: 1,
      text: welcomeText,
      sender: 'ai',
      timestamp: new Date()
    };
    setConversation([welcomeMsg]);
  }, [userType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // GEMINI AI API Call - WORKS FOR ANY CROP
  const callGeminiAI = async (prompt) => {
    try {
      // ⚠️ GET YOUR GEMINI API KEY FROM: https://makersuite.google.com/app/apikey
      const GEMINI_API_KEY = 'AIzaSyDbH4ww2-UqqMkcy8Osmw6CrXaIliryEAs'; // Replace with your key
      
      console.log('Calling Gemini AI for:', prompt);
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are AGRI-GPT, an expert agricultural advisor for ${userType === 'BUYER' ? 'buyers' : userType === 'FARMER' ? 'farmers' : 'distributors'}. Provide ${userType === 'BUYER' ? 'nutritional and buying information' : userType === 'FARMER' ? 'COMPREHENSIVE farming information' : 'logistics and distribution information'} for "${prompt}" with these EXACT sections:

# 🌾 ${prompt.toUpperCase()} - COMPLETE FARMING GUIDE

## 📊 BASIC INFORMATION
- **Category:** 
- **Scientific Name:** 
- **Best Season in India:** 
- **Growth Duration:** 
- **Origin & History:** 

## 🌱 GROWING REQUIREMENTS
### Soil Requirements
- **Soil Type:** 
- **pH Range:** 
- **Soil Preparation:** 
- **Drainage Needs:** 

### Climate Needs
- **Temperature Range:** 
- **Rainfall Requirements:** 
- **Humidity:** 
- **Sunlight:** 
- **Frost Tolerance:** 

## 🚜 CULTIVATION PRACTICES
### Land Preparation
- **Field Preparation:** 
- **Bed Preparation:** 
- **Spacing Requirements:** 

### Sowing & Planting
- **Sowing Method:** 
- **Seed Rate:** 
- **Seed Treatment:** 
- **Transplanting Age:** 

### Intercropping & Rotation
- **Good Companion Crops:** 
- **Crop Rotation:** 
- **Intercropping Benefits:** 

## 💧 WATER MANAGEMENT
### Irrigation Requirements
- **Total Water Needs:** 
- **Water Requirements:** 
- **Critical Stages:** 
- **Drought Tolerance:** 

### Irrigation Methods
- **Recommended Methods:** 
- **Irrigation Schedule:** 
- **Water Conservation:** 

## 🧪 FERTILIZER MANAGEMENT
### Nutrient Requirements
- **NPK Ratio:** 
- **Micronutrients:** 
- **Soil Testing:** 

### Application Schedule
- **Basal Application:** 
- **Top Dressing:** 
- **Foliar Application:** 

### Organic Alternatives
- **Organic Manures:** 
- **Biofertilizers:** 
- **Green Manure:** 

## 🐛 PEST & DISEASE MANAGEMENT
### Common Pests (with details)
1. 

### Common Diseases (with details)
1. 

### Integrated Pest Management
- **Preventive Measures:** 
- **Monitoring:** 
- **Threshold Levels:** 
- **Biological Control:** 

## 📅 GROWTH TIMELINE
### Growth Stages
- **Germination:** 
- **Seedling Stage:** 
- **Vegetative Growth:** 
- **Flowering:** 
- **Fruit/Seed Development:** 
- **Maturity:** 

### Harvest Schedule
- **Optimal Harvest Time:** 
- **Harvesting Window:** 
- **Multiple Harvests:** 

## 🌾 HARVESTING & POST-HARVEST
### Harvesting Methods
- **Manual Harvesting:** 
- **Mechanical Harvesting:** 
- **Harvest Indicators:** 

### Post-Harvest Handling
- **Cleaning & Grading:** 
- **Drying Requirements:** 
- **Storage Conditions:** 
- **Packaging:** 
- **Transportation:** 

### Yield Information
- **Average Yield:** 
- **High-Yield Potential:** 
- **Factors Affecting Yield:** 

## 💰 ECONOMIC ANALYSIS (PER ACRE)
### Cost of Cultivation
- **Seed Cost:** ₹
- **Land Preparation:** ₹
- **Fertilizer Cost:** ₹
- **Pesticide Cost:** ₹
- **Irrigation Cost:** ₹
- **Labor Cost:** ₹
- **Miscellaneous:** ₹
- **TOTAL COST:** ₹

### Revenue & Profit
- **Expected Yield:** 
- **Market Price Range:** ₹
- **Total Revenue:** ₹
- **Net Profit:** ₹
- **Profit Margin:** %

### Market Information
- **Major Markets:** 
- **Price Trends:** 
- **Export Potential:** 
- **Government Schemes:** 

## ⚠️ RISKS & CHALLENGES
### Major Risks
1. 

### Common Challenges
- 

## ✅ SUCCESS TIPS FOR FARMERS
### For Beginners
1. 
2. 
3. 

### For Experienced Farmers
1. 
2. 
3. 

### Advanced Techniques
1. 
2. 
3. 

## 📍 REGIONAL SUITABILITY IN INDIA
### Highly Suitable Regions
- **States:** 
- **Reasons:** 
- **Best Varieties:** 

### Moderately Suitable Regions
- **States:** 
- **Limitations:** 
- **Adaptations Needed:** 

### Not Recommended Regions
- **Areas:** 
- **Reasons:** 
- **Alternatives:** 

## 🌿 ORGANIC FARMING
### Organic Practices
- **Soil Management:** 
- **Pest Management:** 
- **Disease Management:** 
- **Certification Process:** 

### Organic Inputs
- **Organic Fertilizers:** 
- **Biopesticides:** 
- **Yield Expectations:** 
- **Premium Pricing:** 

## 🚀 MODERN TECHNOLOGIES
### Precision Farming
- **Soil Sensors:** 
- **Drones:** 
- **IoT Devices:** 
- **Mobile Apps:** 

### Improved Varieties
- **High-Yielding Varieties:** 
- **Disease-Resistant:** 
- **Hybrid Varieties:** 
- **GM Varieties:** 

### Government Support
- **Schemes:** 
- **Training Programs:** 
- **Research Support:** 

Make information PRACTICAL, ACTIONABLE, and SPECIFIC to Indian farming conditions. Include current prices (use ₹), specific variety names, and local contact information. Provide data in metric units. Be detailed and comprehensive.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 0.95,
            maxOutputTokens: 4000,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      console.log('Gemini AI Response successful');
      return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
      console.error('Gemini AI Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      // Fallback: Try Hugging Face
      try {
        console.log('Trying Hugging Face fallback...');
        const hfResponse = await axios.post(
          'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
          {
            inputs: `Detailed farming guide for ${prompt} in India with all cultivation details.`,
            parameters: { max_length: 2000 }
          },
          { timeout: 30000 }
        );
        
        if (hfResponse.data && hfResponse.data[0]?.generated_text) {
          return hfResponse.data[0].generated_text;
        }
      } catch (hfError) {
        console.log('Hugging Face also failed');
      }

      // Ultimate structured fallback
      return generateDetailedFallback(prompt);
    }
  };

  // Smart fallback generator
  const generateDetailedFallback = (cropName) => {
    const cropsData = {
      'banana': {
        category: 'Fruit crop',
        season: 'Year-round in tropical regions',
        duration: '9-12 months',
        soil: 'Deep, well-drained loamy soil, pH 6.0-7.5',
        climate: 'Tropical, 15-35°C, humid',
        water: 'High (2000-2500mm annually)',
        yield: '25-40 tons/acre',
        cost: '₹1,50,000-2,00,000/acre',
        profit: '₹2,00,000-3,00,000/acre'
      },
      'rice': {
        category: 'Cereal crop',
        season: 'Kharif (June-September)',
        duration: '90-150 days',
        soil: 'Clay loam, pH 5.5-6.5',
        climate: '21-37°C, humid',
        water: 'High (1500-2000mm)',
        yield: '2000-3000 kg/acre',
        cost: '₹25,000-35,000/acre',
        profit: '₹15,000-25,000/acre'
      },
      'tomato': {
        category: 'Vegetable',
        season: 'October-February',
        duration: '90-120 days',
        soil: 'Well-drained loam, pH 6.0-7.0',
        climate: '15-30°C',
        water: 'Moderate',
        yield: '15-25 tons/acre',
        cost: '₹50,000-70,000/acre',
        profit: '₹1,00,000+/acre'
      },
      'wheat': {
        category: 'Cereal crop',
        season: 'Rabi (October-March)',
        duration: '120-150 days',
        soil: 'Loamy, pH 6.5-7.5',
        climate: '10-25°C',
        water: 'Medium (500-600mm)',
        yield: '2500-3500 kg/acre',
        cost: '₹20,000-30,000/acre',
        profit: '₹20,000-30,000/acre'
      }
    };

    const lowerCrop = cropName.toLowerCase();
    let data = null;
    
    for (const [key, value] of Object.entries(cropsData)) {
      if (lowerCrop.includes(key)) {
        data = value;
        break;
      }
    }

    if (!data) {
      data = {
        category: 'Agricultural crop',
        season: 'Depends on region and variety',
        duration: '90-180 days',
        soil: 'Well-drained fertile soil',
        climate: 'Temperate to tropical',
        water: 'Moderate irrigation needed',
        yield: 'Varies by cultivation practices',
        cost: '₹30,000-50,000/acre',
        profit: '₹50,000-1,00,000/acre'
      };
    }

    return `# 🌾 ${cropName.toUpperCase()} - FARMING GUIDE

## 📊 BASIC INFORMATION
- **Category:** ${data.category}
- **Best Season in India:** ${data.season}
- **Growth Duration:** ${data.duration}

## 🌱 GROWING REQUIREMENTS
- **Soil Type:** ${data.soil}
- **Climate:** ${data.climate}
- **Water Needs:** ${data.water}

## 🚜 CULTIVATION PRACTICES
- **Land Preparation:** Deep plowing, add organic manure
- **Sowing Method:** Direct seeding or transplanting
- **Spacing:** Varies by variety and region

## 💧 IRRIGATION
- **Requirements:** Regular irrigation needed
- **Method:** Drip or flood irrigation based on crop
- **Schedule:** Based on soil moisture and weather

## 🧪 FERTILIZER
- **NPK:** Balanced fertilizer application
- **Organic:** FYM, compost, vermicompost
- **Schedule:** Basal + top dressing applications

## 🐛 PEST CONTROL
- **Common Pests:** Monitor regularly
- **Organic Control:** Neem oil, biopesticides
- **Chemical:** Use as last resort

## 💰 ECONOMICS (PER ACRE)
- **Cost:** ${data.cost}
- **Yield:** ${data.yield}
- **Profit:** ${data.profit}

## ✅ SUCCESS TIPS
1. Use certified quality seeds
2. Regular pest monitoring
3. Proper irrigation scheduling
4. Soil testing before planting

## 📍 REGIONAL SUITABILITY
- **Best in:** Consult local agriculture department
- **Varieties:** Choose local adapted varieties

*Note: For detailed specific information, contact your nearest Krishi Vigyan Kendra (KVK) or State Agricultural University.*`;
  };

  const handleAsk = async (question = '') => {
    const questionToAsk = question || query.trim();
    if (!questionToAsk) return;

    // Add user message
    const userMsg = {
      id: conversation.length + 1,
      text: questionToAsk,
      sender: 'user',
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const aiResponse = await callGeminiAI(questionToAsk);
      
      // Add AI response
      const aiMsg = {
        id: conversation.length + 2,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, aiMsg]);
      
    } catch (error) {
      console.error('HandleAsk error:', error);
      
      const errorMsg = {
        id: conversation.length + 2,
        text: `⚠️ **Service Issue**\n\nPlease:\n1. Check if Gemini API key is set\n2. Try a different crop\n3. Contact support if persistent\n\n**For immediate help with ${questionToAsk}:**\n• Soil: Well-drained fertile soil recommended\n• Water: Regular irrigation needed\n• Fertilizer: Balanced NPK application\n• Harvest: At proper maturity stage`,
        sender: 'ai',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold text-green-700 mt-4 mb-2">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-bold text-green-600 mt-3 mb-2">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={i} className="text-lg font-semibold text-gray-800 mt-2 mb-1">{line.substring(4)}</h3>;
      } else if (line.startsWith('- **')) {
        const parts = line.split('**');
        return (
          <div key={i} className="flex items-start mt-1">
            <span className="mr-2 text-green-600">•</span>
            <span>
              <strong className="text-gray-900">{parts[1]}</strong>
              <span className="text-gray-700">{parts[2]}</span>
            </span>
          </div>
        );
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
        return (
          <div key={i} className="flex items-start mt-1 ml-4">
            <span className="mr-2 font-medium text-green-600">{line.substring(0, 2)}</span>
            <span className="text-gray-700">{line.substring(3)}</span>
          </div>
        );
      } else if (line.trim() === '') {
        return <div key={i} className="h-3" />;
      } else {
        return <div key={i} className="text-gray-700 mt-2">{line}</div>;
      }
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Farming guide copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {userType === 'BUYER' ? "Buyer's AI Assistant" : 
                   userType === 'FARMER' ? "Farmer's AI Assistant" : 
                   "Distributor's AI Assistant"}
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Powered by Gemini AI
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {userType === 'BUYER' ? 'Crop nutrition, prices, and buying insights' : 
                 userType === 'FARMER' ? 'Complete crop guidance for any crop worldwide' : 
                 'Logistics, storage, and distribution insights'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/3 border-r p-6 flex flex-col bg-gray-50 overflow-hidden">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ask about ANY crop
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Banana cultivation in India'"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                  disabled={loading}
                />
                <button
                  onClick={() => handleAsk()}
                  disabled={loading || !query.trim()}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Ask
                </button>
              </div>
            </div>

            {/* Popular Crops */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  Popular Crops
                </h3>
                <span className="text-xs text-gray-500">Try any crop!</span>
              </div>
              <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-48">
                {popularCrops.map((crop) => (
                  <button
                    key={crop.name}
                    onClick={() => handleAsk(`Complete guide for ${crop.name} farming`)}
                    disabled={loading}
                    className="border border-gray-200 rounded-lg p-3 text-center hover:bg-green-50 hover:border-green-300 disabled:opacity-50 transition-all bg-white group"
                  >
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{crop.icon}</div>
                    <div className="font-medium text-gray-900">{crop.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Complete Information Includes:
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">All cultivation aspects</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <Droplets className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Water & fertilizer details</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <Bug className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">Pest & disease control</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">Economic analysis</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-auto p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
              <h4 className="font-medium text-sm text-green-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Works for ANY Crop
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Global crop database</li>
                <li>• Indian farming conditions</li>
                <li>• Practical actionable advice</li>
                <li>• Current market information</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Conversation */}
          <div className="w-2/3 flex flex-col">
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Complete Farming Guide</h3>
              {conversation.length > 1 && (
                <button
                  onClick={() => setConversation([conversation[0]])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear chat
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-6">
                {conversation.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-5 ${msg.sender === 'ai' ? 'bg-white border border-green-200 shadow-sm' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 ml-auto max-w-[80%]'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${msg.sender === 'ai' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {msg.sender === 'ai' ? (
                            <Bot className="h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-sm font-medium text-blue-600">You</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => handleCopy(msg.text)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy farming guide"
                        >
                          <Copy className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                    </div>
                    <div className="text-gray-800 leading-relaxed">
                      {formatText(msg.text)}
                    </div>
                  </motion.div>
                ))}
                
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl p-5 bg-white border border-green-200 shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Generating complete farming guide...</p>
                        <p className="text-xs text-gray-500">Using Gemini AI for comprehensive information</p>
                        <div className="w-48 h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-green-500 animate-pulse" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAssistant;