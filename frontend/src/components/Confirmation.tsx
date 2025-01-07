import React from "react";

interface ConfirmationProps {
  message: string; // The confirmation message to display
  onConfirm: () => void; // Callback for when "Yes" is clicked
  onCancel: () => void; // Callback for when "No" is clicked
}

const Confirmation: React.FC<ConfirmationProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Confirmation</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
