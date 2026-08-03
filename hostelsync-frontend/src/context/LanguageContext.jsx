import React, { createContext, useContext, useState } from 'react';

const translations = {
  EN: {
    dashboard: 'Dashboard',
    attendance: 'Attendance',
    gatePass: 'Gate Pass',
    laundry: 'Laundry',
    parcels: 'Parcels',
    complaints: 'Complaints',
    visitors: 'Visitors',
    roomDetails: 'Room Details',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    welcomeBack: 'Welcome Back',
    roleAdmin: 'Administrator',
    roleWarden: 'Chief Warden',
    roleStudent: 'Student',
    roleParent: 'Parent'
  },
  TE: {
    dashboard: 'డాష్‌బోర్డ్',
    attendance: 'హాజరు',
    gatePass: 'గేట్ పాస్',
    laundry: 'లాండ్రీ',
    parcels: 'పార్శిల్స్',
    complaints: 'ఫిర్యాదులు',
    visitors: 'సందర్శకులు',
    roomDetails: 'గది వివరాలు',
    profile: 'ప్రొఫైల్',
    settings: 'సెట్టింగ్‌లు',
    logout: 'లాగౌట్',
    welcomeBack: 'స్వాగతం',
    roleAdmin: 'అడ్మినిస్ట్రేటర్',
    roleWarden: 'వార్డెన్',
    roleStudent: 'విద్యార్థి',
    roleParent: 'తల్లిదండ్రులు'
  },
  HI: {
    dashboard: 'डैशबोर्ड',
    attendance: 'उपस्थिति',
    gatePass: 'गेट पास',
    laundry: 'लॉन्ड्री',
    parcels: 'पार्सल',
    complaints: 'शिकायतें',
    visitors: 'आगंतुक',
    roomDetails: 'कमरे का विवरण',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    welcomeBack: 'स्वागत है',
    roleAdmin: 'प्रशासक',
    roleWarden: 'वार्डन',
    roleStudent: 'छात्र',
    roleParent: 'अभिभावक'
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('hostelsync_lang') || 'EN');

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('hostelsync_lang', lang);
  };

  const t = (key) => translations[language]?.[key] || translations['EN'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
