import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AIAssistant from '../pages/AIAssistant';
import { X, Bot } from 'lucide-react';

const AIAssistantModal = ({ userType, onClose }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getAssistantTitle = () => {
    switch(userType) {
      case 'BUYER':
        return "Buyer's AI Assistant";
      case 'FARMER':
        return "Farmer's AI Assistant";
      case 'DISTRIBUTOR':
        return "Distributor's AI Assistant";
      default:
        return "AI Assistant";
    }
  };

  const getAssistantDescription = () => {
    switch(userType) {
      case 'BUYER':
        return "Get crop nutrition info, prices, and buying insights";
      case 'FARMER':
        return "Get farming advice, crop management, and market insights";
      case 'DISTRIBUTOR':
        return "Get logistics, storage, and distribution insights";
      default:
        return "Get agricultural insights";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getAssistantTitle()}</h2>
              <p className="text-sm text-gray-600">{getAssistantDescription()}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <AIAssistant 
            onClose={handleClose}
            userType={userType}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AIAssistantModal;