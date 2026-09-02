import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Plus, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getTodayDateString, getCountdownBadge, formatShortDate } from '../utils/dateUtils';
import { FocusTimer } from './FocusTimer';

export const Dashboard: React.FC = () => {
  const { 
    tasks, 
    subjects, 
    exams, 
    profile, 
    toggleTaskComplete, 
    openTaskModal, 
    openExamModal, 
    setActivePage, 
    setSelectedSubjectId,
    addTask 
  } = useStudy();

  const [quickTitle, setQuickTitle] = useState('');
  const [quickSubjectId, setQuickSubjectId] = useState(subjects[0]?.id || '');

  const todayStr = getTodayDateString();

  // Filter today's tasks
  const todayTasks = tasks.filter(t => t.dueDate === todayStr);
  const completedTodayCount = todayTasks.filter(t => t.completed).length;
  const pendingTodayCount = todayTasks.filter(t => !t.completed).length;

  // Filter upcoming tasks (after today, pending)
  const upcomingTasks = tasks
    .filter(t => t.dueDate > todayStr && !t.completed)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  // Filter upcoming exams
  const upcomingExams = exams
    .filter(e => !e.completed)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Overall progress statistics as requested:
  // "Tasks: 12 / 18 completed, Subjects: 4, Upcoming exams: 2, And a simple progress bar."
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    addTask({
      title: quickTitle.trim(),
      subjectId: quickSubjectId || subjects[0]?.id || 'general',
      dueDate: todayStr,
      completed: false,
      priority: 'medium',
    });
    setQuickTitle('');
  };

  return (
    <div id="dashboard-bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
      {/* 🎯 Bento Tile 1: "What do I need to do today?" Hero Briefing (lg:col-span-8) */}
      <div 
        id="bento-hero-briefing"
        className="lg:col-span-8 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-500/10 flex flex-col justify-between"
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3.5 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Today's Briefing • {new Date(2026, 8, 2).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 id="bento-hero-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            What do I need to do today?
          </h1>
          <p className="mt-2 text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
            {pendingTodayCount === 0 && todayTasks.length > 0 ? (
              "🎉 Fantastic work! You have cleared all tasks scheduled for today."
            ) : pendingTodayCount === 0 ? (
              "You have no tasks scheduled for today. Take a breather, review subjects, or plan ahead!"
            ) : (
              `You have ${pendingTodayCount} pending task${pendingTodayCount === 1 ? '' : 's'} to complete today. Stay focused and keep your streak alive!`
            )}
          </p>
        </div>

        {/* Quick Bento Metrics Strip inside Hero */}
        <div id="bento-hero-metrics" className="relative z-10 mt-6 grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
          <div className="text-center py-1">
            <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif]">{pendingTodayCount}</div>
            <div className="text-[11px] text-blue-200 font-medium">To Do Today</div>
          </div>
          <div className="text-center py-1 border-x border-white/15">
            <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif]">{completedTodayCount}</div>
            <div className="text-[11px] text-blue-200 font-medium">Done Today</div>
          </div>
          <div className="text-center py-1">
            <div className="text-2xl sm:text-3xl font-black font-['Outfit',sans-serif]">{upcomingExams.length}</div>
            <div className="text-[11px] text-blue-200 font-medium">Exams Ahead</div>
          </div>
        </div>

        {/* Decorative ambient lighting */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* ⏱️ Bento Tile 2: Pomodoro Focus Timer (lg:col-span-4) */}
      <div id="bento-focus-timer-tile" className="lg:col-span-4 flex flex-col">
        <FocusTimer className="h-full flex-1" />
      </div>

      {/* 📊 Bento Tile 3: Overall Progress Section (Requirement 5, lg:col-span-12) */}
      <div 
        id="bento-overall-progress"
        className="lg:col-span-12 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">Overall Progress</h2>
            <p className="text-xs text-slate-500">Your semester workload overview and completion rate</p>
          </div>
          <div id="bento-progress-stats" className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 bg-blue-50/70 border border-blue-100/60 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              <span>Tasks: <strong>{completedTasks} / {totalTasks} completed</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100/60 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
              <span>Subjects: <strong>{subjects.length}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-100/60 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>Upcoming exams: <strong>{upcomingExams.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Simple Progress Bar as requested */}
        <div id="bento-main-progress-bar" className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-inner"
            style={{ width: `${Math.max(progressPercent, 6)}%` }}
          >
            {progressPercent}%
          </div>
        </div>

        {/* Subject pills progress breakdown */}
        <div id="bento-subject-progress-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
          {subjects.map(subj => {
            const subjTasks = tasks.filter(t => t.subjectId === subj.id);
            const subjDone = subjTasks.filter(t => t.completed).length;
            const subjPct = subjTasks.length > 0 ? Math.round((subjDone / subjTasks.length) * 100) : 0;
            return (
              <button
                key={subj.id}
                id={`bento-subject-pill-${subj.id}`}
                onClick={() => {
                  setSelectedSubjectId(subj.id);
                  setActivePage('subjects');
                }}
                className="text-left p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100 group"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{subj.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono font-medium">{subjDone}/{subjTasks.length}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${subjPct}%`,
                      backgroundColor: subj.color || '#2563eb'
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ✅ Bento Tile 4: Today's Tasks (lg:col-span-7) */}
      <div 
        id="bento-today-tasks"
        className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">Today's Tasks</h2>
                <p className="text-xs text-slate-500">Scheduled for today, {formatShortDate(todayStr)}</p>
              </div>
            </div>

            <button
              id="bento-add-task-btn"
              onClick={() => openTaskModal(undefined, quickSubjectId)}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Quick Inline Add Form */}
          <form id="bento-quick-add-form" onSubmit={handleQuickAdd} className="flex items-center gap-2 mb-4">
            <input
              id="bento-quick-title-input"
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Quick add today's task... (press Enter)"
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
            <select
              id="bento-quick-subject-select"
              value={quickSubjectId}
              onChange={(e) => setQuickSubjectId(e.target.value)}
              className="px-2.5 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-700 max-w-[130px]"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button
              id="bento-quick-add-submit"
              type="submit"
              disabled={!quickTitle.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-95"
              title="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Task list */}
          {todayTasks.length === 0 ? (
            <div id="bento-no-tasks-placeholder" className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No tasks scheduled for today.</p>
              <p className="text-xs text-slate-400 mt-1">Use the quick bar above or click Add Task.</p>
            </div>
          ) : (
            <div id="bento-today-tasks-list" className="space-y-2.5">
              {todayTasks.map((task) => {
                const subject = subjects.find(s => s.id === task.subjectId);
                return (
                  <div
                    key={task.id}
                    id={`bento-task-row-${task.id}`}
                    className={`group flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
                      task.completed
                        ? 'bg-slate-50/70 border-slate-200/60 opacity-80'
                        : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        id={`bento-task-toggle-${task.id}`}
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
                        title={task.completed ? "Mark pending" : "Mark completed"}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-blue-600" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium leading-snug transition-all ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {task.title}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {subject && (
                            <span 
                              className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: `${subject.color}15`,
                                color: subject.color,
                              }}
                            >
                              {subject.name}
                            </span>
                          )}

                          {task.dueTime && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Clock className="w-3 h-3" />
                              {task.dueTime}
                            </span>
                          )}

                          {task.priority === 'high' && !task.completed && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                              High
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      id={`bento-task-edit-${task.id}`}
                      onClick={() => openTaskModal(task)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-blue-600 px-2 py-1 transition-opacity"
                    >
                      Edit
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Link to Tasks Page */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {pendingTodayCount} remaining today
          </span>
          <button
            id="bento-view-all-tasks-link"
            onClick={() => setActivePage('tasks')}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View all tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 📅 Bento Tile 5: Upcoming Exams (Prompt Requirement 4, lg:col-span-5) */}
      <div 
        id="bento-upcoming-exams"
        className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">Upcoming Exams</h2>
                <p className="text-xs text-slate-500">Countdowns & schedule</p>
              </div>
            </div>

            <button
              id="bento-add-exam-btn"
              onClick={() => openExamModal()}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100/70 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Exam</span>
            </button>
          </div>

          {upcomingExams.length === 0 ? (
            <div id="bento-no-exams-placeholder" className="py-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No upcoming exams recorded.</p>
              <button
                id="bento-empty-add-exam-btn"
                onClick={() => openExamModal()}
                className="text-xs text-amber-600 font-semibold mt-2 hover:underline"
              >
                + Add exam schedule
              </button>
            </div>
          ) : (
            <div id="bento-exams-list" className="space-y-3">
              {upcomingExams.map(exam => {
                const subject = subjects.find(s => s.id === exam.subjectId);
                const countdown = getCountdownBadge(exam.date);
                const isUrgent = countdown.days <= 5 && countdown.days >= 0;

                return (
                  <div
                    key={exam.id}
                    id={`bento-exam-card-${exam.id}`}
                    className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {exam.title}
                          </h4>
                          {exam.type && (
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-600">
                              {exam.type}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {subject && (
                            <span 
                              className="text-[11px] font-semibold"
                              style={{ color: subject.color }}
                            >
                              {subject.name}
                            </span>
                          )}
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500">
                            {formatShortDate(exam.date)}
                            {exam.time ? ` at ${exam.time}` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Countdown Badge e.g. "Physics Midterm — 10 days left" */}
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                        isUrgent
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {countdown.label}
                      </div>
                    </div>

                    {exam.roomLocation && (
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-medium text-slate-600">Room:</span>
                        <span>{exam.roomLocation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {upcomingExams.length} scheduled total
          </span>
          <button
            id="bento-view-all-exams-link"
            onClick={() => setActivePage('exams')}
            className="inline-flex items-center gap-1 font-semibold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <span>View full exam calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 🚀 Bento Tile 6: Coming Up Soon / Quick Actions Row (if upcoming tasks exist) */}
      {upcomingTasks.length > 0 && (
        <div 
          id="bento-upcoming-tasks"
          className="lg:col-span-12 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 font-['Outfit',sans-serif]">Coming Up Next</h3>
            <button
              id="bento-see-all-tasks-btn"
              onClick={() => setActivePage('tasks')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              See all tasks ({tasks.length})
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingTasks.map(task => {
              const subject = subjects.find(s => s.id === task.subjectId);
              const badge = getCountdownBadge(task.dueDate);
              return (
                <div 
                  key={task.id} 
                  id={`bento-upcoming-task-${task.id}`}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button onClick={() => toggleTaskComplete(task.id)}>
                      <Circle className="w-4 h-4 text-slate-300 hover:text-blue-600" />
                    </button>
                    <span className="font-medium text-slate-800 truncate">{task.title}</span>
                    {subject && (
                      <span 
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0"
                        style={{ backgroundColor: `${subject.color}15`, color: subject.color }}
                      >
                        {subject.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 shrink-0 ml-2">
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
