import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHostelData } from './HostelDataContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { users, students, parents, logAudit } = useHostelData();

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hostelsync_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jwtToken, setJwtToken] = useState(() => {
    return localStorage.getItem('hostelsync_jwt_token') || null;
  });

  // Transient state during 2FA Login OTP
  const [pendingOtpUser, setPendingOtpUser] = useState(null);
  const [generatedOtp, setGeneratedOtp] = useState('');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hostelsync_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hostelsync_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (jwtToken) {
      localStorage.setItem('hostelsync_jwt_token', jwtToken);
    } else {
      localStorage.removeItem('hostelsync_jwt_token');
    }
  }, [jwtToken]);

  // Step 1: Validate credentials
  const loginStepOne = (identifier, password, expectedRole) => {
    const user = users.find(u =>
      (u.username.toLowerCase() === identifier.toLowerCase() || u.email.toLowerCase() === identifier.toLowerCase()) &&
      u.password === password
    );

    if (!user) {
      throw new Error('Invalid Username/Email or Password!');
    }

    if (user.role !== expectedRole) {
      throw new Error(`Access Denied! Your account has role "${user.role}". Please use the ${user.role} Login card.`);
    }

    if (!user.verified) {
      throw new Error('Your account email is not verified.');
    }

    if (!user.approved) {
      throw new Error('Account Pending Approval! The Admin must approve your account before you can log in.');
    }

    // Generate 6-digit OTP for 2-Step Verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOtpUser(user);
    setGeneratedOtp(otp);

    console.log(`[SECURE MAIL SERVICE] Login OTP for ${user.email}: ${otp}`);

    logAudit('LOGIN_OTP_SENT', user.username, user.role, `Step-1 authenticated. Sent 2FA Login OTP to ${user.email}.`);
    return { status: 'OTP_SENT', email: user.email, demoOtp: otp };
  };

  // Step 2: Verify Login OTP & Issue JWT
  const loginStepTwoVerifyOtp = (otpInput) => {
    if (!pendingOtpUser) throw new Error('No pending login session!');

    // For ease of testing, accept 123456 or generated OTP
    if (otpInput !== generatedOtp && otpInput !== '123456') {
      throw new Error('Invalid OTP Code! Please check your email or use demo OTP 123456.');
    }

    // Generate JWT Token Mock
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      id: pendingOtpUser.id,
      username: pendingOtpUser.username,
      role: pendingOtpUser.role,
      exp: Date.now() + 86400000
    }))}.hostelsync_signature`;

    setJwtToken(mockToken);
    setCurrentUser(pendingOtpUser);

    logAudit('LOGIN_SUCCESS', pendingOtpUser.username, pendingOtpUser.role, `2FA verified successfully. JWT Token issued.`);

    const loggedUser = pendingOtpUser;
    setPendingOtpUser(null);
    setGeneratedOtp('');

    return loggedUser;
  };

  const logout = () => {
    if (currentUser) {
      logAudit('LOGOUT', currentUser.username, currentUser.role, 'User logged out.');
    }
    setCurrentUser(null);
    setJwtToken(null);
    setPendingOtpUser(null);
  };

  // Find linked student if current user is student or parent
  const getLinkedStudent = () => {
    if (!currentUser) return null;
    if (currentUser.role === 'STUDENT') {
      return students.find(s => s.userId === currentUser.id || s.email === currentUser.email) || students[0];
    }
    if (currentUser.role === 'PARENT') {
      const parentRecord = parents.find(p => p.userId === currentUser.id || p.email === currentUser.email);
      if (parentRecord) {
        return students.find(s => s.rollNumber.toLowerCase() === parentRecord.childRollNumber.toLowerCase()) || null;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      jwtToken,
      pendingOtpUser,
      generatedOtp,
      loginStepOne,
      loginStepTwoVerifyOtp,
      logout,
      getLinkedStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
