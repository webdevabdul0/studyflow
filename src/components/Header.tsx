import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  CheckSquare, 
  Layers, 
  Sparkles, 
  Search, 
  Clock, 
  TrendingUp,
  X
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { getTodayDateString, formatFullDate } from '../utils/dateUtils';

export const Header: React.FC = () => {
  const { 
    tasks, 
    subjects, 
    exams, 
    openTaskModal, 
    openExamModal, 
    openSubjectModal, 
    openImageGenModal,
    searchQuery,
    setSearchQuery,
    activePage,
    setActivePage
  } = useStudy();

  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasksCount = tasks.length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const todayStr = getTodayDateString();
  const formattedToday = formatFullDate(todayStr);

  return (
    <header id="app-header" className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <button 
            id="header-logo-btn"
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight font-['Outfit',sans-serif]">StudyFlow</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">Student</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Manage tasks, subjects & exams</p>
            </div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, subjects, exams..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-100/80 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
            />
            {searchQuery && (
              <button 
                id="header-clear-search-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Today's Date Pill */}
          <div id="header-date-pill" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-medium text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formattedToday}</span>
          </div>

          {/* Quick Progress Badge */}
          <div 
            id="header-quick-progress"
            onClick={() => setActivePage('dashboard')}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/70 border border-blue-100/60 transition-colors text-xs font-medium text-blue-700"
            title="Overall task progress"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>{completedTasksCount}/{totalTasksCount} Done ({progressPercent}%)</span>
          </div>

          {/* Add Dropdown */}
          <div className="relative">
            <button
              id="header-add-dropdown-btn"
              onClick={() => setAddMenuOpen(!addMenuOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm shadow-blue-600/25 transition-all focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>

            {addMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setAddMenuOpen(false)} 
                />
                <div id="header-add-menu-popup" className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Quick Create
                  </div>
                  <button
                    id="header-quick-new-task"
                    onClick={() => {
                      setAddMenuOpen(false);
                      openTaskModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                  >
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>New Task</span>
                  </button>

                  <button
                    id="header-quick-new-subject"
                    onClick={() => {
                      setAddMenuOpen(false);
                      openSubjectModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
                  >
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>New Subject</span>
                  </button>

                  <button
                    id="header-quick-new-exam"
                    onClick={() => {
                      setAddMenuOpen(false);
                      openExamModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors text-left"
                  >
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>New Exam</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    id="header-quick-new-visual"
                    onClick={() => {
                      setAddMenuOpen(false);
                      openImageGenModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors text-left font-medium"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Generate AI Visual Aid</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
