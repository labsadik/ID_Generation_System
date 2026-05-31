import React, { useState } from 'react';

const FormStep1 = ({ nextStep, data }) => {
  const [localData, setLocalData] = useState({
    name: data.name || '',
    number: data.number || '',
    fatherName: data.fatherName || '',
    motherName: data.motherName || '',
    age: data.age || '',
    gender: data.gender || '',
    state: data.address?.state || '',
    city: data.address?.city || '',
    district: data.address?.district || '',
    pinCode: data.address?.pinCode || '',
    fullAddress: data.address?.fullAddress || ''
  });

  const handleChange = (e) => {
    setLocalData({ ...localData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep(localData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Full Name" value={localData.name} onChange={handleChange} className="input-style" required />
        <input name="number" placeholder="Phone Number" value={localData.number} onChange={handleChange} className="input-style" required />
        <input name="fatherName" placeholder="Father's Name" value={localData.fatherName} onChange={handleChange} className="input-style" required />
        <input name="motherName" placeholder="Mother's Name" value={localData.motherName} onChange={handleChange} className="input-style" required />
        <input name="age" type="number" placeholder="Age" value={localData.age} onChange={handleChange} className="input-style" required />
        <select name="gender" value={localData.gender} onChange={handleChange} className="input-style" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4 border-b pb-2">Address Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="state" placeholder="State" value={localData.state} onChange={handleChange} className="input-style" required />
        <input name="city" placeholder="City" value={localData.city} onChange={handleChange} className="input-style" required />
        <input name="district" placeholder="District" value={localData.district} onChange={handleChange} className="input-style" required />
        <input name="pinCode" placeholder="Pin Code" value={localData.pinCode} onChange={handleChange} className="input-style" required />
      </div>
      
      <textarea name="fullAddress" placeholder="Full Address" value={localData.fullAddress} onChange={handleChange} className="input-style mt-4 w-full" rows="3" required></textarea>

      <div className="mt-6 text-right">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Next &rarr;
        </button>
      </div>

      <style>{`.input-style { border: 1px solid #ccc; padding: 8px; border-radius: 4px; }`}</style>
    </form>
  );
};

export default FormStep1;