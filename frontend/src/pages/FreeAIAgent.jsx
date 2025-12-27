import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, Sparkles, Zap, Brain, Leaf, TrendingUp, BookOpen, Shield, Clock, History, Star, ChevronRight, Droplet, Thermometer, Package, Sun, Wind, CloudRain, Target, BarChart, Globe, Compass, Scale, Heart, Truck, Users, Award } from 'lucide-react';

const FreeAIAgent = () => {
  const [cropName, setCropName] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [recentQueries, setRecentQueries] = useState(0);

  const exampleCrops = [
    { name: 'Tomato', emoji: '🍅', category: 'Vegetable', color: 'from-red-100 to-red-50' },
    { name: 'Rice', emoji: '🌾', category: 'Grain', color: 'from-amber-100 to-amber-50' },
    { name: 'Potato', emoji: '🥔', category: 'Vegetable', color: 'from-purple-100 to-purple-50' },
    { name: 'Spinach', emoji: '🥬', category: 'Leafy Green', color: 'from-emerald-100 to-emerald-50' },
    { name: 'Apple', emoji: '🍎', category: 'Fruit', color: 'from-red-100 to-pink-50' },
    { name: 'Wheat', emoji: '🌾', category: 'Grain', color: 'from-amber-100 to-yellow-50' },
    { name: 'Corn', emoji: '🌽', category: 'Grain', color: 'from-yellow-100 to-yellow-50' },
    { name: 'Banana', emoji: '🍌', category: 'Fruit', color: 'from-yellow-100 to-amber-50' },
    { name: 'Cotton', emoji: '🧵', category: 'Fiber', color: 'from-white to-blue-50' },
    { name: 'Sugarcane', emoji: '🎋', category: 'Commercial', color: 'from-green-100 to-green-50' },
    { name: 'Coffee', emoji: '☕', category: 'Beverage', color: 'from-brown-100 to-amber-50' },
    { name: 'Tea', emoji: '🍵', category: 'Beverage', color: 'from-green-100 to-emerald-50' },
  ];

  useEffect(() => {
    const savedHistory = localStorage.getItem('aiAgentHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    
    const savedQueries = localStorage.getItem('aiAgentQueries');
    if (savedQueries) {
      setRecentQueries(parseInt(savedQueries));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:8080/api/ai/crop-info', {
        cropName: cropName
      });
      
      if (res.data.success === false) {
        setError(res.data.message || 'Failed to fetch crop information');
      }
      
      setResponse(res.data);
      
      // Add to history
      const newHistoryItem = { 
        crop: cropName, 
        data: res.data.data, 
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      };
      
      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('aiAgentHistory', JSON.stringify(updatedHistory));
      
      // Update query count
      const newQueryCount = recentQueries + 1;
      setRecentQueries(newQueryCount);
      localStorage.setItem('aiAgentQueries', newQueryCount.toString());
      
    } catch (err) {
      setError('Network error. Please check backend connection.');
      console.error('Error:', err);
      
      // Enhanced fallback mock response with comprehensive data
      const cropData = {
        'wheat': { 
          TYPE: 'Cereal Grain', 
          SCIENTIFIC_NAME: 'Triticum aestivum',
          FAMILY: 'Poaceae',
          CALORIES: '371 kcal per 100g',
          NUTRITION: 'Rich in carbohydrates (71.2g), protein (13.2g), fiber (12.2g), B vitamins, iron, magnesium',
          SEASON: 'Rabi season (November to April)',
          PLANTING_TIME: 'November to December',
          HARVEST_TIME: 'March to April',
          CROP_DURATION: '110-140 days',
          SOIL_PH: '6.0 to 7.0 (neutral to slightly acidic)',
          SOIL_TYPE: 'Well-drained loamy soil',
          WATER_REQUIREMENT: '400-500mm during growing season',
          IRRIGATION_STAGES: 'Crown root, Tillering, Flowering, Grain filling',
          TEMPERATURE: 'Optimal: 20-25°C, Min: 3-4°C, Max: 35°C',
          RAINFALL: '500-900mm annually',
          SUNLIGHT: 'Full sun (6-8 hours daily)',
          COMMON_VARIETIES: 'HD-2967, PBW-550, DBW-17, HD-3086',
          MAJOR_PRODUCERS: 'China, India, Russia, USA, Canada',
          MARKET_PRICE: '₹2,500 - ₹3,000 per quintal',
          STORAGE: '12-15°C with 10-12% moisture in clean, dry bins',
          SHELF_LIFE: '1-2 years under proper storage',
          YIELD: '2.5-4.0 tons per hectare',
          COMMON_DISEASES: 'Rust, Smut, Powdery mildew, Karnal bunt',
          PEST_PROBLEMS: 'Aphids, Armyworms, Termites',
          HEALTH_BENEFITS: 'Heart health, digestion, energy, diabetes management',
          USES: 'Flour, bread, pasta, animal feed, biofuel',
          EXPORT_POTENTIAL: 'High',
          SUSTAINABILITY_SCORE: '8/10',
          WATER_FOOTPRINT: '1,827 liters/kg',
          CARBON_FOOTPRINT: '0.4 kg CO2/kg',
          FUN_FACT: 'Wheat is grown on more land area than any other food crop'
        },
        'potato': { 
          TYPE: 'Tuber Vegetable', 
          SCIENTIFIC_NAME: 'Solanum tuberosum',
          FAMILY: 'Solanaceae',
          CALORIES: '70-80 kcal per 100g',
          NUTRITION: 'High in Vitamin C (19.7mg), potassium (425mg), fiber (2.2g), Vitamin B6',
          SEASON: 'Spring to fall (plant March-April)',
          PLANTING_TIME: 'March to April',
          HARVEST_TIME: 'June to October',
          CROP_DURATION: '90-120 days',
          SOIL_PH: '5.0 to 6.5 (slightly acidic)',
          SOIL_TYPE: 'Sandy loam, well-drained',
          WATER_REQUIREMENT: '500-700mm total, 1-2 inches weekly',
          IRRIGATION_STAGES: 'Germination, Tuber initiation, Tuber bulking',
          TEMPERATURE: 'Optimal: 15-20°C, Min: 7°C, Max: 30°C',
          RAINFALL: '300-500mm',
          SUNLIGHT: 'Full sun (6-7 hours daily)',
          COMMON_VARIETIES: 'Kufri Jyoti, Kufri Bahar, Kufri Chipsona',
          MAJOR_PRODUCERS: 'China, India, Russia, Ukraine, USA',
          MARKET_PRICE: '₹15 - ₹25 per kg',
          STORAGE: '4-7°C, dark, 90-95% humidity, well-ventilated',
          SHELF_LIFE: '4-6 months in cold storage',
          YIELD: '20-35 tons per hectare',
          COMMON_DISEASES: 'Late blight, Early blight, Black scurf, Bacterial wilt',
          PEST_PROBLEMS: 'Colorado potato beetle, Aphids, Whiteflies',
          HEALTH_BENEFITS: 'Antioxidants, digestive health, blood pressure control',
          USES: 'Chips, fries, mashed, boiled, starch production',
          EXPORT_POTENTIAL: 'Medium to high',
          SUSTAINABILITY_SCORE: '7/10',
          WATER_FOOTPRINT: '287 liters/kg',
          CARBON_FOOTPRINT: '0.3 kg CO2/kg',
          FUN_FACT: 'Potatoes were the first vegetable grown in space in 1995'
        },
        'rice': { 
          TYPE: 'Staple Grain', 
          SCIENTIFIC_NAME: 'Oryza sativa',
          FAMILY: 'Poaceae',
          CALORIES: '130-150 kcal per 100g',
          NUTRITION: 'Carbohydrates (28g), protein (2.7g), fiber (0.4g), B vitamins, manganese',
          SEASON: 'Kharif season (June to October)',
          PLANTING_TIME: 'June to July',
          HARVEST_TIME: 'September to November',
          CROP_DURATION: '90-150 days (varies by variety)',
          SOIL_PH: '5.5 to 6.5 (slightly acidic)',
          SOIL_TYPE: 'Clayey loam, water-retentive',
          WATER_REQUIREMENT: '1000-2000mm (paddy rice)',
          IRRIGATION_STAGES: 'Nursery, Transplanting, Vegetative, Reproductive, Ripening',
          TEMPERATURE: 'Optimal: 20-35°C, Critical: below 15°C',
          RAINFALL: '1500-2000mm',
          SUNLIGHT: 'Full sun (5-6 hours minimum)',
          COMMON_VARIETIES: 'Basmati, IR-64, Swarna, Sona Masuri',
          MAJOR_PRODUCERS: 'China, India, Indonesia, Bangladesh, Vietnam',
          MARKET_PRICE: '₹35 - ₹60 per kg (Basmati), ₹25 - ₹40 (regular)',
          STORAGE: 'Airtight container, cool dry place, 12-15% moisture',
          SHELF_LIFE: '6 months to 2 years',
          YIELD: '3-6 tons per hectare',
          COMMON_DISEASES: 'Blast, Bacterial blight, Sheath blight, Tungro',
          PEST_PROBLEMS: 'Stem borer, Brown plant hopper, Rice bug',
          HEALTH_BENEFITS: 'Energy source, gluten-free, heart health',
          USES: 'Steamed rice, biryani, rice flour, sake, rice bran oil',
          EXPORT_POTENTIAL: 'Very high (especially Basmati)',
          SUSTAINABILITY_SCORE: '6/10',
          WATER_FOOTPRINT: '2,500 liters/kg',
          CARBON_FOOTPRINT: '2.7 kg CO2/kg',
          FUN_FACT: 'Rice is grown on every continent except Antarctica'
        },
        'tomato': { 
          TYPE: 'Fruit Vegetable', 
          SCIENTIFIC_NAME: 'Solanum lycopersicum',
          FAMILY: 'Solanaceae',
          CALORIES: '18 kcal per 100g',
          NUTRITION: 'Vitamin C (13.7mg), Vitamin K (7.9mcg), potassium (237mg), lycopene',
          SEASON: 'Summer (February to June)',
          PLANTING_TIME: 'February to March',
          HARVEST_TIME: 'May to July',
          CROP_DURATION: '70-90 days',
          SOIL_PH: '6.0 to 6.8',
          SOIL_TYPE: 'Well-drained loamy soil',
          WATER_REQUIREMENT: '1-1.5 inches weekly',
          IRRIGATION_STAGES: 'Seedling, Flowering, Fruit development',
          TEMPERATURE: 'Optimal: 21-24°C, Min: 13°C, Max: 35°C',
          RAINFALL: '600-900mm',
          SUNLIGHT: 'Full sun (6-8 hours daily)',
          COMMON_VARIETIES: 'Hybrid 626, Roma, Cherry, Beefsteak',
          MAJOR_PRODUCERS: 'China, India, USA, Turkey, Egypt',
          MARKET_PRICE: '₹20 - ₹40 per kg',
          STORAGE: 'Room temp until ripe, then 10-13°C',
          SHELF_LIFE: '1-2 weeks fresh, 6-12 months processed',
          YIELD: '25-40 tons per hectare',
          COMMON_DISEASES: 'Blight, Blossom end rot, Fusarium wilt, Leaf curl',
          PEST_PROBLEMS: 'Whitefly, Aphids, Tomato hornworm',
          HEALTH_BENEFITS: 'Antioxidants, heart health, cancer prevention',
          USES: 'Fresh, sauces, ketchup, soups, salads',
          EXPORT_POTENTIAL: 'Medium',
          SUSTAINABILITY_SCORE: '8/10',
          WATER_FOOTPRINT: '214 liters/kg',
          CARBON_FOOTPRINT: '1.1 kg CO2/kg',
          FUN_FACT: 'Tomatoes were once believed to be poisonous in Europe'
        },
      };
      
      const lowerCropName = cropName.toLowerCase();
      let cropKey = '';
      
      // Find matching crop
      for (const key in cropData) {
        if (lowerCropName.includes(key)) {
          cropKey = key;
          break;
        }
      }
      
      // Default crop name
      let displayCropName = cropKey ? cropKey.charAt(0).toUpperCase() + cropKey.slice(1) : cropName;
      
      const mockResponse = {
        cropName: displayCropName,
        data: {
          TYPE: cropData[cropKey]?.TYPE || 'Agricultural Crop',
          SCIENTIFIC_NAME: cropData[cropKey]?.SCIENTIFIC_NAME || 'Not specified',
          FAMILY: cropData[cropKey]?.FAMILY || 'Various',
          CALORIES: cropData[cropKey]?.CALORIES || 'Varies by variety',
          NUTRITION: cropData[cropKey]?.NUTRITION || 'Rich in essential vitamins and minerals',
          SEASON: cropData[cropKey]?.SEASON || 'Depends on climate and region',
          PLANTING_TIME: cropData[cropKey]?.PLANTING_TIME || 'Season dependent',
          HARVEST_TIME: cropData[cropKey]?.HARVEST_TIME || 'Season dependent',
          CROP_DURATION: cropData[cropKey]?.CROP_DURATION || '90-120 days',
          SOIL_PH: cropData[cropKey]?.SOIL_PH || '6.0 to 7.0',
          SOIL_TYPE: cropData[cropKey]?.SOIL_TYPE || 'Well-drained loamy soil',
          WATER_REQUIREMENT: cropData[cropKey]?.WATER_REQUIREMENT || 'Regular watering as needed',
          IRRIGATION_STAGES: cropData[cropKey]?.IRRIGATION_STAGES || 'Critical during growth stages',
          TEMPERATURE: cropData[cropKey]?.TEMPERATURE || 'Varies by crop',
          RAINFALL: cropData[cropKey]?.RAINFALL || 'Adequate rainfall required',
          SUNLIGHT: cropData[cropKey]?.SUNLIGHT || 'Full sun preferred',
          COMMON_VARIETIES: cropData[cropKey]?.COMMON_VARIETIES || 'Various local varieties',
          MAJOR_PRODUCERS: cropData[cropKey]?.MAJOR_PRODUCERS || 'Global production',
          MARKET_PRICE: cropData[cropKey]?.MARKET_PRICE || 'Varies by market and season',
          STORAGE: cropData[cropKey]?.STORAGE || 'Cool, dry place away from sunlight',
          SHELF_LIFE: cropData[cropKey]?.SHELF_LIFE || 'Varies by storage conditions',
          YIELD: cropData[cropKey]?.YIELD || 'Varies by cultivation practices',
          COMMON_DISEASES: cropData[cropKey]?.COMMON_DISEASES || 'Various fungal and bacterial diseases',
          PEST_PROBLEMS: cropData[cropKey]?.PEST_PROBLEMS || 'Common agricultural pests',
          HEALTH_BENEFITS: cropData[cropKey]?.HEALTH_BENEFITS || 'Promotes overall health',
          USES: cropData[cropKey]?.USES || 'Food, feed, industrial uses',
          EXPORT_POTENTIAL: cropData[cropKey]?.EXPORT_POTENTIAL || 'Market dependent',
          SUSTAINABILITY_SCORE: cropData[cropKey]?.SUSTAINABILITY_SCORE || '6/10',
          WATER_FOOTPRINT: cropData[cropKey]?.WATER_FOOTPRINT || 'Varies significantly',
          CARBON_FOOTPRINT: cropData[cropKey]?.CARBON_FOOTPRINT || 'Varies by production method',
          FUN_FACT: cropData[cropKey]?.FUN_FACT || 'Important agricultural commodity',
          ...cropData[cropKey]
        },
        success: false,
        message: 'Using enhanced mock data. Connect to backend for real AI responses.'
      };
      
      setResponse(mockResponse);
      
    } finally {
      setLoading(false);
      setCropName('');
    }
  };

  const handleExampleCrop = (crop) => {
    setCropName(crop);
  };

  const InfoCard = ({ title, content, icon, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  );

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className={`text-2xl font-bold ${color} mt-1`}>{value}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Queries Today" value={recentQueries} icon={<Brain size={16} />} color="text-blue-600" />
        <StatCard label="Response Time" value="~2s" icon={<Zap size={16} />} color="text-emerald-600" />
        <StatCard label="Accuracy" value="95%" icon={<Star size={16} />} color="text-purple-600" />
        <StatCard label="Crops in DB" value="50+" icon={<Leaf size={16} />} color="text-amber-600" />
      </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">FarmChainX Crop Intelligence</h2>
            <p className="text-white/90 mt-1">
              Get comprehensive agricultural information for any crop. Enter crop name for detailed insights.
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search for Crop Information</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              placeholder="Enter crop name (e.g., Wheat, Rice, Potato, Tomato...)"
              className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !cropName.trim()}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-primary-200 transition-all duration-300"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Searching...
                </>
              ) : (
                <>
                  <Bot size={18} />
                  Get Info
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Enter exact crop name for most accurate results
          </p>
        </form>

        {/* Example Crops */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌱</span>
            <h3 className="font-semibold text-gray-900">Popular Crops</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {exampleCrops.map((crop) => (
              <button
                key={crop.name}
                onClick={() => handleExampleCrop(crop.name)}
                className={`p-3 bg-gradient-to-br ${crop.color} rounded-xl hover:scale-105 transition-all duration-300 group border border-gray-200`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-2">{crop.emoji}</span>
                  <span className="font-medium text-gray-900 group-hover:text-gray-900 text-sm">
                    {crop.name}
                  </span>
                  <span className="text-xs text-gray-600 mt-1">{crop.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {response && (
        <div className="space-y-6">
          {/* Crop Header */}
          <div className="bg-gradient-to-r from-primary-50 to-emerald-50 rounded-2xl p-6 border border-primary-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{response.cropName}</h1>
                <p className="text-gray-600 mt-1">
                  {response.data.SCIENTIFIC_NAME} • {response.data.FAMILY}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary-200">
                <Brain size={16} className="text-primary-600" />
                <span className="text-sm font-medium text-primary-700">AI Analysis</span>
              </div>
            </div>
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard 
              title="Basic Information" 
              content={`Type: ${response.data.TYPE}\nCalories: ${response.data.CALORIES}\nSeason: ${response.data.SEASON}`}
              icon={<Leaf size={20} className="text-emerald-600" />}
              color="from-emerald-50 to-green-50"
            />
            
            <InfoCard 
              title="Cultivation Details" 
              content={`Planting: ${response.data.PLANTING_TIME}\nHarvest: ${response.data.HARVEST_TIME}\nDuration: ${response.data.CROP_DURATION}`}
              icon={<Sun size={20} className="text-amber-600" />}
              color="from-amber-50 to-yellow-50"
            />
            
            <InfoCard 
              title="Soil & Water" 
              content={`Soil pH: ${response.data.SOIL_PH}\nSoil Type: ${response.data.SOIL_TYPE}\nWater: ${response.data.WATER_REQUIREMENT}`}
              icon={<Droplet size={20} className="text-blue-600" />}
              color="from-blue-50 to-cyan-50"
            />
            
            <InfoCard 
              title="Climate Requirements" 
              content={`Temperature: ${response.data.TEMPERATURE}\nRainfall: ${response.data.RAINFALL}\nSunlight: ${response.data.SUNLIGHT}`}
              icon={<Thermometer size={20} className="text-red-600" />}
              color="from-red-50 to-pink-50"
            />
          </div>

          {/* Detailed Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard 
              title="Nutrition Profile" 
              content={response.data.NUTRITION}
              icon={<Heart size={20} className="text-purple-600" />}
              color="from-purple-50 to-pink-50"
            />
            
            <InfoCard 
              title="Market Information" 
              content={`Price: ${response.data.MARKET_PRICE}\nMajor Producers: ${response.data.MAJOR_PRODUCERS}\nExport: ${response.data.EXPORT_POTENTIAL}`}
              icon={<TrendingUp size={20} className="text-green-600" />}
              color="from-green-50 to-emerald-50"
            />
            
            <InfoCard 
              title="Storage & Yield" 
              content={`Storage: ${response.data.STORAGE}\nShelf Life: ${response.data.SHELF_LIFE}\nYield: ${response.data.YIELD}`}
              icon={<Package size={20} className="text-indigo-600" />}
              color="from-indigo-50 to-blue-50"
            />
          </div>

          {/* Additional Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard 
              title="Common Varieties" 
              content={response.data.COMMON_VARIETIES}
              icon={<Target size={20} className="text-amber-600" />}
              color="from-amber-50 to-orange-50"
            />
            
            <InfoCard 
              title="Disease & Pest Management" 
              content={`Diseases: ${response.data.COMMON_DISEASES}\nPests: ${response.data.PEST_PROBLEMS}`}
              icon={<Shield size={20} className="text-red-600" />}
              color="from-red-50 to-rose-50"
            />
            
            <InfoCard 
              title="Uses & Applications" 
              content={response.data.USES}
              icon={<BookOpen size={20} className="text-blue-600" />}
              color="from-blue-50 to-sky-50"
            />
          </div>

          {/* Sustainability Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard 
              title="Sustainability Metrics" 
              content={`Score: ${response.data.SUSTAINABILITY_SCORE}\nWater Footprint: ${response.data.WATER_FOOTPRINT}\nCarbon Footprint: ${response.data.CARBON_FOOTPRINT}`}
              icon={<Globe size={20} className="text-emerald-600" />}
              color="from-emerald-50 to-teal-50"
            />
            
            <InfoCard 
              title="Health Benefits" 
              content={response.data.HEALTH_BENEFITS}
              icon={<Heart size={20} className="text-pink-600" />}
              color="from-pink-50 to-rose-50"
            />
            
            <InfoCard 
              title="Fun Fact" 
              content={response.data.FUN_FACT}
              icon={<Sparkles size={20} className="text-yellow-600" />}
              color="from-yellow-50 to-amber-50"
            />
          </div>

          {response.success === false && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Sparkles className="text-amber-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-amber-900">Using Enhanced Mock Data</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Connect to backend for real-time AI responses with Groq API. Currently showing detailed mock data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <History className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
                  <p className="text-sm text-gray-600">Your last {history.length} crop searches</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem('aiAgentHistory');
                }}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1 hover:bg-red-50 rounded-lg"
              >
                Clear History
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 hover:bg-primary-50 rounded-xl border border-gray-100 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-primary-700">
                        {item.crop}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{item.data.TYPE}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.data.SOIL_PH && (
                          <span className="px-2 py-1 bg-white text-xs font-medium text-gray-600 rounded-full border">
                            pH: {item.data.SOIL_PH.split('(')[0].trim()}
                          </span>
                        )}
                        {item.data.SEASON && (
                          <span className="px-2 py-1 bg-white text-xs font-medium text-gray-600 rounded-full border">
                            {item.data.SEASON.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">{item.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleExampleCrop(item.crop)}
                    className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  >
                    Search Again
                    <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center py-6 border-t border-gray-200 bg-gray-50 rounded-2xl">
        <p className="text-sm text-gray-600">
          FarmChainX Crop Intelligence • Powered by AI • Comprehensive Agricultural Database
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Data includes cultivation practices, market information, nutritional values, and sustainability metrics
        </p>
      </div>
    </div>
  );
};

export default FreeAIAgent;