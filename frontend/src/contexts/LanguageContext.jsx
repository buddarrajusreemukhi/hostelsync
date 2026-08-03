import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    welcome: 'Welcome to HostelSync',
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    gatePass: 'Gate Pass',
    complaints: 'Complaints',
    parcels: 'Parcels',
    laundry: 'Laundry',
    announcements: 'Announcements',
    hostelMap: 'Hostel Map',
    userApprovals: 'User Approvals',
    auditLogs: 'Audit Logs',
    aiAssistant: 'AI Assistant',
    logout: 'Sign Out',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected'
  },
  te: {
    welcome: 'హాస్టల్‌సింక్ కు స్వాగతం',
    dashboard: 'డాష్‌బోర్డ్',
    attendance: 'హాజరు',
    gatePass: 'గేట్ పాస్',
    complaints: 'ఫిర్యాదులు',
    parcels: 'పార్సెల్స్',
    laundry: 'లాండ్రీ',
    announcements: 'ప్రకటనలు',
    hostelMap: 'హాస్టల్ మ్యాప్',
    userApprovals: 'యూజర్ ఆమోదాలు',
    auditLogs: 'ఆడిట్ లాగ్స్',
    aiAssistant: 'AI అసిస్టెంట్',
    logout: 'లాగ్ అవుట్',
    present: 'హాజరు',
    absent: 'గైర్హాజరు',
    late: 'ఆలస్యం',
    pending: 'పెండింగ్',
    approved: 'ఆమోదించబడింది',
    rejected: 'తిరస్కరించబడింది'
  },
  hi: {
    welcome: 'हॉस्टलसिंक में आपका स्वागत है',
    dashboard: 'डैशबोर्ड',
    attendance: 'उपस्थिति',
    gatePass: 'गेट पास',
    complaints: 'शिकायतें',
    parcels: 'पार्सल',
    laundry: 'लॉन्ड्री',
    announcements: 'घोषणाएं',
    hostelMap: 'हॉस्टल मानचित्र',
    userApprovals: 'उपयोगकर्ता अनुमोदन',
    auditLogs: 'ऑडिट लॉग्स',
    aiAssistant: 'एआई सहायक',
    logout: 'साइन आउट',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    late: 'देर से',
    pending: 'लंबित',
    approved: 'स्वीकृत',
    rejected: 'अस्वीकृत'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('hostelsync_lang') || 'en');

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('hostelsync_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
