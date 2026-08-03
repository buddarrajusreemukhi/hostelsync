import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { AlertCircle, Plus, Clock, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const ComplaintsStudentPage = () => {
  const { getLinkedStudent } = useAuth();
  const { complaints, createComplaint } = useHostelData();

  const student = getLinkedStudent();
  const myComplaints = complaints.filter(c => c.studentRollNumber === student?.rollNumber);

  const [category, setCategory] = useState('Electricity');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [attachmentUrl, setAttachmentUrl] = useState('');

  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      createComplaint({
        studentRollNumber: student?.rollNumber,
        category,
        title,
        description,
        priority,
        attachmentUrl
      });
      setMsg('✅ Maintenance complaint registered successfully!');
      setTitle('');
      setDescription('');
    } catch (err) {
      setMsg(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" /> Maintenance & Issue Complaints
        </h1>
        <p className="text-xs text-slate-400">Report room issues (electricity, water, wifi, cleaning) to Warden office.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-indigo-400" /> Raise New Complaint
          </h3>

          {msg && <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs text-slate-200">{msg}</div>}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value="Electricity">Electricity & Wiring</option>
                <option value="Water">Water & Plumbing</option>
                <option value="Cleaning">Housekeeping & Cleaning</option>
                <option value="Internet">Wi-Fi & Internet</option>
                <option value="Room">Room & Door Lock</option>
                <option value="Furniture">Desk & Bed Furniture</option>
                <option value="Mess">Mess Food Quality</option>
                <option value="Security">Security & Noise</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Complaint Title</label>
              <input
                type="text"
                required
                placeholder="Brief summary of issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe exact details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH (Urgent Repair)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Photo Attachment URL (Optional)</label>
              <input
                type="text"
                placeholder="https://..."
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md transition-all cursor-pointer"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Complaints Timeline & History */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between border-b border-slate-800 pb-3">
            <span>My Registered Complaints & Timeline</span>
            <span className="text-xs text-indigo-400">{myComplaints.length} Filed</span>
          </h3>

          <div className="space-y-4">
            {myComplaints.map(cmp => (
              <div key={cmp.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-sm text-slate-100">{cmp.complaintNumber}</span>
                    <span className="text-xs text-indigo-400 font-semibold ml-2">[{cmp.category}]</span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cmp.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {cmp.status}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-200">{cmp.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{cmp.description}</p>

                {cmp.assignedStaff && cmp.assignedStaff !== 'Unassigned' && (
                  <p className="text-[11px] text-indigo-300 font-medium">Assigned Staff: {cmp.assignedStaff}</p>
                )}

                {/* Timeline Progress */}
                <div className="pt-2 border-t border-slate-800/60 space-y-1 text-[10px] text-slate-400">
                  <span className="font-bold uppercase text-slate-500">Lifecycle Timeline:</span>
                  {cmp.timeline?.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <strong className="text-slate-200">{t.status}</strong> - {t.note} ({new Date(t.timestamp).toLocaleString()})
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
