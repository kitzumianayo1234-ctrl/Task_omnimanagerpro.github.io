import React from 'react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { History, CalendarDays, Rocket } from 'lucide-react';

interface HistoryBoardProps {
  tasks: Task[];
}

const TaskListItem: React.FC<{ task: Task }> = ({ task }) => (
  <div className="flex items-center p-3 bg-white border border-slate-100 rounded-lg hover:shadow-sm transition-all mb-2">
    <div className={`w-2 h-2 rounded-full mr-3 ${
      task.status === TaskStatus.DONE ? 'bg-green-500' :
      task.status === TaskStatus.ON_GOING ? 'bg-blue-500' :
      task.status === TaskStatus.CANCELED ? 'bg-red-500' : 'bg-yellow-500'
    }`} />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <h4 className={`font-medium text-sm truncate pr-2 ${task.status === TaskStatus.DONE || task.status === TaskStatus.CANCELED ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
          {task.title}
        </h4>
        <span className="text-[10px] text-slate-400 whitespace-nowrap">{task.date}</span>
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className={`text-[9px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[task.status]}`}>
          {task.status}
        </span>
      </div>
      {task.remarks && (
        <div className="mt-1 text-[10px] text-indigo-500 truncate">
          Note: {task.remarks}
        </div>
      )}
    </div>
  </div>
);

export const HistoryBoard: React.FC<HistoryBoardProps> = ({ tasks }) => {
  const today = new Date().toISOString().split('T')[0];

  const oldTasks = tasks.filter(t => t.date < today).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const presentTasks = tasks.filter(t => t.date === today);
  const futureTasks = tasks.filter(t => t.date > today).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      {/* Old / Past */}
      <div className="flex flex-col h-full bg-slate-100/50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-300">
          <History className="text-slate-500" size={20} />
          <h2 className="font-bold text-slate-600">Old / Past</h2>
          <span className="ml-auto bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {oldTasks.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {oldTasks.length > 0 ? (
            oldTasks.map(task => <TaskListItem key={task.id} task={task} />)
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">No past tasks.</div>
          )}
        </div>
      </div>

      {/* Present / Today */}
      <div className="flex flex-col h-full bg-blue-50/50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-300">
          <CalendarDays className="text-blue-600" size={20} />
          <h2 className="font-bold text-blue-800">Present / Today</h2>
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {presentTasks.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {presentTasks.length > 0 ? (
            presentTasks.map(task => <TaskListItem key={task.id} task={task} />)
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">No tasks for today.</div>
          )}
        </div>
      </div>

      {/* Future */}
      <div className="flex flex-col h-full bg-purple-50/50 rounded-xl p-4 border border-purple-100">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-purple-300">
          <Rocket className="text-purple-600" size={20} />
          <h2 className="font-bold text-purple-800">Future</h2>
          <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {futureTasks.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {futureTasks.length > 0 ? (
            futureTasks.map(task => <TaskListItem key={task.id} task={task} />)
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">No upcoming tasks.</div>
          )}
        </div>
      </div>
    </div>
  );
};