import React from 'react';
import { Clock, AlertCircle, Flame, CheckCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TimelineViewProps {
  onOpenCardModal: (cardId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onOpenCardModal }) => {
  const { cards, boards, activeBoardId, labels } = useApp();

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const boardCards = cards.filter((c) => c.boardId === activeBoardId);

  // Timeline days range (July 15 to August 5)
  const timelineDays = Array.from({ length: 22 }, (_, i) => {
    const d = new Date(2026, 6, 15 + i);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 space-y-4 overflow-y-auto text-slate-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <Clock className="w-6 h-6 text-purple-400" />
          <div>
            <h2 className="text-lg font-bold text-white">Gantt Timeline & Critical Path</h2>
            <p className="text-xs text-slate-400">
              Interactive task duration planning and dependency visualizer for {activeBoard?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Chart Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto shadow-xl space-y-4">
        {/* Timeline Header (Days) */}
        <div className="flex border-b border-slate-800 pb-2 min-w-[900px]">
          <div className="w-64 font-bold text-xs uppercase tracking-wider text-slate-400 flex-shrink-0 px-2">
            Task Specs
          </div>
          <div className="flex-1 grid grid-cols-22 gap-1 text-center text-[10px]">
            {timelineDays.map((td) => (
              <div
                key={td.dateStr}
                className={`py-1 rounded font-mono ${
                  td.isWeekend ? 'bg-slate-950 text-slate-600' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold">{td.dayNum}</div>
                <div className="text-[9px] text-slate-500">{td.dayName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        <div className="space-y-3 min-w-[900px]">
          {boardCards.map((card) => {
            const cardLabels = labels.filter((l) => card.labelIds.includes(l.id));

            // Estimate bar position (mock offsets based on start/due dates)
            const startDayIndex = card.startDate
              ? Math.max(0, parseInt(card.startDate.split('-')[2]) - 15)
              : 2;
            const dueDayIndex = card.dueDate
              ? Math.min(21, parseInt(card.dueDate.split('-')[2]) - 15)
              : startDayIndex + 5;
            const spanDays = Math.max(2, dueDayIndex - startDayIndex + 1);

            return (
              <div
                key={card.id}
                onClick={() => onOpenCardModal(card.id)}
                className="flex items-center group hover:bg-slate-800/40 p-2 rounded-xl transition-colors cursor-pointer"
              >
                {/* Task Title & Details */}
                <div className="w-64 flex-shrink-0 pr-4 space-y-0.5">
                  <span className="font-semibold text-xs text-white group-hover:text-purple-300 truncate block">
                    {card.title}
                  </span>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span className="capitalize text-indigo-400 font-bold">{card.priority}</span>
                    <span>•</span>
                    <span>{card.timeEstimateHours}h est</span>
                  </div>
                </div>

                {/* Timeline Bar Span Grid */}
                <div className="flex-1 grid grid-cols-22 gap-1 relative items-center h-8">
                  <div
                    className="absolute h-6 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border border-indigo-400/40 shadow-md flex items-center px-2 text-[10px] font-bold text-white truncate transition-all group-hover:scale-[1.01]"
                    style={{
                      gridColumnStart: startDayIndex + 1,
                      gridColumnEnd: `span ${spanDays}`,
                    }}
                  >
                    <span className="truncate">{card.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
