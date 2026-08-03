import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHostelData } from '../../contexts/HostelDataContext';
import { Bot, Send, X, Sparkles, User, ShieldCheck, RefreshCw } from 'lucide-react';

export const AiHostelAssistantModal = ({ isOpen, onClose }) => {
  const { currentUser, getLinkedStudent } = useAuth();
  const { attendances, complaints, gatePasses, parcels, hostels, users } = useHostelData();

  const linkedStudent = getLinkedStudent();
  const role = currentUser?.role;

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: `Hello ${currentUser?.fullName || 'User'}! I am your AI Hostel Assistant. How can I help you today regarding hostel attendance, gate passes, complaints, or room details?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite understand that. You can ask me about attendance percentage, gate pass status, pending complaints, parcel pickups, or hostel occupancy.";

      if (role === 'STUDENT' || role === 'PARENT') {
        const studentRoll = linkedStudent?.rollNumber;

        if (query.includes('attendance') || query.includes('present') || query.includes('absent')) {
          const studentAtts = attendances.filter(a => a.studentRollNumber === studentRoll);
          botResponse = `Student ${linkedStudent?.fullName} (${studentRoll}) has an overall attendance of ${linkedStudent?.attendancePct || 92}%. Today's status: Morning: PRESENT, Afternoon: PRESENT, Evening: Pending.`;
        } else if (query.includes('gate pass') || query.includes('pass')) {
          const studentPasses = gatePasses.filter(g => g.studentRollNumber === studentRoll);
          if (studentPasses.length > 0) {
            const latest = studentPasses[0];
            botResponse = `Latest Gate Pass (${latest.passId}): Reason "${latest.reason}" is currently ${latest.status}. Approved passes display a QR code for security scan.`;
          } else {
            botResponse = "No active gate passes found for this account.";
          }
        } else if (query.includes('complaint') || query.includes('issue')) {
          const studentCmps = complaints.filter(c => c.studentRollNumber === studentRoll);
          botResponse = `You have ${studentCmps.length} registered complaints. Latest status: ${studentCmps[0]?.title || 'None'} - ${studentCmps[0]?.status || 'Resolved'}.`;
        } else if (query.includes('parcel') || query.includes('courier')) {
          const studentParcels = parcels.filter(p => p.studentRollNumber === studentRoll);
          botResponse = `You have ${studentParcels.filter(p => p.status === 'READY_FOR_PICKUP').length} parcel(s) ready for pickup at the Warden office.`;
        } else if (query.includes('room') || query.includes('hostel')) {
          botResponse = `Allocated Room: ${linkedStudent?.roomNumber || 'A-304'}, Hostel: ${linkedStudent?.hostelName || 'Titanium Boys Block A'}. Mess timings: Breakfast 07:30 AM, Lunch 12:30 PM, Dinner 08:00 PM.`;
        }
      } else if (role === 'WARDEN' || role === 'ADMIN') {
        if (query.includes('attendance') || query.includes('absent')) {
          botResponse = `Today's Hostel Attendance Summary: Total Students: 198, Morning Present: 185, Afternoon Present: 180, Total Absentees Today: 18. Automated parent alerts sent.`;
        } else if (query.includes('occupancy') || query.includes('room')) {
          botResponse = `Hostel Occupancy Report: Block A (Boys): 81.6% Occupied (98/120 beds). Block B (Girls): 75% Occupied (75/100 beds). Total available beds: 47.`;
        } else if (query.includes('pending') || query.includes('approval')) {
          const pendingUsers = users.filter(u => u.pending);
          botResponse = `Pending Admin Approvals: ${pendingUsers.length} user(s) waiting in approval queue. ${gatePasses.filter(g => g.status === 'PENDING').length} pending gate passes.`;
        }
      }

      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col h-[580px] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                AI Hostel Assistant <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-indigo-300">Contextual ERP Query Engine ({role})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/20' 
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
              }`}>
                <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/10 pb-1 text-[10px] opacity-80">
                  <span className="font-bold">{msg.sender === 'user' ? 'You' : 'HostelSync AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 text-slate-400 rounded-2xl p-3 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> AI is querying ERP context...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] text-indigo-300">
          <span className="font-bold text-slate-500 whitespace-nowrap">Suggested:</span>
          <button onClick={() => setInputText("What is my attendance percentage?")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg whitespace-nowrap cursor-pointer">Attendance %</button>
          <button onClick={() => setInputText("Show my gate pass status")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg whitespace-nowrap cursor-pointer">Gate Pass</button>
          <button onClick={() => setInputText("Are there any arrived parcels?")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg whitespace-nowrap cursor-pointer">Parcel Hub</button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI anything about your hostel..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
