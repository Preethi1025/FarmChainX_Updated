import React from 'react';
import UserSupportForm from '../components/UserSupportForm';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <UserSupportForm />
      </div>
    </div>
  );
};

export default SupportPage;