import React from 'react';
import { 
  Home, 
  CheckSquare, 
  BookOpen, 
  Calendar, 
  Settings,
  Sparkles,
  Flame,
  ChevronRight
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { PageId } from '../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage, tasks, exams, subjects, openImageGenModal } = useStudy();

  const pendingTasksToday = tasks.filter(t => !t.completed && t.dueDate === '2026-09-02').length;
  const upcomingExamsCount = exams.filter(e => !e.completed).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingTasksToday > 0 ? pendingTasksToday : undefined,
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookOpen,
      badge: subjects.length,
    },
    {
      id: 'exams',
      label: 'Exams',
      icon: Calendar,
      badge: upcomingExamsCount > 0 ? upcomingExamsCount : undefined,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside id="app-desktop-sidebar" className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 shrink-0 min-h-[calc(100vh-61px)]">
        <div id="sidebar-nav-list" className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-medium text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-2xs border border-blue-100/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    id={`sidebar-badge-${item.id}`}
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Focus & AI Tools Bento Card */}
        <div id="sidebar-ai-bento-card" className="mt-auto pt-6">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-purple-50/60 border border-indigo-100/80 shadow-2xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-indigo-950">Study AI Visuals</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Generate custom subject covers & visual aids with aspect ratio & resolution controls.
            </p>
            <button
              id="sidebar-create-visual-btn"
              onClick={() => openImageGenModal()}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold shadow-2xs transition-colors"
            >
              <span>Create Visual</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Student Daily Streak Badge */}
          <div id="sidebar-streak-badge" className="mt-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Study Streak: <strong>5 Days Active</strong></span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav id="app-mobile-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActivePage(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className={`text-[11px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
