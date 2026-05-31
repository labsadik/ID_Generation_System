import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Verify = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${uid}`);
        setUser(res.data);
        setError(null);
      } catch (err) {
        setUser(null);
        setError('User not found or Invalid UID');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">Verification Failed</h2>
          <p className="text-gray-500">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }
  
  const isPdf = user.extraDocPath && user.extraDocPath.toLowerCase().endsWith('.pdf');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 duration-300">
        
        {/* Header */}
        <div className="bg-yellow-400 p-6 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-black opacity-10"></div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider">Identity Verified</h2>
            <p className="text-gray-700 font-mono mt-1">{user.uid}</p>
        </div>

        {/* Content */}
        <div className="p-6">
            <div className="flex flex-col items-center mb-6">
                <img 
                    src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    alt={user.name} 
                    className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md -mt-16 bg-gray-200" 
                />
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{user.name}</h3>
                <p className="text-gray-500 text-sm">{user.gender} | {user.age} Years</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Father's Name</span>
                    <span className="text-gray-800 font-semibold">{user.fatherName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Mother's Name</span>
                    <span className="text-gray-800 font-semibold">{user.motherName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Phone</span>
                    <span className="text-gray-800 font-semibold">{user.number}</span>
                </div>
                <hr/>
                <div>
                    <span className="block text-gray-500 font-medium mb-1">Address</span>
                    <p className="text-gray-800 text-xs">
                        {user.address?.fullAddress}, {user.address?.city}, {user.address?.state} - {user.address?.pinCode}
                    </p>
                </div>
                
                {/* Extra Doc in Verify Page */}
                {user.extraDocUrl && (
                    <>
                    <hr/>
                    <div>
                        <span className="block text-gray-500 font-medium mb-2">Extra Document</span>
                        <div className="text-center">
                            {isPdf ? (
                                <a href={user.extraDocUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold text-xs underline">View PDF Document</a>
                            ) : (
                                <a href={user.extraDocUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={user.extraDocUrl} alt="Doc" className="max-h-24 mx-auto rounded shadow" />
                                </a>
                            )}
                        </div>
                    </div>
                    </>
                )}
            </div>
            
            <div className="mt-6 text-center">
                <a 
                    href={`http://localhost:5000/api/download/${user.uid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition"
                >
                    Download ID Card
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;