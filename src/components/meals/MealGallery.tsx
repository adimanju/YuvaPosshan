/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MealGallery: Photo Register of School Meals
 * Displays documentary photographs of school mid-day meals,
 * with camera snap / file upload for kitchen staff, search, filters,
 * and detailed nutritional lightbox inspector.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Filter, 
  Maximize2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  Scale,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  MealPhoto, 
  INITIAL_MEAL_PHOTOS, 
  filterMealPhotos, 
  validateImageUpload 
} from '../../utils/gallery';
import { useAuth } from '../../context/AuthContext';
import { subscribeToMealPhotos, saveMealPhoto } from '../../lib/firestoreService';

interface MealGalleryProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const MealGallery: React.FC<MealGalleryProps> = ({ onClose, isModal = false }) => {
  const { currentUser, userProfile } = useAuth();

  // Photos stored in state with localStorage persistence
  const [photos, setPhotos] = useState<MealPhoto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yuva_meal_photos');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback to seed
        }
      }
    }
    return INITIAL_MEAL_PHOTOS;
  });

  // Real-time Firestore sync (only when authenticated)
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToMealPhotos((remotePhotos) => {
      if (remotePhotos && remotePhotos.length > 0) {
        setPhotos((prev) => {
          const map = new Map<string, MealPhoto>();
          remotePhotos.forEach((p) => map.set(p.id, p));
          prev.forEach((p) => {
            if (!map.has(p.id)) map.set(p.id, p);
          });
          return Array.from(map.values());
        });
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'lunch' | 'snack'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<MealPhoto | null>(null);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadItems, setUploadItems] = useState('Steamed Rice (150g), Toor Dal Sambar (120g), Boiled Egg (50g)');
  const [uploadCalories, setUploadCalories] = useState('715');
  const [uploadProtein, setUploadProtein] = useState('21.5');
  const [uploadTemp, setUploadTemp] = useState('Steaming Hot (>68°C)');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage when photos change
  useEffect(() => {
    try {
      localStorage.setItem('yuva_meal_photos', JSON.stringify(photos));
    } catch {
      // storage quota safety
    }
  }, [photos]);

  // Handle Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedPhoto) {
          setSelectedPhoto(null);
        } else if (isUploadOpen) {
          setIsUploadOpen(false);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, isUploadOpen, onClose]);

  const filteredPhotos = filterMealPhotos(photos, {
    mealType: selectedFilter,
    searchQuery,
  });

  // Handle image selection via camera or file
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageUpload(file);
    if (!validation.isValid) {
      setUploadError(validation.errorMessage || 'Invalid image file.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadPreview(event.target?.result as string);
      setIsUploadOpen(true);
      if (!uploadTitle) {
        setUploadTitle(`Mid-Day Meal - ${new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadPreview || !uploadTitle.trim()) {
      setUploadError('Please select a photo and enter a meal title.');
      return;
    }

    const newPhoto: MealPhoto = {
      id: `mp-${Date.now()}`,
      imageUrl: uploadPreview,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      mealType: 'lunch',
      title: uploadTitle.trim(),
      description: uploadDescription.trim() || 'Kitchen photo snapped by school staff for daily midday meal quality record.',
      items: uploadItems.split(',').map((s) => s.trim()).filter(Boolean),
      caloriesSuppliedKcal: Number(uploadCalories) || 710,
      proteinGrams: Number(uploadProtein) || 21,
      uploadedBy: userProfile?.displayName || currentUser?.email || 'Kitchen Staff (Live Upload)',
      uploaderRole: userProfile?.role === 'admin' ? 'kitchen_supervisor' : (userProfile?.role === 'parent' ? 'parent' : (userProfile?.role === 'teacher' ? 'teacher' : 'cook')),
      isVerified: true,
      temperatureNote: uploadTemp,
    };

    setPhotos([newPhoto, ...photos]);
    saveMealPhoto(newPhoto, currentUser?.uid || 'cook-staff').catch(() => {});

    setIsUploadOpen(false);
    setUploadPreview(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadError(null);
  };

  return (
    <div className={`w-full ${isModal ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md cursor-pointer' : ''}`}>
      <div 
        onClick={(e) => isModal && e.stopPropagation()} 
        className={`w-full ${isModal ? 'glass-panel-elevated max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden cursor-default' : 'glass-panel p-6 shadow-sm'}`}
      >
        {/* Gallery Top Bar */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>School Meal Photo Register</span>
              </h2>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Live kitchen logs, meal quality documentation, and photographic proof of service under PM-POSHAN
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Hidden file inputs: one for device camera, one for file picker */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelected}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="hidden"
            />

            {/* Camera Snap Button (Designed for kitchen staff phone/tablet) */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
              title="Snap photo of today's meal using device camera"
            >
              <Camera className="w-4 h-4" />
              <span>Snap Menu Photo</span>
            </button>

            {/* Upload File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Upload photo from disk"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload File</span>
            </button>

            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Close gallery (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs">
          {/* Segmented Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              All Photos ({photos.length})
            </button>
            <button
              onClick={() => setSelectedFilter('lunch')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedFilter === 'lunch'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Mid-Day Lunch
            </button>
            <button
              onClick={() => setSelectedFilter('snack')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedFilter === 'snack'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
              }`}
            >
              Morning Snack
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Ragi, Sambar, Egg)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className={`p-5 overflow-y-auto ${isModal ? 'flex-1' : ''}`}>
          {filteredPhotos.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <Utensils className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
              <p className="text-sm font-semibold">No meal photos found</p>
              <p className="text-xs text-neutral-400 mt-1">Try another search or snap a photo of today&apos;s menu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 hover:shadow-xl transition-all duration-200 flex flex-col cursor-pointer hover:border-teal-500/50"
                >
                  {/* Image Container with 16:9 Aspect Ratio */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-white font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-400" />
                        <span>{photo.date}</span>
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {photo.isVerified && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 backdrop-blur-md text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>

                    {/* View Details Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5 backdrop-blur-[2px]">
                      <Maximize2 className="w-4 h-4" />
                      <span>Inspect Photo</span>
                    </div>
                  </div>

                  {/* Metadata Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {photo.title}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                        {photo.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                      {/* Calories & Protein supplied */}
                      {photo.caloriesSuppliedKcal > 0 ? (
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5" />
                            <span>{photo.caloriesSuppliedKcal} kcal</span>
                          </span>
                          <span className="font-mono text-neutral-500 flex items-center gap-1">
                            <Scale className="w-3.5 h-3.5" />
                            <span>{photo.proteinGrams}g pro</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">Ingredient Quality Check</span>
                      )}

                      <span className="text-[10px] text-neutral-400 font-mono">
                        {photo.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="p-3 border-t border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40 text-[11px] text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Photographs are captured for daily Mid-Day Meal quality record and parent transparency.</span>
          </div>
          <span className="font-mono text-[10px]">PM-POSHAN Scheme 2026</span>
        </div>
      </div>

      {/* Lightbox / Fullscreen Photo Inspector Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="glass-panel-elevated max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl cursor-default"
          >
            {/* Image Section */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[280px]">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[85vh] w-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Sidebar */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto bg-white/95 dark:bg-neutral-900/95">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 uppercase font-mono">
                    {selectedPhoto.mealType === 'lunch' ? 'Mid-Day Lunch' : 'Morning Snack'}
                  </span>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white hidden md:block"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {selectedPhoto.title}
                </h3>

                <div className="text-xs text-neutral-500 font-mono mt-1 flex items-center gap-2">
                  <span>{selectedPhoto.date}</span>
                  <span>·</span>
                  <span>{selectedPhoto.time} IST</span>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                  {selectedPhoto.description}
                </p>

                {/* Serving Temperature */}
                {selectedPhoto.temperatureNote && (
                  <div className="mt-3 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-800/60 text-xs flex items-center gap-2">
                    <Flame className="w-4 h-4 text-teal-600" />
                    <div>
                      <span className="font-semibold text-teal-900 dark:text-teal-200">Serving Temperature: </span>
                      <span className="text-teal-700 dark:text-teal-300">{selectedPhoto.temperatureNote}</span>
                    </div>
                  </div>
                )}

                {/* Items supplied */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[10px]">
                    Menu Items Supplied
                  </span>
                  <ul className="mt-1.5 space-y-1">
                    {selectedPhoto.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition Telemetry */}
                {selectedPhoto.caloriesSuppliedKcal > 0 && (
                  <div className="mt-5 grid grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Energy Supplied</span>
                      <div className="text-base font-bold font-mono text-teal-600 dark:text-teal-400">
                        {selectedPhoto.caloriesSuppliedKcal} kcal
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono">Protein Content</span>
                      <div className="text-base font-bold font-mono text-neutral-900 dark:text-white">
                        {selectedPhoto.proteinGrams} g
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Attribution */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <div>
                  <span>Uploaded by: </span>
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{selectedPhoto.uploadedBy}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SDMC Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Snap / Upload Image Form Modal */}
      {isUploadOpen && (
        <div 
          onClick={() => setIsUploadOpen(false)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md cursor-pointer animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="glass-panel-elevated max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl cursor-default"
          >
            <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  Add Today&apos;s Meal Photo
                </h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="p-5 space-y-4 overflow-y-auto text-xs">
              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Photo Preview */}
              {uploadPreview && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-900">
                  <img
                    src={uploadPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold backdrop-blur-md flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Retake</span>
                  </button>
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Meal Title *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Wednesday Steamed Rice &amp; Mixed Vegetable Sambar"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Menu Items Supplied (comma-separated)
                </label>
                <input
                  type="text"
                  value={uploadItems}
                  onChange={(e) => setUploadItems(e.target.value)}
                  placeholder="e.g. Sona Masoori Rice (150g), Sambar (120g), Boiled Egg (50g)"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Calories (kcal / child)
                  </label>
                  <input
                    type="number"
                    value={uploadCalories}
                    onChange={(e) => setUploadCalories(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Protein (g / child)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={uploadProtein}
                    onChange={(e) => setUploadProtein(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Serving Temperature
                </label>
                <select
                  value={uploadTemp}
                  onChange={(e) => setUploadTemp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Steaming Hot (>68°C)">Steaming Hot (&gt;68°C)</option>
                  <option value="Warm (55°C - 65°C)">Warm (55°C - 65°C)</option>
                  <option value="Tepid (40°C - 50°C)">Tepid (40°C - 50°C)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes &amp; Observations
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g. Prepared with fresh drumsticks and toor dal. Clean stainless steel trays used."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-900 dark:text-white text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save to School Register</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
