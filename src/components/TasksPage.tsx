import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  AlertCircle,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getTodayDateString, getCountdownBadge, formatShortDate } from '../utils/dateUtils';
import { TaskPriority } from '../types';

type TaskFilterTab = 'all' | 'today' | 'upcoming' | 'completed';

export const TasksPage: React.FC = () => {
  const { 
    tasks, 
    subjects, 
    toggleTaskComplete, 
    deleteTask, 
    openTaskModal, 
    searchQuery, 
    setSearchQuery 
  } = useStudy();

  const [activeTab, setActiveTab] = useState<TaskFilterTab>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');

  const todayStr = getTodayDateString();

  // Filter tasks based on controls
  const filteredTasks = tasks.filter(task => {
    // Subject filter
    if (selectedSubjectFilter !== 'all' && task.subjectId !== selectedSubjectFilter) {
      return false;
    }

    // Priority filter
    if (selectedPriorityFilter !== 'all' && task.priority !== selectedPriorityFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const subject = subjects.find(s => s.id === task.subjectId);
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes?.toLowerCase().includes(q);
      const matchSubject = subject?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchSubject) return false;
    }

    // Tab filter
    if (activeTab === 'today') {
      return task.dueDate === todayStr;
    }
    if (activeTab === 'upcoming') {
      return task.dueDate > todayStr && !task.completed;
    }
    if (activeTab === 'completed') {
      return task.completed;
    }

    return true;
  });

  // Sort: pending first, then by dueDate asc
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return a.dueDate.localeCompare(b.dueDate);
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const todayCount = tasks.filter(t => t.dueDate === todayStr).length;
  const upcomingCount = tasks.filter(t => t.dueDate > todayStr && !t.completed).length;

  return (
    <div id="tasks-page-container" className="space-y-6">
      {/* Header Bar */}
      <div id="tasks-header-bar" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="tasks-page-title" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
            Tasks Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize assignments, lab reports, and daily revision goals
          </p>
        </div>

        <button
          id="tasks-add-task-btn"
          onClick={() => openTaskModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm shadow-sm shadow-blue-600/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Filter Tabs & Controls Bento Box */}
      <div id="tasks-filter-bento" className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Tab buttons */}
          <div id="tasks-tab-list" className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-semibold text-slate-600">
            <button
              id="tasks-tab-all"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              All Tasks ({totalCount})
            </button>
            <button
              id="tasks-tab-today"
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'today'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Today ({todayCount})
            </button>
            <button
              id="tasks-tab-upcoming"
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              id="tasks-tab-completed"
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'completed'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Secondary Dropdown filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Subject Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-slate-500 font-medium">Subject:</span>
              <select
                id="tasks-filter-subject-select"
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <span className="text-slate-500 font-medium">Priority:</span>
              <select
                id="tasks-filter-priority-select"
                value={selectedPriorityFilter}
                onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {(selectedSubjectFilter !== 'all' || selectedPriorityFilter !== 'all' || searchQuery) && (
              <button
                id="tasks-reset-filters-btn"
                onClick={() => {
                  setSelectedSubjectFilter('all');
                  setSelectedPriorityFilter('all');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors font-medium text-xs flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {sortedTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200 shadow-xs">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No tasks found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery || selectedSubjectFilter !== 'all'
              ? 'No tasks matched your current search or filters. Try adjusting them.'
              : 'You have no tasks in this view. Click "Add New Task" to schedule your next study objective.'}
          </p>
          <button
            onClick={() => openTaskModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const subject = subjects.find(s => s.id === task.subjectId);
            const countdown = getCountdownBadge(task.dueDate);

            return (
              <div
                key={task.id}
                id={`tasks-list-item-${task.id}`}
                className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all ${
                  task.completed
                    ? 'border-slate-200/60 bg-slate-50/50 opacity-75'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Checkbox + Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 focus:outline-none transition-transform active:scale-90"
                      title={task.completed ? "Mark as pending" : "Mark as completed"}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 hover:text-blue-600 transition-colors" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {/* Title */}
                        <h3 className={`text-base font-semibold leading-snug transition-all ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {task.title}
                        </h3>

                        {/* Status Toggle Indicator: "○ Pending → ✓ Completed" */}
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                            task.completed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          <span>{task.completed ? '✓ Completed' : '○ Pending'}</span>
                        </button>
                      </div>

                      {/* Metadata Row: Subject • Due Date • Priority */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                        {subject && (
                          <div className="flex items-center gap-1.5">
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: subject.color }}
                            />
                            <span className="font-semibold text-slate-700">
                              {subject.name}
                            </span>
                          </div>
                        )}

                        <span className="text-slate-300">•</span>

                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due {formatShortDate(task.dueDate)}</span>
                          {task.dueTime && (
                            <span className="text-slate-400">({task.dueTime})</span>
                          )}
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            countdown.status === 'today'
                              ? 'bg-blue-100 text-blue-800'
                              : countdown.status === 'overdue'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {countdown.label}
                          </span>
                        </div>

                        {task.priority && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              task.priority === 'high'
                                ? 'text-rose-700 bg-rose-50 border border-rose-100'
                                : task.priority === 'medium'
                                ? 'text-amber-700 bg-amber-50 border border-amber-100'
                                : 'text-slate-600 bg-slate-100'
                            }`}>
                              {task.priority} Priority
                            </span>
                          </>
                        )}
                      </div>

                      {/* Notes / Description */}
                      {task.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openTaskModal(task)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
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
