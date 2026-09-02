import React from 'react';
import { 
  BookOpen, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getCountdownBadge, formatShortDate } from '../utils/dateUtils';

export const SubjectsPage: React.FC = () => {
  const { 
    subjects, 
    tasks, 
    exams, 
    selectedSubjectId, 
    setSelectedSubjectId, 
    openSubjectModal, 
    deleteSubject,
    openTaskModal,
    openExamModal,
    openImageGenModal,
    toggleTaskComplete
  } = useStudy();

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

  // If a subject is selected, show the dedicated Subject Detail view
  if (selectedSubject) {
    const subjectTasks = tasks.filter(t => t.subjectId === selectedSubject.id);
    const completedTasks = subjectTasks.filter(t => t.completed);
    const pendingTasks = subjectTasks.filter(t => !t.completed);
    const progressPct = subjectTasks.length > 0 ? Math.round((completedTasks.length / subjectTasks.length) * 100) : 0;
    const subjectExams = exams.filter(e => e.subjectId === selectedSubject.id && !e.completed);

    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all subjects</span>
        </button>

        {/* Subject Hero Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Cover Banner */}
          <div className="h-44 sm:h-52 w-full relative bg-slate-900 overflow-hidden">
            {selectedSubject.coverImage ? (
              <img
                src={selectedSubject.coverImage}
                alt={selectedSubject.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
            ) : (
              <div 
                className="w-full h-full opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${selectedSubject.color} 0%, #0f172a 100%)`
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Quick AI Cover generator trigger */}
            <button
              onClick={() => openImageGenModal(selectedSubject.id, `${selectedSubject.name} academic concept illustration, high detail aesthetic diagram`)}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all shadow-sm"
              title="Generate new AI cover with aspect ratio & resolution controls"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generate AI Cover</span>
            </button>

            {/* Title overlay in banner */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selectedSubject.code && (
                    <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-xs font-bold font-mono tracking-wider">
                      {selectedSubject.code}
                    </span>
                  )}
                  <span 
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: selectedSubject.color }}
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit',sans-serif]">
                  {selectedSubject.name}
                </h1>
                {selectedSubject.description && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                    {selectedSubject.description}
                  </p>
                )}
              </div>

              {/* Subject actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openSubjectModal(selectedSubject)}
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold text-white border border-white/20 transition-colors"
                >
                  Edit Subject
                </button>
              </div>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-slate-500 font-medium">Completed Tasks</div>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {completedTasks.length} / {subjectTasks.length}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Pending Tasks</div>
                <div className="text-lg font-bold text-amber-600 font-mono">
                  {pendingTasks.length}
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-xs text-slate-500 font-medium">Upcoming Exams</div>
                <div className="text-lg font-bold text-indigo-600 font-mono">
                  {subjectExams.length}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>Subject Mastery</span>
                <span>{progressPct}%</span>
              </div>
              <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPct}%`,
                    backgroundColor: selectedSubject.color || '#2563eb',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns: Subject Tasks + Subject Exams */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Subject Tasks (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {selectedSubject.name} Tasks ({subjectTasks.length})
                  </h3>
                </div>
                <button
                  onClick={() => openTaskModal(undefined, selectedSubject.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100/80 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {subjectTasks.length === 0 ? (
                <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No tasks recorded for {selectedSubject.name}.</p>
                  <button
                    onClick={() => openTaskModal(undefined, selectedSubject.id)}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    + Add first task
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {subjectTasks.map(task => {
                    const countdown = getCountdownBadge(task.dueDate);
                    return (
                      <div
                        key={task.id}
                        className={`flex items-start justify-between p-3.5 rounded-xl border transition-all ${
                          task.completed
                            ? 'bg-slate-50/70 border-slate-200/60 opacity-75'
                            : 'bg-white border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className="mt-0.5 focus:outline-none"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 hover:text-blue-600" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-semibold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                              <span>Due {formatShortDate(task.dueDate)}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {countdown.label}
                              </span>
                              {task.priority === 'high' && (
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                  High
                                </span>
                              )}
                            </div>
                            {task.notes && (
                              <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2 rounded-lg">
                                {task.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Subject Exams (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                    Upcoming Exams ({subjectExams.length})
                  </h3>
                </div>
                <button
                  onClick={() => openExamModal(undefined, selectedSubject.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100/80 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Exam</span>
                </button>
              </div>

              {subjectExams.length === 0 ? (
                <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-medium">No upcoming exams for this subject.</p>
                  <button
                    onClick={() => openExamModal(undefined, selectedSubject.id)}
                    className="mt-2 text-xs font-semibold text-amber-600 hover:underline"
                  >
                    + Add exam schedule
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {subjectExams.map(exam => {
                    const countdown = getCountdownBadge(exam.date);
                    return (
                      <div key={exam.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{exam.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formatShortDate(exam.date)} {exam.time ? `• ${exam.time}` : ''}
                            </p>
                            {exam.roomLocation && (
                              <p className="text-[11px] text-slate-500 mt-1">
                                Room: {exam.roomLocation}
                              </p>
                            )}
                          </div>
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            {countdown.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Visual Aid & Flashcard Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Study Visual Generator</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Create subject-specific concept diagrams, revision covers, or study mindscapes with 1K/2K/4K resolution and custom aspect ratios.
              </p>
              <button
                onClick={() => openImageGenModal(selectedSubject.id, `${selectedSubject.name} study mindmap and key scientific concepts, modern digital illustration`)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Generate Study Visual
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render grid of all subjects
  return (
    <div className="space-y-6">
      {/* Header */}
      <div id="subjects-page-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="subjects-page-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Subjects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse coursework, track subject completion, and customize revision materials
          </p>
        </div>

        <button
          id="subjects-add-subject-btn"
          onClick={() => openSubjectModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm shadow-sm shadow-blue-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div id="subjects-bento-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {subjects.map(subject => {
          const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
          const completedTasks = subjectTasks.filter(t => t.completed);
          const pendingTasks = subjectTasks.filter(t => !t.completed);
          const progressPct = subjectTasks.length > 0 ? Math.round((completedTasks.length / subjectTasks.length) * 100) : 0;
          const subjectExams = exams.filter(e => e.subjectId === subject.id && !e.completed);

          return (
            <div
              key={subject.id}
              id={`subject-card-${subject.id}`}
              className="group bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col overflow-hidden text-left"
            >
              {/* Cover thumbnail */}
              <div 
                id={`subject-cover-${subject.id}`}
                onClick={() => setSelectedSubjectId(subject.id)}
                className="h-32 w-full relative bg-slate-800 cursor-pointer overflow-hidden"
              >
                {subject.coverImage ? (
                  <img
                    src={subject.coverImage}
                    alt={subject.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                ) : (
                  <div
                    className="w-full h-full opacity-80"
                    style={{
                      background: `linear-gradient(135deg, ${subject.color} 0%, #1e293b 100%)`
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Code badge */}
                {subject.code && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/20">
                    {subject.code}
                  </div>
                )}

                {/* Quick AI cover button */}
                <button
                  id={`subject-ai-cover-btn-${subject.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageGenModal(subject.id, `${subject.name} course banner illustration, clean modern style`);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-colors"
                  title="Generate new AI cover with aspect ratio & resolution"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </button>

                {/* Title on cover */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5">
                  <h3 className="text-lg font-bold text-white font-['Outfit',sans-serif] truncate drop-shadow-xs">
                    {subject.name}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div 
                id={`subject-body-${subject.id}`}
                onClick={() => setSelectedSubjectId(subject.id)}
                className="p-5 flex-1 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {subject.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                      {subject.description}
                    </p>
                  )}

                  {/* Task and Exam counts */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 my-2">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Tasks</span>
                      <span className="font-semibold text-slate-800">
                        {completedTasks.length} / {subjectTasks.length} Done
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Upcoming Exams</span>
                      <span className="font-semibold text-amber-600">
                        {subjectExams.length} scheduled
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPct}%`,
                        backgroundColor: subject.color || '#2563eb',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  View Tasks & Exams →
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openSubjectModal(subject);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded"
                    title="Edit subject"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete subject "${subject.name}"? This will also remove its tasks and exams.`)) {
                        deleteSubject(subject.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
