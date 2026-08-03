import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import api from '../../services/api';

export const AiAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am HostelSync AI Assistant. How can I help you with your room details, gate pass, laundry, or hostel rules today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', { prompt: input });
      if (res.data.success) {
        setMessages((prev) => [...prev, { sender: 'ai', text: res.data.data.answer }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'I am experiencing connectivity issues. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
          <Sparkles className="text-indigo-400" /> AI Hostel Virtual Assistant
        </h1>
        <p className="text-slate-400 text-sm mt-1">Instant 24/7 AI guidance for hostel rules, status tracking, and emergency info</p>
      </div>

      <div className="glass-card flex-1 rounded-3xl border border-slate-800 p-6 flex flex-col overflow-hidden">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-lg'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Bot size={18} />
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-slate-400 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" /> AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about gate pass, laundry status, hostel rules..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
