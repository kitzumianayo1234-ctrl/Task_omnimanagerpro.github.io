import React, { useState } from 'react';
import { LayoutDashboard, Calendar, ListTodo, History, NotebookPen, FileBarChart, Menu, X, Users, Bell } from 'lucide-react';
import { DashboardView, AppNotification } from '../types';

interface LayoutProps {
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  children: React.ReactNode;
  notifications: AppNotification[];
  markNotificationsRead: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children, notifications, markNotificationsRead }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { view: DashboardView.CALENDAR, label: 'Calendar', icon: Calendar },
    { view: DashboardView.TASKS, label: 'Task Manager', icon: ListTodo },
    { view: DashboardView.MEETINGS, label: 'Schedules & Meetings', icon: Users },
    { view: DashboardView.HISTORY, label: 'History & Timeline', icon: History },
    { view: DashboardView.NOTES, label: 'My Notes', icon: NotebookPen },
    { view: DashboardView.REPORTS, label: 'Reports & Export', icon: FileBarChart },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <LayoutDashboard className="text-blue-400" />
            <span>OmniTask</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                ${currentView === item.view 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          v1.1.0 &copy; 2024 OmniTask
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-600 hover:bg-slate-100 p-2 rounded-md"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-slate-800">
              {navItems.find(i => i.view === currentView)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) markNotificationsRead();
                }}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-slate-100 font-semibold text-slate-700 flex justify-between items-center">
                      <span>Notifications</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{notifications.length}</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                            <h4 className="text-sm font-semibold text-slate-800 mb-1">{notif.title}</h4>
                            <p className="text-xs text-slate-600 mb-2">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 block text-right">
                              {new Date(notif.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              US
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};