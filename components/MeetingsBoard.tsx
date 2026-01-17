import React, { useState } from 'react';
import { Meeting } from '../types';
import { Plus, Video, Trash2, Calendar, Clock, Link as LinkIcon, X } from 'lucide-react';

interface MeetingsBoardProps {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
}

export const MeetingsBoard: React.FC<MeetingsBoardProps> = ({ meetings, setMeetings }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting>({
    id: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    description: '',
    platform: 'Zoom'
  });

  const handleSaveMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting = { ...currentMeeting, id: crypto.randomUUID() };
    setMeetings([...meetings, newMeeting].sort((a, b) => 
      new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
    ));
    setIsModalOpen(false);
    setCurrentMeeting({
      id: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      description: '',
      platform: 'Zoom'
    });
  };

  const handleDeleteMeeting = (id: string) => {
    if (confirm('Delete this meeting?')) {
      setMeetings(meetings.filter(m => m.id !== id));
    }
  };

  // Group meetings by date (Upcoming vs Past)
  const now = new Date();
  const upcomingMeetings = meetings.filter(m => new Date(`${m.date}T${m.time}`) >= now);
  const pastMeetings = meetings.filter(m => new Date(`${m.date}T${m.time}`) < now);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Schedules & Meetings</h2>
           <p className="text-slate-500 text-sm">Manage your calls and appointments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming List */}
        <div className="space-y-4">
          <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-lg">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Upcoming Meetings
          </h3>
          {upcomingMeetings.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
              No upcoming meetings scheduled.
            </div>
          ) : (
            upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors group">
                <div className="flex justify-between items-start">
                   <div className="flex items-start gap-4">
                      <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
                        <Video size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">{meeting.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar size={14}/> {meeting.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {meeting.time}</span>
                        </div>
                        <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                           <span className="font-semibold text-slate-700">{meeting.platform}</span>
                           {meeting.description && <span className="text-slate-500"> - {meeting.description}</span>}
                        </div>
                      </div>
                   </div>
                   <button onClick={() => handleDeleteMeeting(meeting.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Past List */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-500 flex items-center gap-2 text-lg">
            Previous Meetings
          </h3>
          {pastMeetings.length === 0 ? (
             <div className="text-slate-400 text-sm italic">No history available.</div>
          ) : (
            pastMeetings.map(meeting => (
              <div key={meeting.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 opacity-75 grayscale hover:grayscale-0 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-slate-700">{meeting.title}</h4>
                    <div className="text-xs text-slate-500 flex gap-2 mt-1">
                      <span>{meeting.date}</span> • <span>{meeting.time}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteMeeting(meeting.id)} className="text-slate-300 hover:text-red-500">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Schedule Meeting</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveMeeting} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input required type="text" value={currentMeeting.title} onChange={e => setCurrentMeeting({...currentMeeting, title: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Weekly Sync" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                   <input required type="date" value={currentMeeting.date} onChange={e => setCurrentMeeting({...currentMeeting, date: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                   <input required type="time" value={currentMeeting.time} onChange={e => setCurrentMeeting({...currentMeeting, time: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Platform / Location</label>
                <input required type="text" value={currentMeeting.platform} onChange={e => setCurrentMeeting({...currentMeeting, platform: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Zoom, Google Meet" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description / Link</label>
                <textarea rows={2} value={currentMeeting.description} onChange={e => setCurrentMeeting({...currentMeeting, description: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Meeting link or agenda..." />
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 mt-2">Save Meeting</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};