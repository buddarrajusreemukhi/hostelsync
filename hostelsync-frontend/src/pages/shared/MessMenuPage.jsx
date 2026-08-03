import React, { useEffect, useState } from 'react';
import { Utensils, Calendar } from 'lucide-react';
import api from '../../services/api';

export const MessMenuPage = () => {
  const [menu, setMenu] = useState([
    { dayOfWeek: 'Monday', breakfast: 'Idli, Sambar, Tea', lunch: 'Rice, Dal Tadka, Paneer Butter Masala', snacks: 'Samosa, Tea', dinner: 'Veg Biryani, Raita' },
    { dayOfWeek: 'Tuesday', breakfast: 'Puri Bhaji, Tea', lunch: 'Rice, Rajma Masala, Aloo Gobi', snacks: 'Biscuits, Tea', dinner: 'Chapati, Mix Veg Curry' },
    { dayOfWeek: 'Wednesday', breakfast: 'Dosa, Chana Masala', lunch: 'Veg Pulao, Dal Fry, Bhindi Fry', snacks: 'Veg Cutlet, Coffee', dinner: 'Roti, Kadhai Paneer' },
    { dayOfWeek: 'Thursday', breakfast: 'Poha, Upma, Tea', lunch: 'Rice, Chole Masala, Jeera Aloo', snacks: 'Pakora, Tea', dinner: 'Roti, Veg Kolhapuri' },
    { dayOfWeek: 'Friday', breakfast: 'Paratha, Curd, Tea', lunch: 'Rice, Dal Makhani, Mix Veg', snacks: 'Bun Maska, Tea', dinner: 'Fried Rice, Manchurian' },
    { dayOfWeek: 'Saturday', breakfast: 'Uttapam, Sambhar', lunch: 'Rice, Kadi Pakoda, Aloo Jeera', snacks: 'French Fries, Coffee', dinner: 'Roti, Malai Kofta' },
    { dayOfWeek: 'Sunday', breakfast: 'Bread Butter Jam', lunch: 'Special Veg Thali / Chicken Curry', snacks: 'Tea, Cookies', dinner: 'Pulao, Dal Fry, Ice Cream' }
  ]);

  useEffect(() => {
    api.get('/shared/mess-menu')
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setMenu(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3">
          <Utensils className="text-indigo-400" /> Weekly Hostel Mess Menu
        </h1>
        <p className="text-slate-400 text-sm mt-1">Official Nutrition Schedule & Meal Timings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((m) => (
          <div key={m.dayOfWeek} className="glass-card p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-extrabold text-lg text-indigo-400">{m.dayOfWeek}</h3>
              <Calendar size={18} className="text-slate-500" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-300 block uppercase tracking-wider">Breakfast (07:30 - 09:00 AM)</span>
                <span className="text-slate-400 mt-0.5 block">{m.breakfast}</span>
              </div>
              <div>
                <span className="font-bold text-slate-300 block uppercase tracking-wider">Lunch (12:30 - 02:00 PM)</span>
                <span className="text-slate-400 mt-0.5 block">{m.lunch}</span>
              </div>
              <div>
                <span className="font-bold text-slate-300 block uppercase tracking-wider">Snacks (05:00 - 06:00 PM)</span>
                <span className="text-slate-400 mt-0.5 block">{m.snacks}</span>
              </div>
              <div>
                <span className="font-bold text-slate-300 block uppercase tracking-wider">Dinner (08:00 - 09:30 PM)</span>
                <span className="text-slate-400 mt-0.5 block">{m.dinner}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
