export type PageId = 'dashboard' | 'tasks' | 'subjects' | 'exams' | 'settings';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  priority: TaskPriority;
  notes?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string; // Tailwind color or hex
  iconName?: string;
  description?: string;
  coverImage?: string; // AI generated or preset
  createdAt: string;
}

export type ExamType = 'midterm' | 'quiz' | 'final' | 'exam' | 'test' | 'lab' | 'presentation';

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  time?: string; // e.g. "09:30"
  type: ExamType;
  roomLocation?: string;
  notes?: string;
  weightPercent?: number;
  completed?: boolean;
}

export interface StudentProfile {
  name: string;
  email: string;
  gradeLevel: string;
  schoolName: string;
  dailyGoalMinutes: number;
}

export type AspectRatioOption = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
export type ImageSizeOption = '1K' | '2K' | '4K';
export type ImageModelOption = 'gemini-3.1-flash-image-preview' | 'gemini-3-pro-image-preview';

export interface GeneratedStudyImage {
  id: string;
  prompt: string;
  imageUrl: string;
  aspectRatio: AspectRatioOption;
  imageSize: ImageSizeOption;
  model: ImageModelOption;
  createdAt: string;
  subjectId?: string;
}
