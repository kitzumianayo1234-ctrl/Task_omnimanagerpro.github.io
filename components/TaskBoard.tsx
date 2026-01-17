import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Filter, ChevronDown, Calendar, Bell } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  
  // Empty task template
  const initialTaskState: Task = {
    id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: TaskStatus.PENDING,
    remarks: '',
    reminder: false,
    createdAt: Date.now()
  };

  const [currentTask, setCurrentTask] = useState<Task>(initialTaskState);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setCurrentTask(task);
      setIsEditing(true);
    } else {
      setCurrentTask({ ...initialTaskState, id: crypto.randomUUID(), createdAt: Date.now() });
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setTasks(tasks.map(t => t.id === currentTask.id ? currentTask : t));
    } else {
      setTasks([...tasks, currentTask]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleDateChange = (taskId: string, newDate: string) => {
     setTasks(tasks.map(t => t.id === taskId ? { ...t, date: newDate } : t));
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Status</option>
            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            <Filter size={48} className="mb-4 opacity-20" />
            <p>No tasks found matching criteria.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col gap-3 group">
              <div className="flex justify-between items-start">
                {/* Status Button Dropdown */}
                <div className="relative group/status inline-block">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-md text-[11px] font-bold tracking-wider border transition-all outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 hover:shadow-sm ${STATUS_COLORS[task.status]}`}
                  >
                    {Object.values(TaskStatus).map(status => (
                      <option key={status} value={status} className="bg-white text-slate-700 font-medium text-sm py-1">
                        {status}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-current">
                     <ChevronDown size={12} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(task)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-800 text-lg leading-tight flex items-center gap-2">
                   {task.title}
                   {task.reminder && <Bell size={14} className="text-yellow-500 fill-yellow-500" />}
                </h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description || "No description provided."}</p>
              </div>

              {/* Editable Date and Remarks */}
              <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <input 
                      type="date"
                      value={task.date}
                      onChange={(e) => handleDateChange(task.id, e.target.value)}
                      className="text-xs font-medium text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                    />
                 </div>
                {task.remarks && (
                  <div className="text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded inline-block w-fit max-w-full truncate" title={task.remarks}>
                    Remarks: {task.remarks}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? 'Edit Task' : 'New Task'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  required
                  type="text"
                  value={currentTask.title}
                  onChange={e => setCurrentTask({...currentTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  placeholder="e.g., Submit Quarterly Report"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                  <input
                    required
                    type="date"
                    value={currentTask.date}
                    onChange={e => setCurrentTask({...currentTask, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={currentTask.status}
                    onChange={e => setCurrentTask({...currentTask, status: e.target.value as TaskStatus})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  value={currentTask.description}
                  onChange={e => setCurrentTask({...currentTask, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Add details about the task..."
                />
              </div>

              <div className="flex items-center gap-4">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
                   <input
                     type="text"
                     value={currentTask.remarks}
                     onChange={e => setCurrentTask({...currentTask, remarks: e.target.value})}
                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                     placeholder="Any additional info..."
                   />
                 </div>
                 <div className="flex items-center gap-2 pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={currentTask.reminder}
                        onChange={e => setCurrentTask({...currentTask, reminder: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">Set Reminder</span>
                    </label>
                 </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md shadow-blue-200 transition-colors flex items-center gap-2"
                >
                  <Check size={18} />
                  {isEditing ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};