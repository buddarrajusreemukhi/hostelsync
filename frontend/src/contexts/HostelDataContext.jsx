import React, { createContext, useContext, useState, useEffect } from 'react';

const HostelDataContext = createContext();

export const HostelDataProvider = ({ children }) => {
  // Persistence via LocalStorage
  const getInitial = (key, fallback) => {
    const saved = localStorage.getItem(`hostelsync_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  };

  // Pre-seeded Default Accounts
  const initialUsers = [
    {
      id: 'usr-admin-1',
      username: 'admin',
      email: 'admin@hostelsync.com',
      password: 'Admin@123',
      fullName: 'Super Administrator',
      mobileNumber: '+91 9876543210',
      gender: 'Male',
      role: 'ADMIN',
      verified: true,
      approved: true,
      pending: false,
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-warden-1',
      username: 'warden',
      email: 'warden@hostelsync.com',
      password: 'Warden@123',
      fullName: 'Chief Warden R. K. Sharma',
      mobileNumber: '+91 9876543211',
      gender: 'Male',
      role: 'WARDEN',
      verified: true,
      approved: true,
      pending: false,
      hostelAssigned: 'Titanium Boys Block A',
      employeeId: 'EMP-WRD-001',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ];

  // Pre-seeded Students & Parents for live functional testing
  const initialStudents = [
    {
      id: 'std-101',
      userId: 'usr-std-1',
      fullName: 'Rahul Varma',
      email: 'rahul.v@hostelsync.edu',
      rollNumber: 'CS2024-045',
      department: 'Computer Science',
      year: 3,
      course: 'B.Tech CS',
      roomNumber: 'A-304',
      hostelName: 'Titanium Boys Block A',
      gender: 'Male',
      dateOfBirth: '2004-05-14',
      bloodGroup: 'O+',
      emergencyContact: '+91 9123456780',
      parentEmail: 'parent.rahul@gmail.com',
      parentMobile: '+91 9898989898',
      address: 'Plot 42, Jubilee Hills, Hyderabad',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      attendancePct: 92.5,
      disciplineScore: 'Excellent'
    },
    {
      id: 'std-102',
      userId: 'usr-std-2',
      fullName: 'Ananya Sharma',
      email: 'ananya.s@hostelsync.edu',
      rollNumber: 'EC2024-012',
      department: 'Electronics',
      year: 2,
      course: 'B.Tech ECE',
      roomNumber: 'B-108',
      hostelName: 'Emerald Girls Block B',
      gender: 'Female',
      dateOfBirth: '2005-09-20',
      bloodGroup: 'B+',
      emergencyContact: '+91 9123456781',
      parentEmail: 'parent.ananya@gmail.com',
      parentMobile: '+91 9797979797',
      address: 'Flat 302, Green Glen Layout, Bangalore',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      attendancePct: 88.0,
      disciplineScore: 'Good'
    }
  ];

  const initialParents = [
    {
      id: 'prn-201',
      userId: 'usr-prn-1',
      fullName: 'Suresh Varma',
      email: 'parent.rahul@gmail.com',
      mobileNumber: '+91 9898989898',
      childRollNumber: 'CS2024-045',
      occupation: 'Software Director',
      relationship: 'Father',
      address: 'Plot 42, Jubilee Hills, Hyderabad'
    }
  ];

  const initialHostels = [
    {
      id: 'hst-1',
      name: 'Titanium Boys Block A',
      type: 'Boys',
      capacity: 120,
      occupied: 98,
      wardenName: 'Chief Warden R. K. Sharma',
      floors: [
        { floorNumber: 1, totalRooms: 10, occupiedBeds: 28, capacityBeds: 30 },
        { floorNumber: 2, totalRooms: 10, occupiedBeds: 30, capacityBeds: 30 },
        { floorNumber: 3, totalRooms: 10, occupiedBeds: 26, capacityBeds: 30 },
        { floorNumber: 4, totalRooms: 10, occupiedBeds: 14, capacityBeds: 30 }
      ]
    },
    {
      id: 'hst-2',
      name: 'Emerald Girls Block B',
      type: 'Girls',
      capacity: 100,
      occupied: 75,
      wardenName: 'Warden Sunita Mehta',
      floors: [
        { floorNumber: 1, totalRooms: 10, occupiedBeds: 25, capacityBeds: 25 },
        { floorNumber: 2, totalRooms: 10, occupiedBeds: 25, capacityBeds: 25 },
        { floorNumber: 3, totalRooms: 10, occupiedBeds: 15, capacityBeds: 25 },
        { floorNumber: 4, totalRooms: 10, occupiedBeds: 10, capacityBeds: 25 }
      ]
    }
  ];

  const initialAttendances = [
    {
      id: 'att-1',
      studentRollNumber: 'CS2024-045',
      date: new Date().toISOString().split('T')[0],
      morning: 'PRESENT',
      afternoon: 'PRESENT',
      evening: 'NOT_MARKED',
      remarks: 'On time'
    },
    {
      id: 'att-2',
      studentRollNumber: 'EC2024-012',
      date: new Date().toISOString().split('T')[0],
      morning: 'PRESENT',
      afternoon: 'ABSENT',
      evening: 'NOT_MARKED',
      remarks: 'Lab absent'
    }
  ];

  const initialGatePasses = [
    {
      id: 'gp-8921',
      passId: 'GP-2026-8921',
      studentRollNumber: 'CS2024-045',
      studentName: 'Rahul Varma',
      roomNumber: 'A-304',
      fromDateTime: '2026-08-03T10:00',
      toDateTime: '2026-08-03T18:00',
      reason: 'Doctor Appointment & Dental Checkup',
      destination: 'Apollo Hospital, Jubilee Hills',
      emergencyContact: '+91 9123456780',
      parentConsent: true,
      status: 'APPROVED',
      qrCodeData: 'HOSTELSYNC_GP_GP-2026-8921_CS2024-045',
      outTime: null,
      inTime: null,
      wardenRemarks: 'Approved by Warden. Parent consent verified.',
      createdAt: '2026-08-02T14:30:00.000Z'
    }
  ];

  const initialComplaints = [
    {
      id: 'cmp-101',
      complaintNumber: 'CMP-2026-001',
      studentRollNumber: 'CS2024-045',
      studentName: 'Rahul Varma',
      roomNumber: 'A-304',
      category: 'Electricity',
      title: 'Ceiling Fan Making Loud Noise & Overheating',
      description: 'The ceiling fan in Room A-304 produces severe humming noise and trips the switchboard.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedStaff: 'Electrician Ramesh Kumar',
      attachmentUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
      createdAt: '2026-08-01T09:15:00.000Z',
      timeline: [
        { status: 'OPEN', timestamp: '2026-08-01T09:15:00.000Z', note: 'Complaint submitted by student.' },
        { status: 'IN_PROGRESS', timestamp: '2026-08-01T11:00:00.000Z', note: 'Assigned to Electrician Ramesh.' }
      ]
    }
  ];

  const initialParcels = [
    {
      id: 'pcl-501',
      courierCompany: 'Amazon Logistics',
      trackingNumber: 'AMZ-9988223311',
      studentRollNumber: 'CS2024-045',
      studentName: 'Rahul Varma',
      roomNumber: 'A-304',
      parcelType: 'Electronics / Laptop Accessories',
      receivedDate: '2026-08-02T11:30:00.000Z',
      remarks: 'Fragile Box - Requires Signature',
      status: 'READY_FOR_PICKUP',
      collectedDate: null
    }
  ];

  const initialLaundry = [
    {
      id: 'lnd-301',
      studentRollNumber: 'CS2024-045',
      studentName: 'Rahul Varma',
      roomNumber: 'A-304',
      clothesCount: 8,
      category: 'Regular Wash',
      remarks: 'Separate white shirts',
      status: 'ACCEPTED',
      requestDate: '2026-08-02T08:00:00.000Z'
    }
  ];

  const initialVisitors = [
    {
      id: 'vst-1',
      visitorName: 'Suresh Varma',
      mobileNumber: '+91 9898989898',
      relationship: 'Father',
      studentRollNumber: 'CS2024-045',
      studentName: 'Rahul Varma',
      purpose: 'Monthly Warden Meeting & Snack Delivery',
      checkInTime: '2026-08-02T15:00:00.000Z',
      checkOutTime: '2026-08-02T16:30:00.000Z',
      idProofNumber: 'Aadhar 9876-5432-1098',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const initialAnnouncements = [
    {
      id: 'anc-1',
      title: 'Water Supply Maintenance Shutdown Notice',
      description: 'Overhead water tank cleaning scheduled for Block A tomorrow from 06:00 AM to 09:00 AM. Please store necessary water.',
      priority: 'IMPORTANT',
      target: 'All Students',
      author: 'Chief Warden',
      date: '2026-08-02T10:00:00.000Z'
    },
    {
      id: 'anc-2',
      title: 'Hostel Cultural Fest & Talent Evening',
      description: 'Registration opens for the annual hostel fest. Submit participation forms at the warden office by Friday.',
      priority: 'NORMAL',
      target: 'All Users',
      author: 'Super Admin',
      date: '2026-08-01T14:00:00.000Z'
    }
  ];

  const initialAuditLogs = [
    {
      id: 'log-1',
      action: 'SYSTEM_BOOT',
      user: 'SYSTEM',
      role: 'ADMIN',
      ip: '127.0.0.1',
      details: 'HostelSync ERP core services initialized successfully.',
      timestamp: '2026-08-02T08:00:00.000Z'
    }
  ];

  const initialNotifications = [
    {
      id: 'ntf-1',
      recipientRole: 'STUDENT',
      recipientIdentifier: 'CS2024-045',
      title: '📦 Courier Parcel Arrived',
      message: 'Amazon package AMZ-9988223311 is ready for pickup at Warden Office.',
      type: 'PARCEL',
      read: false,
      timestamp: new Date().toISOString()
    },
    {
      id: 'ntf-2',
      recipientRole: 'PARENT',
      recipientIdentifier: 'parent.rahul@gmail.com',
      title: '📦 Courier Parcel Arrived for Rahul Varma',
      message: 'Amazon package has arrived at the hostel security office.',
      type: 'PARCEL',
      read: false,
      timestamp: new Date().toISOString()
    }
  ];

  // State Management
  const [users, setUsers] = useState(() => getInitial('users', initialUsers));
  const [students, setStudents] = useState(() => getInitial('students', initialStudents));
  const [parents, setParents] = useState(() => getInitial('parents', initialParents));
  const [hostels, setHostels] = useState(() => getInitial('hostels', initialHostels));
  const [attendances, setAttendances] = useState(() => getInitial('attendances', initialAttendances));
  const [gatePasses, setGatePasses] = useState(() => getInitial('gatePasses', initialGatePasses));
  const [complaints, setComplaints] = useState(() => getInitial('complaints', initialComplaints));
  const [parcels, setParcels] = useState(() => getInitial('parcels', initialParcels));
  const [laundry, setLaundry] = useState(() => getInitial('laundry', initialLaundry));
  const [visitors, setVisitors] = useState(() => getInitial('visitors', initialVisitors));
  const [announcements, setAnnouncements] = useState(() => getInitial('announcements', initialAnnouncements));
  const [auditLogs, setAuditLogs] = useState(() => getInitial('auditLogs', initialAuditLogs));
  const [notifications, setNotifications] = useState(() => getInitial('notifications', initialNotifications));

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('hostelsync_users', JSON.stringify(users));
    localStorage.setItem('hostelsync_students', JSON.stringify(students));
    localStorage.setItem('hostelsync_parents', JSON.stringify(parents));
    localStorage.setItem('hostelsync_hostels', JSON.stringify(hostels));
    localStorage.setItem('hostelsync_attendances', JSON.stringify(attendances));
    localStorage.setItem('hostelsync_gatePasses', JSON.stringify(gatePasses));
    localStorage.setItem('hostelsync_complaints', JSON.stringify(complaints));
    localStorage.setItem('hostelsync_parcels', JSON.stringify(parcels));
    localStorage.setItem('hostelsync_laundry', JSON.stringify(laundry));
    localStorage.setItem('hostelsync_visitors', JSON.stringify(visitors));
    localStorage.setItem('hostelsync_announcements', JSON.stringify(announcements));
    localStorage.setItem('hostelsync_auditLogs', JSON.stringify(auditLogs));
    localStorage.setItem('hostelsync_notifications', JSON.stringify(notifications));
  }, [users, students, parents, hostels, attendances, gatePasses, complaints, parcels, laundry, visitors, announcements, auditLogs, notifications]);

  // Helper log audit
  const logAudit = (action, user, role, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      user: user || 'Anonymous',
      role: role || 'SYSTEM',
      ip: '192.168.1.100',
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper push notification
  const pushNotification = (recipientRole, recipientIdentifier, title, message, type) => {
    const newNtf = {
      id: `ntf-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      recipientRole,
      recipientIdentifier,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNtf, ...prev]);
  };

  // User Actions
  const registerUser = (userData) => {
    const { role, email, username, fullName, password, mobileNumber, gender, rollNumber, department, year, course, parentEmail, parentMobile, emergencyContact, address, childRollNumber, occupation, relationship } = userData;

    // Validation
    if (users.some(u => u.email === email)) throw new Error('Email already registered!');
    if (users.some(u => u.username === username)) throw new Error('Username already exists!');

    if (role === 'PARENT') {
      const childExists = students.some(s => s.rollNumber.toLowerCase() === childRollNumber.toLowerCase());
      if (!childExists) {
        throw new Error(`Student with Roll Number "${childRollNumber}" Not Found in system! Please verify with your ward.`);
      }
    }

    const userId = `usr-${Date.now()}`;
    const newUser = {
      id: userId,
      username,
      email,
      password,
      fullName,
      mobileNumber,
      gender,
      role,
      verified: true, // OTP verified
      approved: false, // Pending Admin approval
      pending: true,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);

    if (role === 'STUDENT') {
      const newStudent = {
        id: `std-${Date.now()}`,
        userId,
        fullName,
        email,
        rollNumber,
        department,
        year: parseInt(year),
        course,
        roomNumber: 'Unassigned',
        hostelName: gender === 'Female' ? 'Emerald Girls Block B' : 'Titanium Boys Block A',
        gender,
        dateOfBirth: '2004-01-01',
        bloodGroup: 'B+',
        emergencyContact,
        parentEmail,
        parentMobile,
        address,
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        attendancePct: 100.0,
        disciplineScore: 'Good'
      };
      setStudents(prev => [...prev, newStudent]);
    } else if (role === 'PARENT') {
      const connectedStudent = students.find(s => s.rollNumber.toLowerCase() === childRollNumber.toLowerCase());
      const newParent = {
        id: `prn-${Date.now()}`,
        userId,
        fullName,
        email,
        mobileNumber,
        childRollNumber,
        occupation,
        relationship,
        address
      };
      setParents(prev => [...prev, newParent]);
    }

    logAudit('USER_REGISTER', username, role, `New ${role} registration pending admin approval.`);
    pushNotification('ADMIN', 'ALL', '🔔 New Registration Pending', `${fullName} (${role}) registered and awaits admin approval.`, 'APPROVAL');
    return newUser;
  };

  const approveUser = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, approved: true, pending: false } : u));
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      logAudit('USER_APPROVE', 'ADMIN', 'ADMIN', `Approved user ${targetUser.username} (${targetUser.email}).`);
      pushNotification(targetUser.role, targetUser.email, '🎉 Account Approved!', 'Your HostelSync account has been approved by the Admin. You can now login.', 'APPROVAL');
    }
  };

  const rejectUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
    if (targetUser) {
      logAudit('USER_REJECT', 'ADMIN', 'ADMIN', `Rejected registration for ${targetUser.username}.`);
    }
  };

  const createWarden = (wardenData) => {
    const userId = `usr-wrd-${Date.now()}`;
    const newUser = {
      id: userId,
      username: wardenData.username,
      email: wardenData.email,
      password: wardenData.password,
      fullName: wardenData.fullName,
      mobileNumber: wardenData.mobileNumber,
      gender: wardenData.gender,
      role: 'WARDEN',
      verified: true,
      approved: true,
      pending: false,
      hostelAssigned: wardenData.hostelAssigned,
      employeeId: wardenData.employeeId,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    logAudit('CREATE_WARDEN', 'ADMIN', 'ADMIN', `Created Warden account ${wardenData.fullName} assigned to ${wardenData.hostelAssigned}.`);
  };

  // Attendance Actions
  const markAttendance = (studentRollNumber, session, status, remarks = '') => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = attendances.findIndex(a => a.studentRollNumber === studentRollNumber && a.date === today);

    let updatedList = [...attendances];
    let record;

    if (existingIndex >= 0) {
      record = { ...updatedList[existingIndex], [session]: status, remarks };
      updatedList[existingIndex] = record;
    } else {
      record = {
        id: `att-${Date.now()}-${Math.floor(Math.random()*100)}`,
        studentRollNumber,
        date: today,
        morning: session === 'morning' ? status : 'NOT_MARKED',
        afternoon: session === 'afternoon' ? status : 'NOT_MARKED',
        evening: session === 'evening' ? status : 'NOT_MARKED',
        remarks
      };
      updatedList.push(record);
    }
    setAttendances(updatedList);

    // Auto Alert Engine on ABSENT
    if (status === 'ABSENT') {
      const student = students.find(s => s.rollNumber === studentRollNumber);
      if (student) {
        const sessionCapitalized = session.charAt(0).toUpperCase() + session.slice(1);
        const alertMsg = `Your ward ${student.fullName} (${student.rollNumber}) was marked ABSENT during ${sessionCapitalized} Attendance session on ${today}.`;
        
        // Notify Student
        pushNotification('STUDENT', student.rollNumber, '🚨 Attendance Alert: Marked ABSENT', `You were marked ABSENT during ${sessionCapitalized} session today.`, 'ATTENDANCE');
        
        // Notify Parent
        pushNotification('PARENT', student.parentEmail, `⚠️ Absence Alert for ${student.fullName}`, alertMsg, 'ATTENDANCE');
        
        logAudit('ATTENDANCE_ABSENT_ALERT', 'WARDEN', 'WARDEN', `Triggered automated absence alerts for ${student.rollNumber} (${sessionCapitalized}).`);
      }
    }
  };

  // Gate Pass Actions
  const applyGatePass = (data) => {
    const passId = `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const student = students.find(s => s.rollNumber === data.studentRollNumber);
    const newPass = {
      id: `gp-${Date.now()}`,
      passId,
      studentRollNumber: data.studentRollNumber,
      studentName: student ? student.fullName : 'Student',
      roomNumber: student ? student.roomNumber : 'A-101',
      fromDateTime: data.fromDateTime,
      toDateTime: data.toDateTime,
      reason: data.reason,
      destination: data.destination,
      emergencyContact: data.emergencyContact,
      parentConsent: data.parentConsent,
      status: 'PENDING',
      qrCodeData: `HOSTELSYNC_GP_${passId}_${data.studentRollNumber}`,
      outTime: null,
      inTime: null,
      wardenRemarks: '',
      createdAt: new Date().toISOString()
    };
    setGatePasses(prev => [newPass, ...prev]);

    logAudit('GATE_PASS_APPLY', data.studentRollNumber, 'STUDENT', `Applied for Gate Pass ${passId} (${data.reason}).`);
    pushNotification('WARDEN', 'ALL', '🎫 New Gate Pass Request', `${student?.fullName} applied for gate pass (${data.reason}).`, 'GATE_PASS');
  };

  const updateGatePassStatus = (passId, status, remarks = '') => {
    setGatePasses(prev => prev.map(gp => gp.passId === passId ? { ...gp, status, wardenRemarks: remarks } : gp));
    const pass = gatePasses.find(gp => gp.passId === passId);
    if (pass) {
      const student = students.find(s => s.rollNumber === pass.studentRollNumber);
      const title = status === 'APPROVED' ? '✅ Gate Pass Approved!' : '❌ Gate Pass Rejected';
      const msg = `Your Gate Pass ${passId} has been ${status.toLowerCase()} by Warden.`;

      pushNotification('STUDENT', pass.studentRollNumber, title, msg, 'GATE_PASS');
      if (student?.parentEmail) {
        pushNotification('PARENT', student.parentEmail, `Gate Pass Update for ${student.fullName}`, `Gate pass request (${pass.reason}) has been ${status}.`, 'GATE_PASS');
      }
      logAudit('GATE_PASS_DECISION', 'WARDEN', 'WARDEN', `${status} Gate Pass ${passId} for student ${pass.studentRollNumber}.`);
    }
  };

  const scanGatePassQr = (qrString) => {
    const match = gatePasses.find(gp => gp.qrCodeData === qrString || gp.passId === qrString);
    if (!match) throw new Error('Invalid or Unrecognized Gate Pass QR Code!');
    if (match.status !== 'APPROVED' && match.status !== 'OUT') {
      throw new Error(`Gate Pass status is ${match.status}. Only APPROVED passes can scan OUT.`);
    }

    const now = new Date().toISOString();
    let nextStatus = 'OUT';
    let updateFields = { outTime: now };

    if (match.status === 'OUT') {
      nextStatus = 'RETURNED';
      updateFields = { inTime: now };
    }

    setGatePasses(prev => prev.map(gp => gp.id === match.id ? { ...gp, status: nextStatus, ...updateFields } : gp));
    logAudit('GATE_PASS_SCAN', 'SECURITY_GUARD', 'WARDEN', `Scanned QR for ${match.passId}: Marked ${nextStatus} at ${now}.`);
    return { pass: match, action: nextStatus };
  };

  // Complaint Actions
  const createComplaint = (data) => {
    const cmpNo = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const student = students.find(s => s.rollNumber === data.studentRollNumber);
    const newCmp = {
      id: `cmp-${Date.now()}`,
      complaintNumber: cmpNo,
      studentRollNumber: data.studentRollNumber,
      studentName: student ? student.fullName : 'Student',
      roomNumber: student ? student.roomNumber : 'Unassigned',
      category: data.category,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'OPEN',
      assignedStaff: 'Unassigned',
      attachmentUrl: data.attachmentUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      timeline: [
        { status: 'OPEN', timestamp: new Date().toISOString(), note: 'Complaint created by student.' }
      ]
    };
    setComplaints(prev => [newCmp, ...prev]);

    logAudit('COMPLAINT_CREATE', data.studentRollNumber, 'STUDENT', `Created complaint ${cmpNo} (${data.category}).`);
    pushNotification('WARDEN', 'ALL', '🛠️ New Complaint Registered', `${cmpNo}: ${data.title} (${data.priority} Priority).`, 'COMPLAINT');
  };

  const resolveComplaint = (cmpNo, status, staff, notes) => {
    setComplaints(prev => prev.map(c => {
      if (c.complaintNumber === cmpNo) {
        const updatedTimeline = [...(c.timeline || []), { status, timestamp: new Date().toISOString(), note: notes }];
        return { ...c, status, assignedStaff: staff || c.assignedStaff, resolutionNotes: notes, timeline: updatedTimeline };
      }
      return c;
    }));

    const cmp = complaints.find(c => c.complaintNumber === cmpNo);
    if (cmp) {
      pushNotification('STUDENT', cmp.studentRollNumber, `🔧 Complaint Updated (${status})`, `Complaint ${cmpNo} status updated to ${status}.`, 'COMPLAINT');
      logAudit('COMPLAINT_RESOLVE', 'WARDEN', 'WARDEN', `Updated complaint ${cmpNo} status to ${status}.`);
    }
  };

  // Parcel Actions
  const createParcel = (parcelData) => {
    const student = students.find(s => s.rollNumber === parcelData.studentRollNumber);
    if (!student) throw new Error(`Student with Roll Number ${parcelData.studentRollNumber} not found!`);

    const newParcel = {
      id: `pcl-${Date.now()}`,
      courierCompany: parcelData.courierCompany,
      trackingNumber: parcelData.trackingNumber,
      studentRollNumber: parcelData.studentRollNumber,
      studentName: student.fullName,
      roomNumber: student.roomNumber,
      parcelType: parcelData.parcelType,
      receivedDate: new Date().toISOString(),
      remarks: parcelData.remarks,
      status: 'READY_FOR_PICKUP',
      collectedDate: null
    };
    setParcels(prev => [newParcel, ...prev]);

    // Instant Notifications
    pushNotification('STUDENT', student.rollNumber, '📦 Courier Parcel Arrived', `Package ${parcelData.trackingNumber} from ${parcelData.courierCompany} is ready for pickup.`, 'PARCEL');
    if (student.parentEmail) {
      pushNotification('PARENT', student.parentEmail, `📦 Parcel Alert for ${student.fullName}`, `A courier parcel from ${parcelData.courierCompany} has arrived for your ward.`, 'PARCEL');
    }
    logAudit('PARCEL_CREATE', 'WARDEN', 'WARDEN', `Registered incoming parcel ${parcelData.trackingNumber} for ${student.rollNumber}.`);
  };

  const markParcelCollected = (parcelId) => {
    setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, status: 'COLLECTED', collectedDate: new Date().toISOString() } : p));
    const pcl = parcels.find(p => p.id === parcelId);
    if (pcl) {
      pushNotification('STUDENT', pcl.studentRollNumber, '✅ Parcel Collected', `Parcel ${pcl.trackingNumber} collected successfully.`, 'PARCEL');
      logAudit('PARCEL_COLLECT', 'WARDEN', 'WARDEN', `Marked parcel ${pcl.trackingNumber} as collected.`);
    }
  };

  // Room Allocation
  const allocateRoom = (studentRollNumber, hostelName, roomNumber) => {
    setStudents(prev => prev.map(s => s.rollNumber === studentRollNumber ? { ...s, hostelName, roomNumber } : s));
    pushNotification('STUDENT', studentRollNumber, '🏠 Room Allocation Updated', `You have been allocated Room ${roomNumber} in ${hostelName}.`, 'SYSTEM');
    logAudit('ROOM_ALLOCATE', 'ADMIN', 'ADMIN', `Allocated Room ${roomNumber} in ${hostelName} to student ${studentRollNumber}.`);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <HostelDataContext.Provider value={{
      users,
      students,
      parents,
      hostels,
      attendances,
      gatePasses,
      complaints,
      parcels,
      laundry,
      visitors,
      announcements,
      auditLogs,
      notifications,
      registerUser,
      approveUser,
      rejectUser,
      createWarden,
      markAttendance,
      applyGatePass,
      updateGatePassStatus,
      scanGatePassQr,
      createComplaint,
      resolveComplaint,
      createParcel,
      markParcelCollected,
      allocateRoom,
      markNotificationRead,
      logAudit
    }}>
      {children}
    </HostelDataContext.Provider>
  );
};

export const useHostelData = () => useContext(HostelDataContext);
