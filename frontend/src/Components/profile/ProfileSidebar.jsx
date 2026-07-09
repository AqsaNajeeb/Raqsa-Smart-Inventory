import {
  User,
  MapPin,
  CreditCard,
  Heart,
  Package,
  Settings,
  LogOut,
  Edit
} from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'payment', label: 'Payments', icon: CreditCard },
  { id: 'address', label: 'Addresses', icon: MapPin },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const ProfileSidebar = ({
  user,
  activeTab,
  setActiveTab,
  editMode,
  setEditMode,
  logout
}) => {
  return (
    <aside className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            user?.profileImage ||
            'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
          }
          alt="avatar"
          className="w-24 h-24 rounded-full mb-3 object-cover"
        />

        <h2 className="font-semibold text-lg">
          {user?.firstname} {user?.lastname}
        </h2>

        <p className="text-sm text-gray-500">{user?.email}</p>

        <button
          onClick={() => setEditMode(!editMode)}
          className="
            mt-4 px-5 py-2.5 rounded-full
            flex items-center gap-2
            text-white font-medium
            bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400
            shadow-md shadow-pink-200
            hover:from-pink-500 hover:via-fuchsia-500 hover:to-purple-500
            transition-all duration-300
            active:scale-95
          "
        >
          <Edit size={16} />
          {editMode ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      <ul className="space-y-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const disabled = editMode && id !== 'personal';

          return (
            <li key={id}>
              <button
                disabled={disabled}
                onClick={() => !disabled && setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    activeTab === id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-700 hover:bg-purple-100'
                  }
                  ${disabled ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}
                `}
              >
                <Icon size={18} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        onClick={logout}
        className="mt-6 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
          bg-red-100 text-red-600 hover:bg-red-200 transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default ProfileSidebar;
