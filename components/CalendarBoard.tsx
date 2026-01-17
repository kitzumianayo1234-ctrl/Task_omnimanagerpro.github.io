import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { Task, CalendarDateState } from '../types';
import { MONTH_NAMES, DAYS_OF_WEEK } from '../constants';

interface CalendarBoardProps {
  tasks: Task[];
}

export const CalendarBoard: React.FC<CalendarBoardProps> = ({ tasks }) => {
  const [calendarState, setCalendarState] = useState<CalendarDateState>({
    currentDate: new Date(),
    viewMode: 'month'
  });

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrev = () => {
    const newDate = new Date(calendarState.currentDate);
    if (calendarState.viewMode === 'day') newDate.setDate(newDate.getDate() - 1);
    if (calendarState.viewMode === 'month') newDate.setMonth(newDate.getMonth() - 1);
    if (calendarState.viewMode === 'year') newDate.setFullYear(newDate.getFullYear() - 1);
    setCalendarState({ ...calendarState, currentDate: newDate });
  };

  const handleNext = () => {
    const newDate = new Date(calendarState.currentDate);
    if (calendarState.viewMode === 'day') newDate.setDate(newDate.getDate() + 1);
    if (calendarState.viewMode === 'month') newDate.setMonth(newDate.getMonth() + 1);
    if (calendarState.viewMode === 'year') newDate.setFullYear(newDate.getFullYear() + 1);
    setCalendarState({ ...calendarState, currentDate: newDate });
  };

  const jumpToToday = () => {
    setCalendarState({ ...calendarState, currentDate: new Date() });
  };

  const renderMonthView = () => {
    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
            {day}
          </div>
        ))}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="bg-white min-h-[100px] p-2" />
        ))}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasks.filter(t => t.date === dateStr);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div 
              key={day} 
              className={`bg-white min-h-[100px] p-2 hover:bg-blue-50 transition-colors cursor-pointer group flex flex-col gap-1 ${isToday ? 'bg-blue-50/50' : ''}`}
              onClick={() => setCalendarState({ currentDate: new Date(year, month, day), viewMode: 'day' })}
            >
              <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}`}>
                {day}
              </span>
              <div className="flex flex-col gap-1 mt-1">
                {dayTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-xs truncate px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 border-l-2 border-indigo-500">
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <span className="text-xs text-slate-400 pl-1">+ {dayTasks.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
    const dateStr = calendarState.currentDate.toISOString().split('T')[0];
    const dayTasks = tasks.filter(t => t.date === dateStr);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          Tasks for {calendarState.currentDate.toLocaleDateString()}
          <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {dayTasks.length}
          </span>
        </h3>
        {dayTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No tasks scheduled for this day.</div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map(task => (
              <div key={task.id} className="p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-slate-900">{task.title}</h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold border ${
                     task.status === 'DONE' ? 'bg-green-100 text-green-700 border-green-200' :
                     task.status === 'ON-GOING' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                     task.status === 'CANCELED' ? 'bg-red-100 text-red-700 border-red-200' :
                     'bg-yellow-100 text-yellow-700 border-yellow-200'
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.description && <p className="text-sm text-slate-600 mt-1">{task.description}</p>}
                <div className="mt-2 text-xs text-slate-400">Due: {task.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderYearView = () => {
    const year = calendarState.currentDate.getFullYear();
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTH_NAMES.map((monthName, index) => {
          const count = tasks.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === year && d.getMonth() === index;
          }).length;
          
          return (
            <div 
              key={monthName} 
              onClick={() => setCalendarState({ currentDate: new Date(year, index, 1), viewMode: 'month' })}
              className="bg-white p-4 rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="font-bold text-slate-700 mb-2">{monthName}</div>
              <div className="text-3xl font-light text-blue-600">{count}</div>
              <div className="text-xs text-slate-400 mt-1">Tasks scheduled</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
          {['day', 'month', 'year'].map((mode) => (
            <button
              key={mode}
              onClick={() => setCalendarState({ ...calendarState, viewMode: mode as any })}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                calendarState.viewMode === mode 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
              } capitalize`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handlePrev} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <div className="text-lg font-bold text-slate-800 min-w-[150px] text-center">
            {calendarState.viewMode === 'day' && calendarState.currentDate.toLocaleDateString()}
            {calendarState.viewMode === 'month' && `${MONTH_NAMES[calendarState.currentDate.getMonth()]} ${calendarState.currentDate.getFullYear()}`}
            {calendarState.viewMode === 'year' && calendarState.currentDate.getFullYear()}
          </div>
          <button onClick={handleNext} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
            <ChevronRight size={20} />
          </button>
        </div>

        <button 
          onClick={jumpToToday}
          className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-colors"
        >
          Today
        </button>
      </div>

      {/* View Content */}
      <div className="animate-in fade-in duration-300">
        {calendarState.viewMode === 'month' && renderMonthView()}
        {calendarState.viewMode === 'day' && renderDayView()}
        {calendarState.viewMode === 'year' && renderYearView()}
      </div>
    </div>
  );
};