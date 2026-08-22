import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { ProfileImageUpload } from '../../components/profile/ProfileImageUpload';
import { User, Mail, MapPin, Phone, Edit3, Check, Sparkles, Compass, Heart, Calendar, UserCheck } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const { showNotification } = useTrips();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Editable personal info fields
  const [name, setName] = useState(user?.name || 'Nakul Sharma');
  const [displayName, setDisplayName] = useState(user?.handle || '@nakul_travels');
  const [email, setEmail] = useState(user?.email || 'nakul@globetrotter.io');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [age, setAge] = useState(user?.age ?? 24);
  const [gender, setGender] = useState(user?.gender || '');
  const [city, setCity] = useState(user?.city || 'Bangalore');
  const [country, setCountry] = useState(user?.country || 'India');
  const [bio, setBio] = useState(user?.bio || 'Passionate multi-city explorer, tech builder, and street-food enthusiast.');
  const [avatar, setAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // Travel preferences editable state
  const [travelStyle, setTravelStyle] = useState(user?.travelPreferences?.primaryStyle || 'Balanced');
  const [travelPace, setTravelPace] = useState(user?.travelPreferences?.pace || 'Moderate');
  const [budgetPreference, setBudgetPreference] = useState(user?.travelPreferences?.budgetLevel || 'Moderate to Premium');
  const [selectedInterests, setSelectedInterests] = useState(
    user?.travelPreferences?.favoriteCategories || ['Culture', 'Food', 'Nature', 'Adventure']
  );

  const allInterests = ['Culture', 'Food', 'Nature', 'Adventure', 'City Experiences', 'History', 'Shopping', 'Nightlife'];

  const toggleInterest = (category) => {
    if (selectedInterests.includes(category)) {
      setSelectedInterests(selectedInterests.filter((c) => c !== category));
    } else {
      setSelectedInterests([...selectedInterests, category]);
    }
  };

  const handleOpenEdit = () => {
    setName(user?.name || 'Nakul Sharma');
    setDisplayName(user?.handle || '@nakul_travels');
    setEmail(user?.email || 'nakul@globetrotter.io');
    setPhone(user?.phone || '+91 98765 43210');
    setAge(user?.age ?? 24);
    setGender(user?.gender || '');
    setCity(user?.city || (user?.location?.split(',')[0]?.trim() || 'Bangalore'));
    setCountry(user?.country || (user?.location?.split(',')[1]?.trim() || 'India'));
    setBio(user?.bio || 'Passionate multi-city explorer, tech builder, and street-food enthusiast.');
    setAvatar(user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    setTravelStyle(user?.travelPreferences?.primaryStyle || 'Balanced');
    setTravelPace(user?.travelPreferences?.pace || 'Moderate');
    setBudgetPreference(user?.travelPreferences?.budgetLevel || 'Moderate to Premium');
    setSelectedInterests(user?.travelPreferences?.favoriteCategories || ['Culture', 'Food', 'Nature', 'Adventure']);
    setEditModalOpen(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // Age validation
    const numAge = Number(age);
    if (age !== '' && (isNaN(numAge) || numAge < 1 || numAge > 120)) {
      showNotification('Please enter a valid age between 1 and 120', 'warning');
      return;
    }

    const fullLocation = city && country ? `${city}, ${country}` : city || country || 'Global Explorer';

    updateUserProfile({
      name,
      handle: displayName,
      email,
      phone,
      age: numAge || age,
      gender: gender || 'Prefer not to say',
      city,
      country,
      location: fullLocation,
      bio,
      avatar,
      travelPreferences: {
        primaryStyle: travelStyle,
        pace: travelPace,
        budgetLevel: budgetPreference,
        favoriteCategories: selectedInterests,
        preferredTransport: user?.travelPreferences?.preferredTransport || 'High-speed Train / Bullet Train'
      }
    });

    setEditModalOpen(false);
    showNotification('Profile updated and saved!', 'success');
  };

  const displayLocation = user?.location || (user?.city && user?.country ? `${user.city}, ${user.country}` : `${city}, ${country}`);
  const displayAge = user?.age || age;
  const displayGender = user?.gender || gender || 'Not specified';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-left">
      {/* Profile Header Container with Level 2 Liquid Glass */}
      <div className="glass-secondary rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-white/80 dark:border-zinc-700 shadow-lg shrink-0 bg-white/40 dark:bg-zinc-800/40">
              <ImageWithFallback
                src={user?.avatar || avatar}
                alt={user?.name || name}
                fallbackCategory="Traveler"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
                  {user?.name || name}
                </h1>
                <Badge variant="dark" size="sm">
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{user?.handle || displayName}</p>

              {/* Personal Badges: Age, Gender, Location */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3">
                <span className="px-2.5 py-1 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {displayLocation}
                </span>

                {displayAge && (
                  <span className="px-2.5 py-1 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {displayAge} yrs
                  </span>
                )}

                {displayGender && displayGender !== 'Prefer not to say' && (
                  <span className="px-2.5 py-1 rounded-xl bg-white/60 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-zinc-500" /> {displayGender}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Edit3}
            onClick={handleOpenEdit}
            className="font-black text-xs uppercase shadow-md shrink-0"
          >
            Edit Profile
          </Button>
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> {user?.email || email}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> {user?.phone || phone}
          </span>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider block">
            ABOUT ME / BIO
          </span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            {user?.bio || bio}
          </p>
        </div>

        {/* Travel Preferences with Liquid Glass Cards */}
        <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider block">
              TRAVEL STYLE & PREFERENCES
            </span>
            <button
              type="button"
              onClick={handleOpenEdit}
              className="text-xs font-bold text-zinc-950 dark:text-zinc-100 hover:underline"
            >
              Change Preferences
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl glass-secondary border">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Travel Style</span>
              <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-1 uppercase">
                {user?.travelPreferences?.primaryStyle || travelStyle}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-secondary border">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Travel Pace</span>
              <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-1 uppercase">
                {user?.travelPreferences?.pace || travelPace}
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-secondary border">
              <span className="text-[10px] text-zinc-400 font-bold uppercase block">Budget Tier</span>
              <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 mt-1 uppercase">
                {user?.travelPreferences?.budgetLevel || budgetPreference}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs text-zinc-400 font-bold uppercase block mb-2.5">
              Favorite Activity Categories & Interests
            </span>
            <div className="flex flex-wrap gap-2">
              {(user?.travelPreferences?.favoriteCategories || selectedInterests).map((cat) => (
                <Badge key={cat} variant="dark" size="md">
                  ✨ {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile & Travel Preferences Modal with Floating Glass */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile & Preferences"
        subtitle="Update your personal details, age, gender, location, or upload a photo."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 text-left">
          {/* Native PC Profile Photo Upload (No URL required) */}
          <ProfileImageUpload
            currentImage={avatar}
            onImageChange={(newImage) => setAvatar(newImage)}
          />

          {/* Personal Info with Age, Gender, City, Country */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider block border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
              Personal Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Display Handle"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            {/* AGE & GENDER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                min="1"
                max="120"
                placeholder="e.g. 24"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <Select
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                options={[
                  { value: '', label: 'Select Gender ▾' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Non-binary', label: 'Non-binary' },
                  { value: 'Prefer not to say', label: 'Prefer not to say' }
                ]}
              />
            </div>

            {/* LOCATION: CITY & COUNTRY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="e.g. Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="Country"
                placeholder="e.g. India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Bio / About Me
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full glass-secondary rounded-2xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100"
              />
            </div>
          </div>

          {/* Travel Preferences */}
          <div className="space-y-4 pt-2">
            <span className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider block border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2">
              Travel Preferences
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Travel Style"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
                options={['Relaxed', 'Balanced', 'Fast-Paced']}
              />
              <Select
                label="Pace"
                value={travelPace}
                onChange={(e) => setTravelPace(e.target.value)}
                options={['Slow & Deep', 'Moderate', 'Rapid Transit']}
              />
              <Select
                label="Budget Preference"
                value={budgetPreference}
                onChange={(e) => setBudgetPreference(e.target.value)}
                options={['Budget', 'Moderate', 'Moderate to Premium', 'Luxury']}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Favorite Categories (Click to toggle)
              </label>
              <div className="flex flex-wrap gap-2">
                {allInterests.map((category) => {
                  const isSelected = selectedInterests.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleInterest(category)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-xs'
                          : 'bg-white/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-white/90'
                      }`}
                    >
                      {category} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Check} className="font-bold">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
