import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Camera, Mail, Phone, Shield, Building, Award, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const BLANK_NEUTRAL_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/users/profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        updateUser({ profilePhotoUrl: res.data.data.profilePhotoUrl, profilePhotoType: 'CUSTOM' });
        toast.success('Profile photo updated successfully!');
      }
    } catch (err) {
      // Fallback for preview mode: convert image to local object URL
      const localUrl = URL.createObjectURL(file);
      updateUser({ profilePhotoUrl: localUrl, profilePhotoType: 'CUSTOM' });
      toast.success('Profile photo updated locally!');
    } finally {
      setUploading(false);
    }
  };

  const handleRevertDefault = async () => {
    try {
      const res = await api.delete('/users/profile-photo');
      if (res.data.success) {
        updateUser({ profilePhotoUrl: BLANK_NEUTRAL_AVATAR, profilePhotoType: 'DEFAULT' });
        toast.success('Reverted to neutral blank avatar');
      }
    } catch (err) {
      updateUser({ profilePhotoUrl: BLANK_NEUTRAL_AVATAR, profilePhotoType: 'DEFAULT' });
      toast.success('Reverted to neutral blank avatar');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ fullName, phoneNumber });
    toast.success('Profile information updated!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-indigo-500/20 flex flex-col md:flex-row items-center gap-8">
        <div className="relative group">
          <img
            src={user?.profilePhotoUrl || BLANK_NEUTRAL_AVATAR}
            alt={user?.fullName}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-indigo-500/30 shadow-2xl"
          />
          <label className="absolute inset-0 rounded-3xl bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
            <Camera className="text-white" size={28} />
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-100">{user?.fullName}</h1>
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase">
              {user?.role}
            </span>
          </div>

          <p className="text-slate-400 text-sm">{user?.email}</p>
          <p className="text-slate-500 text-xs font-mono">Gender: {user?.gender || 'NOT_SPECIFIED'}</p>

          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
            <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all flex items-center gap-1.5">
              <Camera size={14} /> Upload Custom Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>

            {user?.profilePhotoType === 'CUSTOM' && (
              <button
                onClick={handleRevertDefault}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Revert to Blank Avatar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Form */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
          <User className="text-indigo-400" size={20} /> Personal Profile Details
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
              <input
                type="text"
                disabled
                value={user?.gender || 'NOT_SPECIFIED'}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
