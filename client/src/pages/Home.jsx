import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Component: SearchBar ---
const SearchBar = ({ onSearch }) => {
  const [uid, setUid] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (uid) onSearch(uid);
  };
  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search by UID (e.g. 1234 5678 9012)"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        className="flex-1 border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-red-500 outline-none"
      />
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition">Search</button>
    </form>
  );
};

// --- Component: UserListSidebar ---
const UserListSidebar = ({ users, onSelect }) => {
  if (users.length === 0) return <div className="p-4 text-gray-500 text-center text-sm">No registered users yet.</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
      <div className="bg-gray-800 text-white p-3 font-semibold text-sm flex justify-between items-center">
        <span>REGISTERED PROFILES</span>
        <span className="bg-red-600 text-xs px-2 py-1 rounded-full">{users.length} Total</span>
      </div>
      <div className="divide-y max-h-[500px] overflow-y-auto">
        {users.map((u) => (
          <div 
            key={u._id} 
            onClick={() => onSelect(u.uid)}
            className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition"
          >
            <img 
              src={u.photoUrl || `https://ui-avatars.com/api/?name=${u.name}&background=random`} 
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
              alt={u.name}
            />
            <div className="flex-1 overflow-hidden">
              <h4 className="font-semibold text-gray-800 text-sm truncate">{u.name}</h4>
              <p className="text-xs text-gray-500 font-mono">{u.uid}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200 whitespace-nowrap">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Verified
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Component: ProfileModal (Popup) ---
const ProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  // Check if extra doc is PDF
  const isPdf = user.extraDocPath && user.extraDocPath.toLowerCase().endsWith('.pdf');
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Design */}
        <div className="bg-red-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white opacity-80 hover:opacity-100 text-2xl font-bold">&times;</button>
          <div className="flex items-center gap-4">
            <img 
              src={user.photoUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              className="w-24 h-24 rounded-lg border-4 border-white object-cover shadow-md"
              alt={user.name}
            />
            <div>
              <h2 className="text-2xl font-bold uppercase">{user.name}</h2>
              <p className="text-red-200 font-mono tracking-widest mt-1">{user.uid}</p>
              <div className="flex items-center gap-1 mt-2 bg-white/20 px-2 py-1 rounded text-xs w-fit">
                <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Identity Verified
              </div>
            </div>
          </div>
        </div>

        {/* Body Details */}
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-gray-400 text-xs uppercase">Father's Name</span>
              <span className="font-semibold">{user.fatherName || '-'}</span>
            </div>
            <div>
              <span className="block text-gray-400 text-xs uppercase">Mother's Name</span>
              <span className="font-semibold">{user.motherName || '-'}</span>
            </div>
            <div>
              <span className="block text-gray-400 text-xs uppercase">Gender</span>
              <span className="font-semibold">{user.gender}</span>
            </div>
            <div>
              <span className="block text-gray-400 text-xs uppercase">Age</span>
              <span className="font-semibold">{user.age} Years</span>
            </div>
          </div>
          <hr/>
          <div>
            <span className="block text-gray-400 text-xs uppercase mb-1">Full Address</span>
            <div className="bg-gray-50 p-3 rounded border text-gray-800">
              <p>{user.address?.fullAddress}</p>
              <p className="mt-1 text-xs text-gray-500">
                {user.address?.city}, {user.address?.district}, {user.address?.state} - {user.address?.pinCode}
              </p>
            </div>
          </div>

          {/* Extra Document Section */}
          {user.extraDocUrl && (
            <div className="mt-2">
              <span className="block text-gray-400 text-xs uppercase mb-2">Extra Document</span>
              <div className="bg-gray-50 p-3 rounded border text-gray-800 text-center">
                {isPdf ? (
                   <a 
                     href={user.extraDocUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-red-600 font-semibold underline flex items-center justify-center gap-2"
                   >
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                     View PDF Document
                   </a>
                ) : (
                   <a href={user.extraDocUrl} target="_blank" rel="noopener noreferrer">
                     <img src={user.extraDocUrl} alt="Extra Document" className="max-h-32 mx-auto rounded shadow-sm hover:opacity-80 transition" />
                   </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 text-sm">Close</button>
          <a 
            href={`http://localhost:5000/api/download/${user.uid}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Existing Components (FormStep1) ---
const FormStep1 = ({ nextStep, data }) => {
  const [localData, setLocalData] = useState(data || {});
  const handleChange = (e) => setLocalData({ ...localData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); nextStep(localData); };
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Step 1: Personal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input name="name" placeholder="Full Name" value={localData.name || ''} onChange={handleChange} className="input-style" required />
        <input name="number" placeholder="Phone Number" value={localData.number || ''} onChange={handleChange} className="input-style" required />
        <input name="fatherName" placeholder="Father's Name" value={localData.fatherName || ''} onChange={handleChange} className="input-style" required />
        <input name="motherName" placeholder="Mother's Name" value={localData.motherName || ''} onChange={handleChange} className="input-style" required />
        <input name="age" type="number" placeholder="Age" value={localData.age || ''} onChange={handleChange} className="input-style" required />
        <select name="gender" value={localData.gender || ''} onChange={handleChange} className="input-style" required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <h2 className="text-lg font-bold mt-6 mb-4 text-gray-800 border-b pb-2">Address</h2>
      <div className="grid grid-cols-2 gap-3">
        <input name="state" placeholder="State" value={localData.state || ''} onChange={handleChange} className="input-style" required />
        <input name="city" placeholder="City" value={localData.city || ''} onChange={handleChange} className="input-style" required />
        <input name="district" placeholder="District" value={localData.district || ''} onChange={handleChange} className="input-style" required />
        <input name="pinCode" placeholder="Pin Code" value={localData.pinCode || ''} onChange={handleChange} className="input-style" required />
      </div>
      <textarea name="fullAddress" placeholder="Full Address (House No, Street, Locality)" value={localData.fullAddress || ''} onChange={handleChange} className="input-style mt-3 w-full" rows="2" required></textarea>
      <div className="mt-6 text-right">
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">Next &rarr;</button>
      </div>
      <style>{`.input-style { border: 1px solid #e5e7eb; padding: 8px; border-radius: 6px; width: 100%; font-size: 14px; }`}</style>
    </form>
  );
};

// --- UPDATED: FormStep2 with Image Preview and Extra Doc ---
const FormStep2 = ({ prevStep, submitForm }) => {
  const [files, setFiles] = useState({ photo: null, signature: null, extraDoc: null });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [e.target.name]: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!files.photo || !files.signature) { alert("Photo & Signature required"); return; }
    submitForm(files);
  };

  const getPreviewUrl = (file) => {
    return file ? URL.createObjectURL(file) : null;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Step 2: Upload Documents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Photo */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-500 transition">
          {files.photo ? (
            <div className="mb-3 text-center">
              <img src={getPreviewUrl(files.photo)} alt="Photo Preview" className="w-24 h-24 object-cover rounded-lg shadow-md border" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          <label className="block text-xs font-medium text-gray-700 mb-1">Photo</label>
          <input type="file" name="photo" accept="image/*" onChange={handleFileChange} className="text-xs text-gray-500 file:input-style" required />
        </div>

        {/* Signature */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-500 transition">
          {files.signature ? (
             <div className="mb-3 text-center">
              <img src={getPreviewUrl(files.signature)} alt="Signature Preview" className="w-24 h-16 object-contain bg-white rounded-lg shadow-md border p-1" />
            </div>
          ) : (
            <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-3">
               <span className="text-xs">No Sign</span>
            </div>
          )}
          <label className="block text-xs font-medium text-gray-700 mb-1">Signature</label>
          <input type="file" name="signature" accept="image/*" onChange={handleFileChange} className="text-xs text-gray-500 file:input-style" required />
        </div>

        {/* Extra Doc */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-red-500 transition">
           {files.extraDoc ? (
            <div className="mb-3 text-center">
              <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center text-green-600">
                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
              <p className="text-xs text-gray-500 truncate w-24">{files.extraDoc.name}</p>
            </div>
          ) : (
            <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-3">
               <span className="text-xs">Optional</span>
            </div>
          )}
          <label className="block text-xs font-medium text-gray-700 mb-1">Extra Doc</label>
          <input type="file" name="extraDoc" accept="image/*,.pdf" onChange={handleFileChange} className="text-xs text-gray-500 file:input-style" />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={prevStep} className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300 transition">&larr; Back</button>
        <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">Generate ID</button>
      </div>
      <style>{`.file\:input-style { margin-top: 0.25rem; }`}</style>
    </form>
  );
};

// --- Main Home Component ---
const Home = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [resultUid, setResultUid] = useState(null);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.log("Error loading users", err));
  }, [step]);

  const nextStep = (data) => { setFormData({ ...formData, ...data }); setStep(2); };
  const prevStep = () => setStep(1);
  
  const submitForm = async (files) => {
    const finalData = new FormData();
    for (let key in formData) finalData.append(key, formData[key]);
    if (files.photo) finalData.append('photo', files.photo);
    if (files.signature) finalData.append('signature', files.signature);
    if (files.extraDoc) finalData.append('extraDoc', files.extraDoc);

    try {
      const res = await axios.post('http://localhost:5000/api/register', finalData);
      setResultUid(res.data.uid);
      setStep(3);
    } catch (err) { alert('Error submitting form'); }
  };

  const handleSelectUser = async (uid) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${uid}`);
      setSelectedUser(res.data);
    } catch (err) {
      alert("Could not fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (uid) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${uid}`);
      setSelectedUser(res.data);
    } catch (err) { alert('User not found'); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-bold text-red-600 tracking-wide">UID AUTHORITY</h1>
            <SearchBar onSearch={handleSearch} />
        </div>
      </nav>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 1 && <FormStep1 nextStep={nextStep} data={formData} />}
          {step === 2 && <FormStep2 prevStep={prevStep} submitForm={submitForm} />}
          {step === 3 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Complete!</h2>
              <div className="bg-gray-50 p-4 rounded border inline-block mb-6">
                <p className="text-sm text-gray-500">Your UID Number:</p>
                <p className="text-3xl font-mono text-red-600 font-bold">{resultUid}</p>
              </div>
              <div className="flex justify-center gap-4">
                 <button onClick={() => { setStep(1); setResultUid(null); }} className="text-red-600 hover:underline">Register Another</button>
                 <a href={`http://localhost:5000/api/download/${resultUid}`} target="_blank" className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">Download PDF</a>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {loading ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">Loading Profile...</div>
          ) : (
            <UserListSidebar users={users} onSelect={handleSelectUser} />
          )}
        </div>
      </div>

      {selectedUser && <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

export default Home;