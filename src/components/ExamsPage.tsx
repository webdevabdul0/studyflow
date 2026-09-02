import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Clock, 
  MapPin, 
  AlertCircle, 
  GraduationCap, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  List, 
  LayoutGrid 
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getCountdownBadge, formatShortDate, formatFullDate } from '../utils/dateUtils';

export const ExamsPage: React.FC = () => {
  const { exams, subjects, openExamModal, deleteExam, updateExam } = useStudy();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterType, setFilterType] = useState<'upcoming' | 'all' | 'completed'>('upcoming');

  const filteredExams = exams.filter(e => {
    if (filterType === 'upcoming') return !e.completed;
    if (filterType === 'completed') return e.completed;
    return true;
  }).sort((a, b) => a.date.localeCompare(b.date));

  const upcomingCount = exams.filter(e => !e.completed).length;

  return (
    <div id="exams-page-container" className="space-y-6">
      {/* Header Bar */}
      <div id="exams-header-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="exams-page-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Exams & Quizzes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track midterm dates, quiz schedules, and live countdowns
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div id="exams-view-mode-toggle" className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              id="exams-toggle-cards"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="exams-toggle-table"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            id="exams-add-exam-btn"
            onClick={() => openExamModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-semibold text-sm shadow-sm shadow-amber-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div id="exams-filter-tabs" className="flex items-center gap-2 p-1 bg-white border border-slate-200/80 rounded-2xl max-w-fit text-xs font-semibold shadow-2xs">
        <button
          id="exams-tab-upcoming"
          onClick={() => setFilterType('upcoming')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'upcoming'
              ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          id="exams-tab-all"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'all'
              ? 'bg-slate-100 text-slate-800 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Exams ({exams.length})
        </button>
        <button
          id="exams-tab-completed"
          onClick={() => setFilterType('completed')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filterType === 'completed'
              ? 'bg-slate-100 text-slate-800 font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completed ({exams.filter(e => e.completed).length})
        </button>
      </div>

      {/* Content */}
      {filteredExams.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No exams in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Stay prepared by logging midterms, finals, quizzes and laboratory exams early.
          </p>
          <button
            onClick={() => openExamModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam Schedule</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View (as explicitly demonstrated in prompt table: Exam | Subject | Date) */
        <div id="exams-table-container" className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Exam</th>
                  <th className="py-3.5 px-5">Subject</th>
                  <th className="py-3.5 px-5">Date & Time</th>
                  <th className="py-3.5 px-5">Countdown</th>
                  <th className="py-3.5 px-5">Room / Location</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExams.map((exam) => {
                  const subject = subjects.find(s => s.id === exam.subjectId);
                  const countdown = getCountdownBadge(exam.date);
                  const isUrgent = countdown.days <= 5 && countdown.days >= 0;

                  return (
                    <tr key={exam.id} id={`exam-table-row-${exam.id}`} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{exam.title}</span>
                          {exam.type && (
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {exam.type}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        {subject ? (
                          <span 
                            className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                          >
                            {subject.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-600">
                        <div>{formatFullDate(exam.date)}</div>
                        {exam.time && <div className="text-xs text-slate-400">{exam.time}</div>}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                          exam.completed
                            ? 'bg-slate-100 text-slate-500'
                            : isUrgent
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}>
                          {exam.completed ? 'Finished' : countdown.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-slate-500">
                        {exam.roomLocation || '—'}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => updateExam({ ...exam, completed: !exam.completed })}
                            className={`p-1.5 rounded-lg transition-colors ${
                              exam.completed ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'
                            }`}
                            title={exam.completed ? "Mark incomplete" : "Mark completed"}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openExamModal(exam)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit exam"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete exam "${exam.title}"?`)) {
                                deleteExam(exam.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete exam"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View with Countdown Highlights */
        <div id="exams-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => {
            const subject = subjects.find(s => s.id === exam.subjectId);
            const countdown = getCountdownBadge(exam.date);
            const isUrgent = countdown.days <= 5 && countdown.days >= 0;

            return (
              <div
                key={exam.id}
                id={`exam-card-${exam.id}`}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  exam.completed
                    ? 'border-slate-200/60 opacity-70 bg-slate-50/50'
                    : isUrgent
                    ? 'border-amber-300 shadow-sm bg-gradient-to-b from-amber-50/30 to-white'
                    : 'border-slate-200/90 shadow-xs hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Top row: Subject tag + Countdown badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {subject ? (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          backgroundColor: `${subject.color}15`,
                          color: subject.color,
                        }}
                      >
                        {subject.name}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">General</span>
                    )}

                    {/* Countdown banner e.g. "Physics Midterm — 10 days left" */}
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        exam.completed
                          ? 'bg-slate-100 text-slate-500'
                          : isUrgent
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}
                    >
                      {exam.completed ? 'Finished' : countdown.label}
                    </span>
                  </div>

                  {/* Exam Title */}
                  <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {exam.title}
                  </h3>

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatFullDate(exam.date)}</span>
                    {exam.time && (
                      <>
                        <span className="text-slate-300">•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{exam.time}</span>
                      </>
                    )}
                  </div>

                  {/* Room Location */}
                  {exam.roomLocation && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exam.roomLocation}</span>
                    </div>
                  )}

                  {/* Notes / Syllabus */}
                  {exam.notes && (
                    <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {exam.notes}
                    </p>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => updateExam({ ...exam, completed: !exam.completed })}
                    className={`inline-flex items-center gap-1.5 font-semibold transition-colors ${
                      exam.completed ? 'text-slate-500 hover:text-slate-800' : 'text-emerald-700 hover:text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{exam.completed ? 'Mark incomplete' : 'Mark finished'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openExamModal(exam)}
                      className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                      title="Edit exam"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete exam "${exam.title}"?`)) {
                          deleteExam(exam.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
