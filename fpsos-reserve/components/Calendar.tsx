
import React, { useState } from 'react';
import { Icons } from '../constants';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysCount = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 w-full"></div>);
    }

    for (let d = 1; d <= daysCount; d++) {
      const date = new Date(year, month, d);
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();
      const isPast = date < new Date(new Date().setHours(0,0,0,0));

      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => onDateSelect(date)}
          className={`h-12 w-full flex items-center justify-center rounded-xl text-sm transition-all apple-button relative
            ${isSelected ? 'bg-white text-black font-bold' : 'hover:bg-zinc-800'}
            ${isPast ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-200'}
            ${isToday && !isSelected ? 'border border-cyan-500/50 text-cyan-400' : ''}
          `}
        >
          {isSelected && <div className="absolute -inset-1 bg-white/10 blur-lg rounded-xl z-[-1]"></div>}
          {d}
        </button>
      );
    }

    return days;
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold tracking-tight text-white">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><Icons.ChevronLeft /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"><Icons.ChevronRight /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;
