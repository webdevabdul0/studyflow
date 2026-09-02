import React, { useState, useEffect } from 'react';
import { X, Calendar, GraduationCap } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Exam, ExamType } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

export const ExamModal: React.FC = () => {
  const { 
    isExamModalOpen, 
    closeExamModal, 
    editingExam, 
    defaultModalSubjectId, 
    subjects, 
    addExam, 
    updateExam 
  } = useStudy();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<ExamType>('midterm');
  const [roomLocation, setRoomLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingExam) {
      setTitle(editingExam.title);
      setSubjectId(editingExam.subjectId);
      setDate(editingExam.date);
      setTime(editingExam.time || '');
      setType(editingExam.type || 'midterm');
      setRoomLocation(editingExam.roomLocation || '');
      setNotes(editingExam.notes || '');
    } else {
      setTitle('');
      setSubjectId(defaultModalSubjectId || subjects[0]?.id || '');
      setDate(getTodayDateString());
      setTime('10:00');
      setType('midterm');
      setRoomLocation('');
      setNotes('');
    }
  }, [editingExam, defaultModalSubjectId, subjects, isExamModalOpen]);

  if (!isExamModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !date) return;

    if (editingExam) {
      updateExam({
        ...editingExam,
        title: title.trim(),
        subjectId,
        date,
        time: time || undefined,
        type,
        roomLocation: roomLocation.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } else {
      addExam({
        title: title.trim(),
        subjectId,
        date,
        time: time || undefined,
        type,
        roomLocation: roomLocation.trim() || undefined,
        notes: notes.trim() || undefined,
        completed: false,
      });
    }

    closeExamModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              {editingExam ? 'Edit Exam' : 'Schedule Exam'}
            </h2>
          </div>
          <button
            onClick={closeExamModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Exam Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics Midterm, Math Quiz"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Assessment Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ExamType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
              >
                <option value="midterm">Midterm Exam</option>
                <option value="quiz">Pop / Chapter Quiz</option>
                <option value="final">Final Examination</option>
                <option value="lab">Lab Practical</option>
                <option value="presentation">Presentation / Defense</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Exam Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Start Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Room Location or Hall
            </label>
            <input
              type="text"
              value={roomLocation}
              onChange={(e) => setRoomLocation(e.target.value)}
              placeholder="e.g. Science Hall 304, Auditorium B"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Syllabus Topics & Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chapters covered, formula sheet permitted, weight percentage..."
              rows={3}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:outline-none text-slate-800"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeExamModal}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors"
            >
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
