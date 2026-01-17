import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { CalendarBoard } from './components/CalendarBoard';
import { TaskBoard } from './components/TaskBoard';
import { HistoryBoard } from './components/HistoryBoard';
import { NotesBoard } from './components/NotesBoard';
import { ReportsBoard } from './components/ReportsBoard';
import { MeetingsBoard } from './components/MeetingsBoard';
import { DashboardView, Task, Note, TaskStatus, Meeting, AppNotification } from './types';

// Initial Mock Data
const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Project Kickoff', description: 'Initial meeting with stakeholders', date: new Date().toISOString().split('T')[0], status: TaskStatus.DONE, remarks: 'Went well', reminder: false, createdAt: Date.now() },
  { id: '2', title: 'Submit Budget', description: 'Q4 Financial planning', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], status: TaskStatus.ON_GOING, remarks: 'Waiting for approval', reminder: true, createdAt: Date.now() },
  { id: '3', title: 'Client Review', description: 'Review designs with client', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], status: TaskStatus.PENDING, remarks: '', reminder: false, createdAt: Date.now() }
];

const MOCK_NOTES: Note[] = [
  { id: '1', title: 'Meeting Ideas', content: 'Discuss timeline extension and budget constraints.', updatedAt: Date.now() }
];

const MOCK_MEETINGS: Meeting[] = [
  { id: '1', title: 'Team Standup', date: new Date().toISOString().split('T')[0], time: '10:00', description: 'Daily sync', platform: 'Google Meet' }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<DashboardView>(DashboardView.TASKS);
  
  // State with LocalStorage Persistence
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('omniTasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('omniNotes');
    return saved ? JSON.parse(saved) : MOCK_NOTES;
  });

  const [meetings, setMeetings] = useState<Meeting[]>(() => {
     const saved = localStorage.getItem('omniMeetings');
     return saved ? JSON.parse(saved) : MOCK_MEETINGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Refs to access latest state in intervals/timeouts without dependencies
  const tasksRef = useRef(tasks);
  const notificationsRef = useRef(notifications);

  useEffect(() => {
    localStorage.setItem('omniTasks', JSON.stringify(tasks));
    tasksRef.current = tasks;
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('omniNotes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('omniMeetings', JSON.stringify(meetings));
  }, [meetings]);
  
  // Keep notification ref updated
  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  // Browser Notification & In-App Notification Logic
  useEffect(() => {
    // 1. Request Permission on mount
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const currentTasks = tasksRef.current;
      const currentNotifs = notificationsRef.current;
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      // Filter tasks due today that have reminders enabled AND are not done
      const dueTasks = currentTasks.filter(t => 
        t.date === todayStr && 
        t.reminder && 
        (t.status === TaskStatus.PENDING || t.status === TaskStatus.ON_GOING)
      );

      if (dueTasks.length > 0) {
        // Browser Notification
        if ('Notification' in window && Notification.permission === 'granted') {
           const title = dueTasks.length === 1 
            ? `Reminder: ${dueTasks[0].title}`
            : `You have ${dueTasks.length} tasks due today!`;
           
           // Only send browser notification if we haven't recently (simplified: checks if we already have an in-app notif for today)
           // ideally we track this separately, but for now we'll trigger it.
           // using 'tag' prevents spamming.
           new Notification("OmniTask Reminder", {
             body: `Check your dashboard. ${dueTasks.length} tasks pending.`,
             tag: 'omnitask-daily-reminder'
           });
        }

        // Add to In-App Notifications (Avoid Duplicates based on Task ID + Today)
        const newNotifs: AppNotification[] = [];
        dueTasks.forEach(task => {
           // Check if we already notified about this task today
           const alreadyNotified = currentNotifs.some(n => n.title === `Reminder: ${task.title}` && new Date(n.time).toDateString() === todayStr);
           if (!alreadyNotified) {
              newNotifs.push({
                id: crypto.randomUUID(),
                title: `Reminder: ${task.title}`,
                message: `This task is due today. Status: ${task.status}`,
                time: Date.now(),
                read: false
              });
           }
        });

        if (newNotifs.length > 0) {
           setNotifications(prev => [...newNotifs, ...prev]);
        }
      }
    };

    // Check 3 seconds after load to ensure everything is settled
    const initialCheck = setTimeout(checkReminders, 3000);

    // Check periodically (every 1 hour)
    const interval = setInterval(checkReminders, 60 * 60 * 1000);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
    };
  }, []);

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const renderView = () => {
    switch (currentView) {
      case DashboardView.CALENDAR:
        return <CalendarBoard tasks={tasks} />;
      case DashboardView.TASKS:
        return <TaskBoard tasks={tasks} setTasks={setTasks} />;
      case DashboardView.MEETINGS:
        return <MeetingsBoard meetings={meetings} setMeetings={setMeetings} />;
      case DashboardView.HISTORY:
        return <HistoryBoard tasks={tasks} />;
      case DashboardView.NOTES:
        return <NotesBoard notes={notes} setNotes={setNotes} />;
      case DashboardView.REPORTS:
        return <ReportsBoard tasks={tasks} />;
      default:
        return <TaskBoard tasks={tasks} setTasks={setTasks} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setCurrentView={setCurrentView}
      notifications={notifications}
      markNotificationsRead={markNotificationsRead}
    >
      {renderView()}
    </Layout>
  );
};

export default App;