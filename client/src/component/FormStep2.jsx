import React, { useState } from 'react';

const FormStep2 = ({ prevStep, submitForm }) => {
  const [files, setFiles] = useState({
    photo: null,
    signature: null,
    extraDoc: null
  });

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!files.photo || !files.signature) {
        alert("Photo and Signature are required.");
        return;
    }
    submitForm(files);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
      
      <div className="space-y-4">
        <div>
            <label className="block text-gray-700">Photo (JPG/PNG)</label>
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className="w-full mt-1" required />
        </div>
        <div>
            <label className="block text-gray-700">Signature (JPG/PNG)</label>
            <input type="file" name="signature" accept="image/*" onChange={handleFileChange} className="w-full mt-1" required />
        </div>
        <div>
            <label className="block text-gray-700">Extra Document (PDF/IMAGE)</label>
            <input type="file" name="extraDoc" accept=".pdf,image/*" onChange={handleFileChange} className="w-full mt-1" />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
            &larr; Back
        </button>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Submit & Generate ID
        </button>
      </div>
    </form>
  );
};

export default FormStep2;