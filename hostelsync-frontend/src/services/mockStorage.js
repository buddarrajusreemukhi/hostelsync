// Mock Storage for interactive preview mode state persistence

const INITIAL_USERS = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    email: 'admin@hostelsync.com',
    fullName: 'System Administrator',
    role: 'ADMIN',
    status: 'APPROVED',
    gender: 'MALE',
    profilePhotoUrl: null,
    profilePhotoType: 'DEFAULT'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    email: 'warden@hostelsync.com',
    fullName: 'Chief Warden',
    role: 'WARDEN',
    status: 'APPROVED',
    gender: 'MALE',
    profilePhotoUrl: null,
    profilePhotoType: 'DEFAULT'
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    email: 'student@university.edu',
    fullName: 'Alex Mercer',
    role: 'STUDENT',
    status: 'APPROVED',
    gender: 'MALE',
    rollNumber: '21CSE089',
    department: 'Computer Science Engineering',
    yearOfStudy: '3rd Year',
    roomNumber: '101',
    blockName: 'Block A - Alpha',
    parentName: 'Robert Mercer',
    parentPhone: '+19876543211',
    profilePhotoUrl: null,
    profilePhotoType: 'DEFAULT'
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    email: 'parent@email.com',
    fullName: 'Robert Mercer',
    role: 'PARENT',
    status: 'APPROVED',
    gender: 'MALE',
    phoneNumber: '+19876543211',
    linkedStudentName: 'Alex Mercer',
    linkedStudentRoll: '21CSE089',
    profilePhotoUrl: null,
    profilePhotoType: 'DEFAULT'
  }
];

const INITIAL_GATE_PASSES = [
  {
    id: 'gp-109',
    studentId: 'c3333333-3333-3333-3333-333333333333',
    studentName: 'Alex Mercer',
    rollNumber: '21CSE089',
    parentName: 'Robert Mercer',
    parentPhone: '+19876543211',
    destination: 'Home - Medical Appointment',
    fromTime: '2026-08-03 09:00',
    toTime: '2026-08-04 18:00',
    reason: 'Doctor Checkup',
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_COMPLAINTS = [
  {
    id: 'cmp-101',
    studentName: 'Alex Mercer',
    roomNumber: '101',
    category: 'PLUMBING',
    priority: 'HIGH',
    description: 'Bathroom tap leaking continuously',
    status: 'PENDING',
    createdAt: '2026-08-02'
  }
];

const INITIAL_LAUNDRY = [
  {
    id: 'ld-44',
    studentName: 'Alex Mercer',
    roomNumber: '101',
    clothesCount: 5,
    washType: 'PREMIUM',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-02'
  }
];

const INITIAL_PARCELS = [
  {
    id: 'pc-88',
    studentName: 'Alex Mercer',
    roomNumber: '101',
    courierCompany: 'Amazon Laptop Charger',
    trackingNumber: 'AMZ-99120',
    status: 'EXPECTED_ARRIVAL',
    receivedAt: 'Pending Warden Confirmation'
  }
];

const INITIAL_ATTENDANCE = [
  {
    id: 'att-1',
    studentName: 'Alex Mercer',
    rollNumber: '21CSE089',
    session: 'EVENING',
    status: 'PRESENT',
    verificationMethod: 'GPS_GEOFENCE',
    latitude: 17.4455,
    longitude: 78.3789,
    timestamp: '2026-08-02 08:00:00 PM'
  }
];

class MockStorageService {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('hs_users')) {
      localStorage.setItem('hs_users', JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem('hs_gate_passes')) {
      localStorage.setItem('hs_gate_passes', JSON.stringify(INITIAL_GATE_PASSES));
    }
    if (!localStorage.getItem('hs_complaints')) {
      localStorage.setItem('hs_complaints', JSON.stringify(INITIAL_COMPLAINTS));
    }
    if (!localStorage.getItem('hs_laundry')) {
      localStorage.setItem('hs_laundry', JSON.stringify(INITIAL_LAUNDRY));
    }
    if (!localStorage.getItem('hs_parcels')) {
      localStorage.setItem('hs_parcels', JSON.stringify(INITIAL_PARCELS));
    }
    if (!localStorage.getItem('hs_attendance')) {
      localStorage.setItem('hs_attendance', JSON.stringify(INITIAL_ATTENDANCE));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('hs_users') || '[]');
  }

  registerStudent(data) {
    const users = this.getUsers();
    const newUser = {
      id: 'usr-' + Date.now(),
      ...data,
      role: 'STUDENT',
      status: 'PENDING_APPROVAL',
      parentName: data.parentName || 'Parent Contact',
      parentPhone: data.parentPhone || '+19876543211',
      profilePhotoUrl: null,
      profilePhotoType: 'DEFAULT',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('hs_users', JSON.stringify(users));
    return newUser;
  }

  registerParent(data) {
    const users = this.getUsers();
    const newUser = {
      id: 'usr-' + Date.now(),
      ...data,
      role: 'PARENT',
      status: 'PENDING_APPROVAL',
      profilePhotoUrl: null,
      profilePhotoType: 'DEFAULT',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('hs_users', JSON.stringify(users));
    return newUser;
  }

  getPendingApprovals() {
    return this.getUsers().filter(u => u.status === 'PENDING_APPROVAL');
  }

  approveUser(userId) {
    const users = this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, status: 'APPROVED' } : u);
    localStorage.setItem('hs_users', JSON.stringify(updated));
  }

  rejectUser(userId) {
    const users = this.getUsers();
    const updated = users.filter(u => u.id !== userId);
    localStorage.setItem('hs_users', JSON.stringify(updated));
  }

  getGatePasses() {
    return JSON.parse(localStorage.getItem('hs_gate_passes') || '[]');
  }

  addGatePass(data) {
    const passes = this.getGatePasses();
    const newPass = {
      id: 'gp-' + Date.now().toString().slice(-4),
      studentId: data.studentId || 'c3333333-3333-3333-3333-333333333333',
      studentName: data.studentName || 'Alex Mercer',
      rollNumber: data.rollNumber || '21CSE089',
      parentName: data.parentName || 'Robert Mercer',
      parentPhone: data.parentPhone || '+19876543211',
      destination: data.destination,
      fromTime: data.fromTime,
      toTime: data.toTime,
      reason: data.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    passes.unshift(newPass);
    localStorage.setItem('hs_gate_passes', JSON.stringify(passes));
    return newPass;
  }

  updateGatePassStatus(id, status) {
    const passes = this.getGatePasses();
    const updated = passes.map(g => g.id === id ? { ...g, status } : g);
    localStorage.setItem('hs_gate_passes', JSON.stringify(updated));
  }

  getComplaints() {
    return JSON.parse(localStorage.getItem('hs_complaints') || '[]');
  }

  addComplaint(data) {
    const list = this.getComplaints();
    const item = {
      id: 'cmp-' + Date.now().toString().slice(-4),
      studentName: data.studentName || 'Alex Mercer',
      roomNumber: data.roomNumber || '101',
      ...data,
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(item);
    localStorage.setItem('hs_complaints', JSON.stringify(list));
    return item;
  }

  updateComplaintStatus(id, status) {
    const list = this.getComplaints();
    const updated = list.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem('hs_complaints', JSON.stringify(list));
  }

  getLaundry() {
    return JSON.parse(localStorage.getItem('hs_laundry') || '[]');
  }

  addLaundry(data) {
    const list = this.getLaundry();
    const item = {
      id: 'ld-' + Date.now().toString().slice(-4),
      studentName: data.studentName || 'Alex Mercer',
      roomNumber: data.roomNumber || '101',
      ...data,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString().split('T')[0]
    };
    list.unshift(item);
    localStorage.setItem('hs_laundry', JSON.stringify(list));
    return item;
  }

  updateLaundryStatus(id, status) {
    const list = this.getLaundry();
    const updated = list.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem('hs_laundry', JSON.stringify(updated));
  }

  getParcels() {
    return JSON.parse(localStorage.getItem('hs_parcels') || '[]');
  }

  addParcel(data) {
    const list = this.getParcels();
    const item = {
      id: 'pc-' + Date.now().toString().slice(-4),
      studentName: data.studentName || 'Alex Mercer',
      roomNumber: data.roomNumber || '101',
      courierCompany: data.courierCompany,
      trackingNumber: data.trackingNumber,
      status: data.status || 'EXPECTED_ARRIVAL',
      receivedAt: data.status === 'READY_FOR_COLLECTION' ? new Date().toLocaleString() : 'Pending Warden Confirmation'
    };
    list.unshift(item);
    localStorage.setItem('hs_parcels', JSON.stringify(list));
    return item;
  }

  confirmParcelArrival(id) {
    const list = this.getParcels();
    const updated = list.map(p => p.id === id ? { ...p, status: 'READY_FOR_COLLECTION', receivedAt: new Date().toLocaleString() } : p);
    localStorage.setItem('hs_parcels', JSON.stringify(updated));
  }

  getAttendance() {
    return JSON.parse(localStorage.getItem('hs_attendance') || '[]');
  }

  markStudentSelfAttendance(data) {
    const list = this.getAttendance();
    const item = {
      id: 'att-' + Date.now().toString().slice(-4),
      studentName: data.studentName || 'Alex Mercer',
      rollNumber: data.rollNumber || '21CSE089',
      session: data.session || 'EVENING',
      status: 'PRESENT',
      verificationMethod: 'GPS_GEOFENCE',
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toLocaleString()
    };
    list.unshift(item);
    localStorage.setItem('hs_attendance', JSON.stringify(list));
    return item;
  }
}

export const mockStorage = new MockStorageService();
