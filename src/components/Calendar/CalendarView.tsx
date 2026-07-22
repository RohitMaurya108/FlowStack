import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CalendarViewProps {
  onOpenCardModal: (cardId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenCardModal }) => {
  const { cards, boards, activeBoardId } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // July 2026

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const boardCards = cards.filter((c) => c.boardId === activeBoardId && c.dueDate);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-4 overflow-y-auto text-slate-100">
      {/* Top Calendar Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-lg font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-xs text-slate-400">
              Interactive task deadline schedule for {activeBoard?.name || 'Active Board'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(2026, 6, 1))}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2 bg-slate-900/40 rounded-lg border border-slate-800/40">
            {day}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-2 flex-1 min-h-[500px]">
        {/* Empty cells before month start */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty_${i}`} className="bg-slate-950/20 border border-slate-900/40 rounded-xl p-2 opacity-30" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
          const dayStr = String(dayNum).padStart(2, '0');
          const dateISO = `${currentDate.getFullYear()}-${monthStr}-${dayStr}`;

          const dayCards = boardCards.filter((c) => c.dueDate === dateISO);
          const isToday = dayNum === 21 && currentDate.getMonth() === 6; // Mock July 21

          return (
            <div
              key={dateISO}
              className={`min-h-[100px] p-2 bg-slate-900/70 border rounded-xl flex flex-col justify-between transition-colors ${
                isToday
                  ? 'border-indigo-500/80 bg-indigo-950/20 ring-1 ring-indigo-500/40'
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isToday ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {dayNum}
                </span>
                {dayCards.length > 0 && (
                  <span className="text-[10px] font-semibold text-slate-500">{dayCards.length} tasks</span>
                )}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {dayCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => onOpenCardModal(card.id)}
                    className="w-full text-left p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-[11px] truncate block font-medium transition-colors"
                  >
                    <span className="text-indigo-300 font-semibold truncate block">{card.title}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
