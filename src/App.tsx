import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TasksPage } from './components/TasksPage';
import { SubjectsPage } from './components/SubjectsPage';
import { ExamsPage } from './components/ExamsPage';
import { SettingsPage } from './components/SettingsPage';
import { TaskModal } from './components/TaskModal';
import { ExamModal } from './components/ExamModal';
import { SubjectModal } from './components/SubjectModal';
import { ImageGeneratorModal } from './components/ImageGeneratorModal';

const MainContent: React.FC = () => {
  const { activePage } = useStudy();

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TasksPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'exams':
        return <ExamsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Right main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal />
      <ExamModal />
      <SubjectModal />
      <ImageGeneratorModal />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainContent />
    </StudyProvider>
  );
}
