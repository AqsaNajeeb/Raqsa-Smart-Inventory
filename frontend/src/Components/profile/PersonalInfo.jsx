import React from 'react';
import { Phone } from 'lucide-react';

const PersonalInfo = ({
  profileData,
  editMode,
  handleInputChange,
  handleSaveProfile
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4 text-purple-800">
        Personal Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="firstname"
          value={profileData.firstname}
          onChange={handleInputChange}
          disabled={!editMode}
          placeholder="First Name"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-purple-300"
        />

        <input
          name="lastname"
          value={profileData.lastname}
          onChange={handleInputChange}
          disabled={!editMode}
          placeholder="Last Name"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-purple-300"
        />

        <input
          value={profileData.email}
          disabled
          className="p-3 rounded-lg border col-span-2 bg-gray-100 cursor-not-allowed"
          placeholder="Email"
        />

        <div className="relative col-span-2">
          <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            disabled={!editMode}
            placeholder="Mobile Number"
            className="pl-10 p-3 rounded-lg border w-full focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <input
          name="language"
          value={profileData.language || ''}
          onChange={handleInputChange}
          disabled={!editMode}
          placeholder="Language"
          className="p-3 rounded-lg border focus:ring-2 focus:ring-purple-300"
        />

        <select
  name="currency"
  value={profileData.currency || ''}
  onChange={handleInputChange}
  disabled={!editMode}
  className="p-3 rounded-lg border focus:ring-2 focus:ring-purple-300 bg-white"
>
  <option value="" disabled>
    Select Currency
  </option>
  <option value="USD">USD</option>
  <option value="PKR">PKR</option>
</select>

      </div>

      {editMode && (
        <button
          onClick={handleSaveProfile}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full shadow-md"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default PersonalInfo;
