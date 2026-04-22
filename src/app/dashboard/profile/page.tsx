"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Check } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "demo@shopverse.com",
    phone: "+1 (555) 123-4567",
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-6 mb-8">
        Profile Settings
      </h1>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-black text-white">JD</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{profile.name}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <button className="mt-2 text-xs text-indigo-600 font-medium hover:text-indigo-700">
              Change Avatar
            </button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          Default Address
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Street Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={profile.street}
                onChange={(e) =>
                  setProfile({ ...profile, street: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              City
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) =>
                setProfile({ ...profile, city: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              State
            </label>
            <input
              type="text"
              value={profile.state}
              onChange={(e) =>
                setProfile({ ...profile, state: e.target.value })
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Saved Successfully!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}
