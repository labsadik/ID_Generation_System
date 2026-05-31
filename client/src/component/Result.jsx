import React from 'react';

const Result = ({ uid }) => {
  const downloadUrl = `http://localhost:5000/api/download/${uid}`;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</h2>
      <p className="text-gray-600 mb-2">Your Unique Identification Number:</p>
      <div className="bg-gray-100 p-4 rounded border text-2xl font-mono tracking-widest mb-6">
        {uid}
      </div>
      
      <p className="text-sm text-gray-500 mb-4">Please save this UID for future reference.</p>

      <a 
        href={downloadUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg inline-block hover:bg-blue-700 transition"
      >
        Download ID Card (PDF)
      </a>
    </div>
  );
};

export default Result;