import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UserCheck, KeyRound, Shirt, Package, AlertCircle, CheckCircle, XCircle, Plus, Send, Bell, MapPin, Calendar, Wrench, CheckSquare, Phone, PhoneCall } from 'lucide-react';
import { mockStorage } from '../../services/mockStorage';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const WardenDashboard = () => {
  const location = useLocation();
  const [gatePasses, setGatePasses] = useState([]);
  const [parcelsList, setParcelsList] = useState([]);
  const [laundryList, setLaundryList] = useState([]);
  const [complaintsList, setComplaintsList] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  // Filter States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSession, setAttendanceSession] = useState('EVENING');

  // Modals
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [parcelData, setParcelData] = useState({
    studentName: 'Alex Mercer',
    roomNumber: '101',
    parcelName: 'Amazon Parcel - Electronics',
    trackingNumber: ''
  });

  const loadData = () => {
    setGatePasses(mockStorage.getGatePasses().filter(g => g.status === 'PENDING'));
    setParcelsList(mockStorage.getParcels());
    setLaundryList(mockStorage.getLaundry());
    setComplaintsList(mockStorage.getComplaints());
    setAttendanceLogs(mockStorage.getAttendance());
  };

  useEffect(() => {
    loadData();
  }, [location.pathname]);

  const handleApproveGatePass = (id) => {
    mockStorage.updateGatePassStatus(id, 'APPROVED');
    toast.success('Gate Pass Approved & Digital Signature Issued!');
    loadData();
  };

  const handleRejectGatePass = (id) => {
    mockStorage.updateGatePassStatus(id, 'REJECTED');
    toast.error('Gate Pass Rejected');
    loadData();
  };

  const handleAddParcel = (e) => {
    e.preventDefault();
    if (!parcelData.trackingNumber) {
      toast.error('Please enter a valid Parcel ID / Tracking Number');
      return;
    }

    mockStorage.addParcel({
      studentName: parcelData.studentName,
      roomNumber: parcelData.roomNumber,
      courierCompany: parcelData.parcelName,
      trackingNumber: parcelData.trackingNumber,
      status: 'READY_FOR_COLLECTION'
    });

    toast.success(`📦 Parcel ${parcelData.trackingNumber} logged! Instant Notification sent to ${parcelData.studentName}!`, {
      duration: 5000,
      icon: '🔔'
    });

    setShowParcelModal(false);
    setParcelData({ studentName: 'Alex Mercer', roomNumber: '101', parcelName: 'Amazon Parcel - Electronics', trackingNumber: '' });
    loadData();
  };

  const handleConfirmArrival = (id, studentName, trackingNumber) => {
    mockStorage.confirmParcelArrival(id);
    toast.success(`🔔 PARCEL ARRIVAL CONFIRMED! Notification sent to ${studentName} for Parcel ID: ${trackingNumber}!`, {
      duration: 6000,
      icon: '📦'
    });
    loadData();
  };

  const handleUpdateLaundry = (id, newStatus) => {
    mockStorage.updateLaundryStatus(id, newStatus);
    toast.success(`Laundry status updated to ${newStatus}!`);
    loadData();
  };

  const handleResolveComplaint = (id) => {
    mockStorage.updateComplaintStatus(id, 'RESOLVED');
    toast.success('Complaint marked as RESOLVED & closed!');
    loadData();
  };

  const registeredStudents = mockStorage.getUsers().filter(u => u.role === 'STUDENT' && u.status === 'APPROVED');
  const allParents = mockStorage.getUsers().filter(u => u.role === 'PARENT');

  const getParentPhoneForStudent = (studentName, rollNumber) => {
    const parent = allParents.find(p => p.linkedStudentRoll === rollNumber || p.linkedStudentName?.toLowerCase() === studentName?.toLowerCase());
    return parent ? { name: parent.fullName, phone: parent.phoneNumber } : { name: 'Robert Mercer', phone: '+19876543211' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-100">Warden Operations Desk</h1>
          <p className="text-slate-400 text-sm mt-1">Student Emergency Parent Directory, GPS Attendance, Gate Passes, Laundry & Complaints</p>
        </div>

        <button
          onClick={() => setShowParcelModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all self-start md:self-auto"
        >
          <Package size={16} /> Log Parcel Arrival & Notify Student
        </button>
      </div>

      {/* Date-wise GPS Student Attendance Monitor with Emergency Parent Contact */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <UserCheck size={20} className="text-teal-400" /> Date-Wise GPS Attendance Monitor & Parent Contact
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Calendar size={14} className="text-teal-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-slate-100 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {['MORNING', 'AFTERNOON', 'EVENING'].map((sess) => (
                <button
                  key={sess}
                  onClick={() => setAttendanceSession(sess)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    attendanceSession === sess ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sess}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {registeredStudents.map((st) => {
            const att = attendanceLogs.find(a => a.studentName === st.fullName && a.session === attendanceSession);
            const parentInfo = getParentPhoneForStudent(st.fullName, st.rollNumber);

            return (
              <div key={st.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{st.fullName}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">Roll: {st.rollNumber || '21CSE089'}</span>
                    <span className="text-xs text-slate-400">Room {st.roomNumber || '101'}</span>
                  </div>

                  {/* EMERGENCY PARENT CONTACT BADGE */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                      <Phone size={13} className="text-amber-400" /> Parent: {parentInfo.name} ({parentInfo.phone})
                    </span>
                    <a
                      href={`tel:${parentInfo.phone}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <PhoneCall size={13} /> Call Parent
                    </a>
                  </div>

                  {att && (
                    <div className="text-[11px] text-teal-400 mt-2 flex items-center gap-1 font-mono">
                      <MapPin size={12} /> GPS Verified: Lat {att.latitude?.toFixed(4)}°, Lng {att.longitude?.toFixed(4)}° | {att.timestamp}
                    </div>
                  )}
                </div>

                <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold self-start md:self-auto ${
                  att ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}>
                  {att ? 'PRESENT (GPS VERIFIED)' : 'ABSENT / NOT MARKED YET'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Laundry Requests Lifecycle Manager */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Shirt className="text-indigo-400" size={20} /> Laundry Wash Requests Lifecycle ({laundryList.length})
        </h3>

        {laundryList.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">No active laundry requests.</div>
        ) : (
          <div className="space-y-3">
            {laundryList.map((ld) => (
              <div key={ld.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-slate-100">{ld.studentName} (Room {ld.roomNumber})</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {ld.clothesCount} Clothes | Wash Type: <span className="font-semibold text-indigo-400">{ld.washType}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Requested on: {ld.createdAt}</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {['IN_WASH', 'IRONING', 'READY_FOR_PICKUP', 'COMPLETED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateLaundry(ld.id, status)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        ld.status === status
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                          : 'border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Maintenance Complaints Desk */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <AlertCircle className="text-amber-400" size={20} /> Student Complaints Desk ({complaintsList.length})
        </h3>

        {complaintsList.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">No pending complaints filed.</div>
        ) : (
          <div className="space-y-3">
            {complaintsList.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{c.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                      c.priority === 'HIGH' || c.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {c.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{c.description}</p>
                  <div className="text-[11px] text-slate-500 mt-0.5">Student: {c.studentName} (Room {c.roomNumber}) | Filed: {c.createdAt}</div>
                </div>

                {c.status === 'RESOLVED' ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs self-start md:self-auto flex items-center gap-1">
                    <CheckSquare size={14} /> RESOLVED & CLOSED
                  </span>
                ) : (
                  <button
                    onClick={() => handleResolveComplaint(c.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
                  >
                    <Wrench size={14} /> Mark Resolved & Close
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Registered Parcels Queue */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Package className="text-amber-400" size={20} /> Student Registered Parcels Queue ({parcelsList.length})
          </h3>
        </div>

        {parcelsList.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs">No parcels registered.</div>
        ) : (
          <div className="space-y-3">
            {parcelsList.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-slate-100">{p.courierCompany}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Parcel ID / Tracking: <span className="font-mono text-amber-400 font-bold bg-slate-800 px-2 py-0.5 rounded">{p.trackingNumber}</span> | Student: {p.studentName} (Room {p.roomNumber})
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Status: {p.receivedAt}</div>
                </div>

                {p.status === 'EXPECTED_ARRIVAL' ? (
                  <button
                    onClick={() => handleConfirmArrival(p.id, p.studentName, p.trackingNumber)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
                  >
                    <Bell size={14} /> Confirm Arrival & Notify Student
                  </button>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs self-start md:self-auto flex items-center gap-1">
                    <CheckCircle size={14} /> CONFIRMED & NOTIFIED
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Gate Pass Action Queue with Parent Emergency Contact */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <KeyRound className="text-teal-400" size={20} /> Pending Gate Pass Approvals ({gatePasses.length})
        </h3>

        {gatePasses.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-sm">No pending gate pass applications</div>
        ) : (
          <div className="space-y-4">
            {gatePasses.map((gp) => {
              const parentInfo = getParentPhoneForStudent(gp.studentName, gp.rollNumber);
              return (
                <div key={gp.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{gp.studentName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-teal-400 font-mono">{gp.rollNumber}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                        <Phone size={12} /> Parent: {parentInfo.name} ({parentInfo.phone})
                      </span>
                      <a
                        href={`tel:${parentInfo.phone}`}
                        className="px-2 py-0.5 rounded-lg bg-amber-600/30 text-amber-400 hover:bg-amber-600 hover:text-white text-[11px] font-bold transition-all"
                      >
                        Call Parent
                      </a>
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Destination: <span className="text-slate-200 font-medium">{gp.destination}</span> | Reason: {gp.reason}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      From: {gp.fromTime} To: {gp.toTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveGatePass(gp.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
                    >
                      <CheckCircle size={16} /> Approve & Sign
                    </button>
                    <button
                      onClick={() => handleRejectGatePass(gp.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 font-bold text-xs transition-all"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Parcel Arrival Modal */}
      {showParcelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-amber-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-1">Log Student Parcel Arrival</h3>
            <p className="text-xs text-slate-400 mb-4">Saves parcel details and sends notification to student desk</p>

            <form onSubmit={handleAddParcel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={parcelData.studentName}
                  onChange={(e) => setParcelData({ ...parcelData, studentName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parcel Name / Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="Amazon Parcel - Electronics"
                  value={parcelData.parcelName}
                  onChange={(e) => setParcelData({ ...parcelData, parcelName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Parcel ID / Tracking Number</label>
                <input
                  type="text"
                  required
                  placeholder="AMZ-998811 / FPK-2026-99"
                  value={parcelData.trackingNumber}
                  onChange={(e) => setParcelData({ ...parcelData, trackingNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowParcelModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 text-xs font-bold hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                >
                  <Bell size={14} /> Save & Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
