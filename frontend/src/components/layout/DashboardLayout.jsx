import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { AiHostelAssistantModal } from '../ai/AiHostelAssistantModal';

export const DashboardLayout = () => {
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onOpenAiBot={() => setShowAiModal(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-950/90">
          <Outlet />
        </main>
      </div>

      <AiHostelAssistantModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
      />
    </div>
  );
};
