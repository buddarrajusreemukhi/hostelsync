import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BedDouble, KeyRound, Shirt, Package, AlertCircle, Plus, CheckCircle, Bell, MapPin, Compass, ShieldCheck, User } from 'lucide-react';
import { mockStorage } from '../../services/mockStorage';
import api from '../../services/api';
import toast from 'react-hot-toast';

const getCurrentDateTimeLocal = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n) => (n < 10 ? '0' + n : n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const StudentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [gatePasses, setGatePasses] = useState([]);
  const [laundryList, setLaundryList] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  // Modals
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [showLaundryModal, setShowLaundryModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showRegisterParcelModal, setShowRegisterParcelModal] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);

  // GPS Geofence State
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState({ lat: 17.4455, lng: 78.3789 });
  const [insideGeofence, setInsideGeofence] = useState(true);
  const [distanceMeters, setDistanceMeters] = useState(12);
  const [selectedSession, setSelectedSession] = useState('EVENING');

  // Forms
  const [gatePassForm, setGatePassForm] = useState({
    destination: '',
    fromTime: getCurrentDateTimeLocal(0),
    toTime: getCurrentDateTimeLocal(1),
    reason: ''
  });

  const [laundryForm, setLaundryForm] = useState({
    clothesCount: 5,
    washType: 'REGULAR'
  });

  const [complaintForm, setComplaintForm] = useState({
    category: 'PLUMBING',
    priority: 'MEDIUM',
    description: ''
  });

  const [parcelForm, setParcelForm] = useState({
    parcelName: '',
    trackingNumber: ''
  });

  const loadData = () => {
    setGatePasses(mockStorage.getGatePasses());
    setLaundryList(mockStorage.getLaundry());
    setParcels(mockStorage.getParcels());
    setComplaints(mockStorage.getComplaints());
    setAttendanceLogs(mockStorage.getAttendance());
  };

  useEffect(() => {
    loadData();
    if (location.pathname === '/student/gate-pass') {
      setGatePassForm({
        destination: '',
        fromTime: getCurrentDateTimeLocal(0),
        toTime: getCurrentDateTimeLocal(1),
        reason: ''
      });
      setShowGatePassModal(true);
    }
    if (location.pathname === '/student/laundry') setShowLaundryModal(true);
    if (location.pathname === '/student/complaints') setShowComplaintModal(true);
    if (location.pathname === '/student/parcels') setShowRegisterParcelModal(true);
  }, [location.pathname]);

  const handleOpenGpsModal = () => {
    setShowGpsModal(true);
    setGpsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setInsideGeofence(true);
          setDistanceMeters(Math.floor(Math.random() * 25) + 5);
          setGpsLoading(false);
        },
        () => {
          setGpsCoords({ lat: 17.4455, lng: 78.3789 });
          setInsideGeofence(true);
          setDistanceMeters(14);
          setGpsLoading(false);
        }
      );
    } else {
      setGpsLoading(false);
    }
  };

  const handleConfirmSelfAttendance = () => {
    if (!insideGeofence) {
      toast.error('Location Error: You must be inside hostel campus to mark attendance!');
      return;
    }

    mockStorage.markStudentSelfAttendance({
      studentName: user?.fullName || 'Alex Mercer',
      rollNumber: user?.rollNumber || '21CSE089',
      session: selectedSession,
      latitude: gpsCoords.lat,
      longitude: gpsCoords.lng
    });

    toast.success(`📍 GPS GEOFENCE VERIFIED! Attendance marked PRESENT for ${selectedSession} session!`, {
      duration: 6000,
      icon: '✅'
    });

    setShowGpsModal(false);
    loadData();
  };

  const handleApplyGatePass = (e) => {
    e.preventDefault();
    if (!gatePassForm.destination || !gatePassForm.reason) {
      toast.error('Please enter a valid destination and reason.');
      return;
    }

    mockStorage.addGatePass({
      studentId: user?.id,
      studentName: user?.fullName || 'Student User',
      rollNumber: user?.rollNumber || '21CSE089',
      destination: gatePassForm.destination,
      fromTime: gatePassForm.fromTime.replace('T', ' '),
      toTime: gatePassForm.toTime.replace('T', ' '),
      reason: gatePassForm.reason
    });

    toast.success('Gate Pass Application Submitted to Warden!');
    setShowGatePassModal(false);
    setGatePassForm({
      destination: '',
      fromTime: getCurrentDateTimeLocal(0),
      toTime: getCurrentDateTimeLocal(1),
      reason: ''
    });
    loadData();
  };

  const handleRegisterParcel = (e) => {
    e.preventDefault();
    if (!parcelForm.parcelName || !parcelForm.trackingNumber) {
      toast.error('Please enter Parcel Name and Parcel ID');
      return;
    }

    mockStorage.addParcel({
      studentName: user?.fullName || 'Student User',
      roomNumber: user?.roomNumber || '101',
      courierCompany: parcelForm.parcelName,
      trackingNumber: parcelForm.trackingNumber,
      status: 'EXPECTED_ARRIVAL'
    });

    toast.success(`📦 Expected Parcel alert submitted for ${parcelForm.parcelName}! Warden will be notified upon arrival.`, {
      duration: 5000,
      icon: '🔔'
    });

    setShowRegisterParcelModal(false);
    setParcelForm({ parcelName: '', trackingNumber: '' });
    loadData();
  };

  const handleRequestLaundry = (e) => {
    e.preventDefault();
    mockStorage.addLaundry({
      studentName: user?.fullName || 'Student User',
      roomNumber: user?.roomNumber || '101',
      ...laundryForm
    });
    toast.success('Laundry wash request submitted successfully!');
    setShowLaundryModal(false);
    loadData();
  };

  const handleFileComplaint = (e) => {
    e.preventDefault();
    mockStorage.addComplaint({
      studentName: user?.fullName || 'Student User',
      roomNumber: user?.roomNumber || '101',
      ...complaintForm
    });
    toast.success('Complaint filed with Maintenance Desk!');
    setShowComplaintModal(false);
    setComplaintForm({ category: 'PLUMBING', priority: 'MEDIUM', description: '' });
    loadData();
  };

  const hasCustomPhoto = user?.profilePhotoType === 'CUSTOM' && user?.profilePhotoUrl;

  const getInitials = (name) => {
    if (!name) return 'AM';
    const parts = name.split(' ');
    return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {hasCustomPhoto ? (
            <img
              src={user.profilePhotoUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 text-2xl shadow-xl">
              {getInitials(user?.fullName)}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black text-slate-100">{user?.fullName || 'Alex Mercer'}</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold border border-indigo-500/30">
                {user?.rollNumber || '21CSE089'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">{user?.department || 'Computer Science Engineering'} • {user?.yearOfStudy || '3rd Year'}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700">
                <BedDouble size={14} className="text-indigo-400" /> Room {user?.roomNumber || '101'} (Block A - Alpha)
              </span>
            </div>
          </div>
        </div>

        <div className="text-center md:text-right bg-slate-900/60 p-4 rounded-2xl border border-slate-800 min-w-[160px]">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">98.2%</div>
          <div className="text-[11px] text-emerald-400/80 font-medium mt-1">Status: Marked Present via GPS</div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleOpenGpsModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all border border-teal-400/30 animate-pulse"
        >
          <MapPin size={16} /> Mark GPS Geofenced Attendance
        </button>
        <button
          onClick={() => {
            setGatePassForm({
              destination: '',
              fromTime: getCurrentDateTimeLocal(0),
              toTime: getCurrentDateTimeLocal(1),
              reason: ''
            });
            setShowGatePassModal(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
        >
          <KeyRound size={16} /> Apply Gate Pass
        </button>
        <button
          onClick={() => setShowRegisterParcelModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
        >
          <Package size={16} /> Register Expected Parcel
        </button>
        <button
          onClick={() => setShowLaundryModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Shirt size={16} /> Request Laundry
        </button>
        <button
          onClick={() => setShowComplaintModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs transition-all"
        >
          <AlertCircle size={16} /> File Complaint
        </button>
      </div>

      {/* Services Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gate Pass Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <KeyRound size={20} className="text-emerald-400" /> Gate Pass Status
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                gatePasses[0]?.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {gatePasses[0]?.status || 'NO ACTIVE PASS'}
              </span>
            </div>
            {gatePasses.length > 0 ? (
              <p className="text-slate-400 text-xs leading-relaxed">
                Pass to <span className="text-slate-200 font-semibold">{gatePasses[0].destination}</span> is {gatePasses[0].status.toLowerCase()}. Present digital pass at gate.
              </p>
            ) : (
              <p className="text-slate-400 text-xs">No active gate pass application found.</p>
            )}
          </div>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => {
                setGatePassForm({
                  destination: '',
                  fromTime: getCurrentDateTimeLocal(0),
                  toTime: getCurrentDateTimeLocal(1),
                  reason: ''
                });
                setShowGatePassModal(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Plus size={16} /> Apply New Gate Pass
            </button>
          </div>
        </div>

        {/* Laundry Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <Shirt size={20} className="text-indigo-400" /> Laundry Tracker
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                {laundryList[0]?.status || 'IDLE'}
              </span>
            </div>
            {laundryList.length > 0 ? (
              <p className="text-slate-400 text-xs leading-relaxed">
                {laundryList[0].clothesCount} Clothes ({laundryList[0].washType} wash) submitted. Cycle status: <span className="text-indigo-400 font-bold">{laundryList[0].status}</span>
              </p>
            ) : (
              <p className="text-slate-400 text-xs">No active laundry wash request.</p>
            )}
          </div>
          <div className="mt-6 space-y-3">
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-500 h-full w-[65%]" />
            </div>
            <button
              onClick={() => setShowLaundryModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={16} /> Request Laundry Wash
            </button>
          </div>
        </div>

        {/* Parcel Registration Card */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
                <Package size={20} className="text-amber-400" /> Expected Parcels
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1">
                <Bell size={12} /> {parcels.length} Registered
              </span>
            </div>
            {parcels.length > 0 ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-300">
                  Parcel Name: <span className="font-bold text-slate-100">{parcels[0].courierCompany}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Parcel ID / Tracking: <span className="font-mono text-amber-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{parcels[0].trackingNumber}</span>
                </div>
                <div className="text-[11px] text-amber-400 font-semibold mt-1">
                  Status: {parcels[0].status === 'READY_FOR_COLLECTION' ? '✅ Arrived at Warden Desk! Please Collect.' : '⏳ Awaiting Warden Arrival Confirmation'}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs">No registered expected parcels.</p>
            )}
          </div>

          <button
            onClick={() => setShowRegisterParcelModal(true)}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20"
          >
            <Plus size={16} /> Register Expected Parcel
          </button>
        </div>
      </div>

      {/* Attendance History Section */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MapPin size={20} className="text-teal-400" /> GPS Geofenced Self-Attendance Logs ({attendanceLogs.length})
          </h3>
          <button
            onClick={handleOpenGpsModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/20 transition-all"
          >
            <MapPin size={14} /> Mark Attendance Now
          </button>
        </div>

        {attendanceLogs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">No GPS attendance logs recorded yet.</div>
        ) : (
          <div className="space-y-3">
            {attendanceLogs.map((a) => (
              <div key={a.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{a.session} Session</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 font-mono font-bold">
                      GPS GEOFENCE VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Coordinates: Lat {a.latitude?.toFixed(4)}° N, Lng {a.longitude?.toFixed(4)}° E | Timestamp: {a.timestamp}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GPS Geofenced Attendance Modal */}
      {showGpsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-teal-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto mb-3 shadow-lg">
                <Compass size={28} className={gpsLoading ? 'animate-spin' : ''} />
              </div>
              <h3 className="text-xl font-bold text-slate-100">GPS Geofenced Self-Attendance</h3>
              <p className="text-xs text-slate-400 mt-1">Verifying your physical location inside Hostel Campus</p>
            </div>

            {gpsLoading ? (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
                <span className="w-8 h-8 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
                <span>Acquiring GPS Satellite Coordinates...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current GPS Latitude:</span>
                    <span className="font-mono text-teal-400 font-bold">{gpsCoords.lat.toFixed(4)}° N</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Current GPS Longitude:</span>
                    <span className="font-mono text-teal-400 font-bold">{gpsCoords.lng.toFixed(4)}° E</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Distance from Hostel Center:</span>
                    <span className="font-mono text-emerald-400 font-bold">{distanceMeters} meters</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <ShieldCheck size={18} className="shrink-0" />
                  <span>LOCATION VERIFIED: You are physically inside Hostel Campus Geofence Bounds.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Select Attendance Session</label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-teal-500"
                  >
                    <option value="MORNING">Morning Session (08:00 AM)</option>
                    <option value="AFTERNOON">Afternoon Session (02:00 PM)</option>
                    <option value="EVENING">Evening Session (08:00 PM)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowGpsModal(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-400 text-xs font-bold hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSelfAttendance}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> Confirm & Mark Present
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Register Expected Parcel Modal */}
      {showRegisterParcelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-1">Register Expected Parcel Alert</h3>
            <p className="text-xs text-slate-400 mb-4">Enter your parcel name and tracking ID. You will be notified as soon as Warden confirms arrival.</p>

            <form onSubmit={handleRegisterParcel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parcel Name / Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="Amazon Laptop Charger / Flipkart Clothes"
                  value={parcelForm.parcelName}
                  onChange={(e) => setParcelForm({ ...parcelForm, parcelName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parcel ID / Tracking Number</label>
                <input
                  type="text"
                  required
                  placeholder="AMZ-99120 / FPK-8812"
                  value={parcelForm.trackingNumber}
                  onChange={(e) => setParcelForm({ ...parcelForm, trackingNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowRegisterParcelModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Bell size={14} /> Register & Set Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gate Pass Modal */}
      {showGatePassModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-emerald-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Apply for Hostel Gate Pass</h3>

            <form onSubmit={handleApplyGatePass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Address</label>
                <input
                  type="text"
                  required
                  placeholder="Home / City Hospital / Exam Center"
                  value={gatePassForm.destination}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">From Date/Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={gatePassForm.fromTime}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, fromTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">To Date/Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={gatePassForm.toTime}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, toTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Leave</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide valid reason..."
                  value={gatePassForm.reason}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowGatePassModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-4">File Maintenance Complaint</h3>

            <form onSubmit={handleFileComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={complaintForm.category}
                  onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500"
                >
                  <option value="PLUMBING">Plumbing & Water</option>
                  <option value="ELECTRICAL">Electrical & Fan/Light</option>
                  <option value="CLEANLINESS">Room / Floor Cleanliness</option>
                  <option value="FOOD_QUALITY">Mess Food Quality</option>
                  <option value="CARPENTRY">Furniture / Carpentry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                <select
                  value={complaintForm.priority}
                  onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent / Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Complaint Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30"
                >
                  File Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Laundry Modal */}
      {showLaundryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-indigo-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Submit Laundry Request</h3>

            <form onSubmit={handleRequestLaundry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Clothes Count</label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  required
                  value={laundryForm.clothesCount}
                  onChange={(e) => setLaundryForm({ ...laundryForm, clothesCount: parseInt(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wash Type</label>
                <select
                  value={laundryForm.washType}
                  onChange={(e) => setLaundryForm({ ...laundryForm, washType: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500"
                >
                  <option value="REGULAR">Regular Wash & Dry</option>
                  <option value="PREMIUM">Premium Wash & Steam Iron</option>
                  <option value="DRY_CLEAN">Dry Cleaning</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowLaundryModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  Submit Laundry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
