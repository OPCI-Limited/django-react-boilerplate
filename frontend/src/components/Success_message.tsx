import React from 'react';
import successGif from './assets/images/success.gif'; // Adjust the path to your GIF

const SuccessMessage: React.FC = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg text-center z-50">
      <img src={successGif} alt="Success" className="w-24 h-24 mx-auto" />
      <p className="mt-4 text-lg font-bold text-green-500">Success!</p>
    </div>
  );
};

export default SuccessMessage;
