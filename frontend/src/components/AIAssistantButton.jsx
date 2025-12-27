import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import AIAssistantModal from './AIAssistantModal';

const AIAssistantButton = ({ userType }) => {
  const [showAI, setShowAI] = useState(false);

  const getButtonLabel = () => {
    switch(userType) {
      case 'BUYER':
        return "Crop Info AI";
      case 'FARMER':
        return "Farming AI";
      case 'DISTRIBUTOR':
        return "Logistics AI";
      default:
        return "AI Assistant";
    }
  };

  const getTooltipText = () => {
    switch(userType) {
      case 'BUYER':
        return "Get crop nutrition, calories, uses, and drawbacks";
      case 'FARMER':
        return "Get farming advice, pest control, and market prices";
      case 'DISTRIBUTOR':
        return "Get logistics, storage, and distribution help";
      default:
        return "Ask AI Assistant for help";
    }
  };

  return (
    <>
      <button
        onClick={() => setShowAI(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg group"
        title={getTooltipText()}
      >
        <Bot className="h-5 w-5 group-hover:scale-110 transition-transform" />
        <span className="font-medium">{getButtonLabel()}</span>
      </button>

      {showAI && (
        <AIAssistantModal
          userType={userType}
          onClose={() => setShowAI(false)}
        />
      )}
    </>
  );
};

export default AIAssistantButton;