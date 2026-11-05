/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Nearby Primary Health Centres (PHC) & Grain Godown Locator
 * Powered by Google Maps Platform (@vis.gl/react-google-maps)
 * Interactive spatial map for child growth medical referrals and PM-POSHAN supply logistics.
 */

import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Navigation, 
  Hospital, 
  Warehouse, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  School,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow 
} from '@vis.gl/react-google-maps';

export interface HealthFacility {
  id: string;
  name: string;
  type: 'phc' | 'taluk_hospital' | 'fci_godown';
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  doctorInCharge?: string;
  contact: string;
  hours: string;
  availableServices: string[];
}

interface HealthCentresMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SCHOOL_LOCATION = {
  name: 'Govt. Model Primary School, Chandapura (Base Campus)',
  lat: 12.7915,
  lng: 77.6940,
  address: 'Near Bus Stand, Chandapura Circle, Anekal Taluk, Bengaluru',
};

export const FACILITIES: HealthFacility[] = [
  {
    id: 'fac-1',
    name: 'Primary Health Centre (PHC) Chandapura',
    type: 'phc',
    distanceKm: 1.8,
    lat: 12.7950,
    lng: 77.6990,
    address: 'Main Road, Chandapura, Anekal Taluk, Bengaluru Rural',
    doctorInCharge: 'Dr. Shilpa K., MBBS, DCH (Pediatrics)',
    contact: '+91 80 2783 2240',
    hours: '09:00 AM - 04:30 PM (Mon-Sat)',
    availableServices: ['RBSK Child Health Screening', 'Iron & Folic Acid Drops', 'Growth Monitoring & Deworming'],
  },
  {
    id: 'fac-2',
    name: 'Government Taluk General Hospital, Anekal',
    type: 'taluk_hospital',
    distanceKm: 6.4,
    lat: 12.7118,
    lng: 77.6961,
    address: 'Hospital Road, Anekal Town, Karnataka',
    doctorInCharge: 'Dr. M. N. Raghavendra, MD (Pediatrics)',
    contact: '+91 80 2785 1102',
    hours: '24/7 Emergency & Outpatient 8 AM - 8 PM',
    availableServices: ['Specialist Pediatric Clinic', 'Nutrition Rehabilitation Centre (NRC)', 'Diagnostic Pathology'],
  },
  {
    id: 'fac-3',
    name: 'Food Corporation of India (FCI) Taluk Food Supply Godown',
    type: 'fci_godown',
    distanceKm: 4.2,
    lat: 12.7180,
    lng: 77.7050,
    address: 'APMC Yard, Attibele Road, Anekal',
    doctorInCharge: 'K. R. Vasanth (Taluk Food Inspector)',
    contact: '+91 80 2783 9912',
    hours: '08:30 AM - 05:00 PM',
    availableServices: ['PM-POSHAN Fortified Rice Allocation', 'Buffer Stock Inspection', 'Weight & Moisture Certification'],
  },
  {
    id: 'fac-4',
    name: 'Community Health Centre (CHC) Dommasandra',
    type: 'phc',
    distanceKm: 8.1,
    lat: 12.8710,
    lng: 77.7490,
    address: 'Sarjapur-Attibele Road, Dommasandra',
    doctorInCharge: 'Dr. Prakash Babu, DNB',
    contact: '+91 80 2782 5541',
    hours: '09:00 AM - 04:30 PM',
    availableServices: ['Adolescent Health Clinic', 'Vision & Dental Checkup', 'Weekly Nutrition Advisory'],
  },
  {
    id: 'fac-5',
    name: 'Primary Health Centre (PHC) Jigani',
    type: 'phc',
    distanceKm: 5.9,
    lat: 12.7825,
    lng: 77.6405,
    address: 'Industrial Area Main Road, Jigani, Anekal Taluk',
    doctorInCharge: 'Dr. Kavitha S., MBBS',
    contact: '+91 80 2782 6610',
    hours: '09:00 AM - 04:30 PM',
    availableServices: ['Childhood Immunization', 'Malnutrition Interventions', 'School Health Camp Follow-ups'],
  },
];

export const HealthCentresMapModal: React.FC<HealthCentresMapModalProps> = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState<'all' | 'phc' | 'taluk_hospital' | 'fci_godown'>('all');
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(FACILITIES[0]);
  const [isSchoolSelected, setIsSchoolSelected] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 12.7650, lng: 77.6950 });

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = filterType === 'all' ? FACILITIES : FACILITIES.filter((f) => f.type === filterType);

  const handleSelectFacility = (fac: HealthFacility) => {
    setSelectedFacility(fac);
    setIsSchoolSelected(false);
    setMapCenter({ lat: fac.lat, lng: fac.lng });
  };

  const handleSelectSchool = () => {
    setIsSchoolSelected(true);
    setSelectedFacility(null);
    setMapCenter({ lat: SCHOOL_LOCATION.lat, lng: SCHOOL_LOCATION.lng });
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
    >
      <div className="glass-panel-elevated w-full max-w-5xl h-[92vh] max-h-[860px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 cursor-default rounded-2xl">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/60 dark:bg-neutral-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base md:text-lg text-neutral-900 dark:text-white tracking-tight">
                  Healthcare Referral Centres &amp; Food Logistics Map
                </h3>
                <p className="text-xs text-neutral-500">
                  Google Maps spatial locator · Primary Health Centres (PHC), Community Hospitals &amp; FCI Grain Reserves
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close map"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills Bar */}
        <div className="px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 bg-neutral-50/80 dark:bg-neutral-950/50 text-xs">
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-neutral-900/50'
              }`}
            >
              All Locations ({FACILITIES.length})
            </button>
            <button
              onClick={() => setFilterType('phc')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                filterType === 'phc'
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-neutral-900/50'
              }`}
            >
              <Hospital className="w-3.5 h-3.5" />
              <span>Primary Health (PHC/CHC)</span>
            </button>
            <button
              onClick={() => setFilterType('fci_godown')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                filterType === 'fci_godown'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-neutral-900/50'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span>FCI Grain Godowns</span>
            </button>
          </div>

          <button
            onClick={handleSelectSchool}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSchoolSelected 
                ? 'bg-amber-500 text-neutral-950 font-bold' 
                : 'text-amber-700 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
            }`}
          >
            <School className="w-3.5 h-3.5 text-amber-500" />
            <span>School Campus Base</span>
          </button>
        </div>

        {/* Main Content Area: Split View with Google Maps & Facility List */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Interactive Google Map Panel */}
          <div className="flex-1 h-64 sm:h-80 lg:h-full w-full relative bg-neutral-100 dark:bg-neutral-950">
            <APIProvider apiKey={apiKey}>
              <Map
                center={mapCenter}
                zoom={12}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {/* School Base Campus Marker */}
                <AdvancedMarker
                  position={{ lat: SCHOOL_LOCATION.lat, lng: SCHOOL_LOCATION.lng }}
                  onClick={handleSelectSchool}
                  title={SCHOOL_LOCATION.name}
                >
                  <Pin 
                    background="#f59e0b" 
                    glyphColor="#000000" 
                    borderColor="#b45309"
                    scale={1.15}
                  />
                </AdvancedMarker>

                {/* Health & Godown Facility Markers */}
                {filtered.map((fac) => {
                  const isSelected = selectedFacility?.id === fac.id;
                  const isGodown = fac.type === 'fci_godown';
                  return (
                    <AdvancedMarker
                      key={fac.id}
                      position={{ lat: fac.lat, lng: fac.lng }}
                      onClick={() => handleSelectFacility(fac)}
                      title={fac.name}
                    >
                      <Pin
                        background={isGodown ? '#6366f1' : '#0d9488'}
                        glyphColor="#ffffff"
                        borderColor="#ffffff"
                        scale={isSelected ? 1.25 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {/* Active InfoWindow for School */}
                {isSchoolSelected && (
                  <InfoWindow
                    position={{ lat: SCHOOL_LOCATION.lat, lng: SCHOOL_LOCATION.lng }}
                    onCloseClick={() => setIsSchoolSelected(false)}
                  >
                    <div className="p-2 max-w-xs text-neutral-900">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 mb-1">
                        <School className="w-3.5 h-3.5" />
                        <span>Central Base Campus</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{SCHOOL_LOCATION.name}</h4>
                      <p className="text-xs text-neutral-600 mb-2">{SCHOOL_LOCATION.address}</p>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">
                        Roll Call Active · Grades 5–8
                      </span>
                    </div>
                  </InfoWindow>
                )}

                {/* Active InfoWindow for Facility */}
                {selectedFacility && (
                  <InfoWindow
                    position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                    onCloseClick={() => setSelectedFacility(null)}
                  >
                    <div className="p-2 max-w-xs text-neutral-900">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-teal-600 mb-1">
                        {selectedFacility.type === 'fci_godown' ? (
                          <Warehouse className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <Hospital className="w-3.5 h-3.5 text-teal-600" />
                        )}
                        <span>{selectedFacility.distanceKm} km from School</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1 leading-snug">{selectedFacility.name}</h4>
                      <p className="text-xs text-neutral-600 mb-2">{selectedFacility.address}</p>
                      {selectedFacility.doctorInCharge && (
                        <p className="text-[11px] text-neutral-700 mb-2">
                          <strong>Officer:</strong> {selectedFacility.doctorInCharge}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1 border-t border-neutral-200">
                        <a
                          href={`tel:${selectedFacility.contact}`}
                          className="text-[11px] font-semibold text-teal-600 flex items-center gap-1 hover:underline"
                        >
                          <Phone className="w-3 h-3" /> Call
                        </a>
                        <span>·</span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.lat},${selectedFacility.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-teal-600 flex items-center gap-1 hover:underline"
                        >
                          <Navigation className="w-3 h-3" /> Directions
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-md text-[11px] flex items-center gap-3 pointer-events-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">School</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">Health (PHC)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">Grain Godown</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Facility Details & Action Cards */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                Centres Available: {filtered.length}
              </span>
              <span className="text-neutral-500 text-[11px]">Click to inspect &amp; center map</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {filtered.map((fac) => {
                const isSelected = selectedFacility?.id === fac.id;
                return (
                  <div
                    key={fac.id}
                    onClick={() => handleSelectFacility(fac)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 shadow-xs ring-1 ring-teal-500/30'
                        : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {fac.type === 'fci_godown' ? (
                            <Warehouse className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          ) : (
                            <Hospital className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          )}
                          <h4 className="font-bold text-neutral-900 dark:text-white text-xs leading-tight">
                            {fac.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-1">
                          {fac.address}
                        </p>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono font-bold text-[10px] shrink-0">
                        {fac.distanceKm} km
                      </span>
                    </div>

                    {fac.doctorInCharge && (
                      <div className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-2">
                        Officer: <span className="font-semibold">{fac.doctorInCharge}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {fac.availableServices.map((svc, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 dark:text-neutral-400"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2.5 mt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                      <a
                        href={`tel:${fac.contact}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3 h-3 text-teal-600" />
                        <span>{fac.contact}</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-teal-600 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Directions</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 flex items-center justify-between">
              <span className="text-[11px] text-neutral-500">
                Official PM-POSHAN &amp; RBSK Directory
              </span>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs rounded-lg hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
