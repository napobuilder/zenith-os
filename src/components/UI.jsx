import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-black bg-opacity-20 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl shadow-2xl shadow-black shadow-opacity-20 p-6 ${className}`}>
    {children}
  </div>
);

export const SectionTitle = ({ icon, title }) => (
  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
    {React.cloneElement(icon, { className: 'text-purple-400 w-6 h-6' })}
    <span className="ml-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{title}</span>
  </h2>
);

export const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" onClick={onClose}>
    <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 shadow-xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);
