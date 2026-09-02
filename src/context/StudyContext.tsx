import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Subject, Task, Exam, StudentProfile, PageId, GeneratedStudyImage } from '../types';
import { INITIAL_SUBJECTS, INITIAL_TASKS, INITIAL_EXAMS, INITIAL_PROFILE } from '../data/initialData';

interface StudyContextType {
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  profile: StudentProfile;
  generatedImages: GeneratedStudyImage[];
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Task actions
  toggleTaskComplete: (taskId: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;

  // Subject actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Subject;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (subjectId: string) => void;
  setSubjectCover: (subjectId: string, imageUrl: string) => void;

  // Exam actions
  addExam: (exam: Omit<Exam, 'id'>) => Exam;
  updateExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;

  // AI Generated Images
  saveGeneratedImage: (image: GeneratedStudyImage) => void;

  // Profile
  updateProfile: (profile: Partial<StudentProfile>) => void;

  // Modals
  isTaskModalOpen: boolean;
  openTaskModal: (task?: Task, defaultSubjectId?: string) => void;
  closeTaskModal: () => void;
  editingTask: Task | null;
  defaultModalSubjectId?: string;

  isExamModalOpen: boolean;
  openExamModal: (exam?: Exam, defaultSubjectId?: string) => void;
  closeExamModal: () => void;
  editingExam: Exam | null;

  isSubjectModalOpen: boolean;
  openSubjectModal: (subject?: Subject) => void;
  closeSubjectModal: () => void;
  editingSubject: Subject | null;

  isImageGenModalOpen: boolean;
  openImageGenModal: (targetSubjectId?: string, defaultPrompt?: string) => void;
  closeImageGenModal: () => void;
  imageGenTargetSubjectId: string | null;
  imageGenDefaultPrompt: string;

  // Persistence helpers
  resetToDemoData: () => void;
  exportBackupJson: () => string;
  importBackupJson: (json: string) => boolean;
}

const STORAGE_KEYS = {
  SUBJECTS: 'studyflow_subjects_v1',
  TASKS: 'studyflow_tasks_v1',
  EXAMS: 'studyflow_exams_v1',
  PROFILE: 'studyflow_profile_v1',
  IMAGES: 'studyflow_images_v1',
};

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedStudyImage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IMAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultModalSubjectId, setDefaultModalSubjectId] = useState<string | undefined>(undefined);

  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [isImageGenModalOpen, setIsImageGenModalOpen] = useState(false);
  const [imageGenTargetSubjectId, setImageGenTargetSubjectId] = useState<string | null>(null);
  const [imageGenDefaultPrompt, setImageGenDefaultPrompt] = useState<string>('');

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error("Failed to save subjects to storage", e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks to storage", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch (e) {
      console.error("Failed to save exams to storage", e);
    }
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save profile to storage", e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(generatedImages));
    } catch (e) {
      console.error("Failed to save images to storage", e);
    }
  }, [generatedImages]);

  // Task Handlers
  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const nextCompleted = !task.completed;
          if (nextCompleted) {
            // Trigger gentle celebratory confetti
            try {
              confetti({
                particleCount: 40,
                spread: 60,
                origin: { y: 0.75 },
                colors: ['#2563eb', '#10b981', '#7c3aed', '#f59e0b'],
                disableForReducedMotion: true,
              });
            } catch (e) {
              // Ignore if blocked
            }
          }
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const addTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Subject Handlers
  const addSubject = (newSubjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...newSubjectData,
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => prev.map(s => (s.id === updatedSubject.id ? updatedSubject : s)));
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    // Clean up dependent tasks and exams or keep them unassigned
    setTasks(prev => prev.filter(t => t.subjectId !== subjectId));
    setExams(prev => prev.filter(e => e.subjectId !== subjectId));
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
    }
  };

  const setSubjectCover = (subjectId: string, imageUrl: string) => {
    setSubjects(prev =>
      prev.map(s => (s.id === subjectId ? { ...s, coverImage: imageUrl } : s))
    );
  };

  // Exam Handlers
  const addExam = (newExamData: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...newExamData,
      id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setExams(prev => [...prev, newExam]);
    return newExam;
  };

  const updateExam = (updatedExam: Exam) => {
    setExams(prev => prev.map(e => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const deleteExam = (examId: string) => {
    setExams(prev => prev.filter(e => e.id !== examId));
  };

  // Generated Images
  const saveGeneratedImage = (image: GeneratedStudyImage) => {
    setGeneratedImages(prev => [image, ...prev]);
    if (image.subjectId) {
      setSubjectCover(image.subjectId, image.imageUrl);
    }
  };

  const updateProfile = (partial: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...partial }));
  };

  // Modal helpers
  const openTaskModal = (task?: Task, subjectId?: string) => {
    setEditingTask(task || null);
    setDefaultModalSubjectId(subjectId);
    setIsTaskModalOpen(true);
  };
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setDefaultModalSubjectId(undefined);
  };

  const openExamModal = (exam?: Exam, subjectId?: string) => {
    setEditingExam(exam || null);
    setDefaultModalSubjectId(subjectId);
    setIsExamModalOpen(true);
  };
  const closeExamModal = () => {
    setIsExamModalOpen(false);
    setEditingExam(null);
    setDefaultModalSubjectId(undefined);
  };

  const openSubjectModal = (subject?: Subject) => {
    setEditingSubject(subject || null);
    setIsSubjectModalOpen(true);
  };
  const closeSubjectModal = () => {
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  const openImageGenModal = (targetSubjectId?: string, defaultPrompt?: string) => {
    setImageGenTargetSubjectId(targetSubjectId || null);
    setImageGenDefaultPrompt(defaultPrompt || '');
    setIsImageGenModalOpen(true);
  };
  const closeImageGenModal = () => {
    setIsImageGenModalOpen(false);
    setImageGenTargetSubjectId(null);
    setImageGenDefaultPrompt('');
  };

  // Data helpers
  const resetToDemoData = () => {
    setSubjects(INITIAL_SUBJECTS);
    setTasks(INITIAL_TASKS);
    setExams(INITIAL_EXAMS);
    setProfile(INITIAL_PROFILE);
    setGeneratedImages([]);
    setSelectedSubjectId(null);
  };

  const exportBackupJson = (): string => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      subjects,
      tasks,
      exams,
      profile,
      generatedImages,
    };
    return JSON.stringify(data, null, 2);
  };

  const importBackupJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.subjects) && Array.isArray(data.tasks)) {
        setSubjects(data.subjects);
        setTasks(data.tasks);
        if (Array.isArray(data.exams)) setExams(data.exams);
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.generatedImages)) setGeneratedImages(data.generatedImages);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        subjects,
        tasks,
        exams,
        profile,
        generatedImages,
        activePage,
        setActivePage,
        selectedSubjectId,
        setSelectedSubjectId,
        searchQuery,
        setSearchQuery,
        toggleTaskComplete,
        addTask,
        updateTask,
        deleteTask,
        addSubject,
        updateSubject,
        deleteSubject,
        setSubjectCover,
        addExam,
        updateExam,
        deleteExam,
        saveGeneratedImage,
        updateProfile,
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        editingTask,
        defaultModalSubjectId,
        isExamModalOpen,
        openExamModal,
        closeExamModal,
        editingExam,
        isSubjectModalOpen,
        openSubjectModal,
        closeSubjectModal,
        editingSubject,
        isImageGenModalOpen,
        openImageGenModal,
        closeImageGenModal,
        imageGenTargetSubjectId,
        imageGenDefaultPrompt,
        resetToDemoData,
        exportBackupJson,
        importBackupJson,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
