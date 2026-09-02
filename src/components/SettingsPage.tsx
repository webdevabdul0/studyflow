import React, { useState } from 'react';
import { 
  User, 
  Sparkles, 
  Database, 
  RotateCcw, 
  ShieldCheck, 
  Download, 
  Layers, 
  Check, 
  Cloud,
  GraduationCap
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const SettingsPage: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    resetToInitialData, 
    generatedImages, 
    openImageGenModal,
    subjects,
    setSubjectCover
  } = useStudy();

  const [name, setName] = useState(profile.name);
  const [gradeLevel, setGradeLevel] = useState(profile.gradeLevel);
  const [school, setSchool] = useState(profile.school);
  const [semester, setSemester] = useState(profile.semester);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      gradeLevel: gradeLevel.trim(),
      school: school.trim(),
      semester: semester.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleResetData = () => {
    if (confirm("Reset StudyFlow back to original sample data? Any newly created tasks, exams, or subjects will be replaced with defaults.")) {
      resetToInitialData();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
          Student Settings & Workspace
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your academic profile, AI visual asset library, and storage preferences
        </p>
      </div>

      {/* Academic Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">Student Profile</h2>
            <p className="text-xs text-slate-500">Your greeting on the dashboard and semester timeline</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Semester / Term
              </label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. Fall 2026 Semester"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Institution / High School / University
              </label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Academic Standing / Major
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saveSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : <div />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* AI Visuals & Cover Studio Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                AI Generated Visuals & Covers
              </h2>
              <p className="text-xs text-slate-500">
                Crafted with Gemini 3 Pro / Flash with custom aspect ratios & resolutions
              </p>
            </div>
          </div>

          <button
            onClick={() => openImageGenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate New Visual</span>
          </button>
        </div>

        {generatedImages.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-sm font-semibold text-slate-800">No AI visuals generated yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Create custom textbook covers, mind-map illustrations, or study flashcard banners with 1K/2K/4K resolutions and 8 aspect ratios.
            </p>
            <button
              onClick={() => openImageGenModal()}
              className="mt-3 text-xs font-bold text-purple-600 hover:underline"
            >
              + Try generating an image now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {generatedImages.map((img) => (
              <div key={img.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col group">
                <div className="relative h-36 bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-white font-bold">
                    {img.aspectRatio} • {img.imageSize}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-700 line-clamp-2 font-medium">
                    {img.prompt}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono text-[10px]">
                      {img.model.includes('pro') ? 'Studio Pro' : 'Flash'}
                    </span>
                    <a
                      href={img.imageUrl}
                      download={`study-visual-${img.id}.png`}
                      className="text-purple-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cloud & Data Storage */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">Data Persistence & Sync</h2>
            <p className="text-xs text-slate-500">Automatic local browser storage with zero data loss</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Persistent Offline-Ready State</span>
          </div>
          <p>
            Your tasks, subjects, exams, countdowns, and generated visuals are immediately synchronized to your browser's persistent storage engine on every edit, keeping your schedule ready even without internet connectivity.
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">Reset StudyFlow Sample Data</div>
            <div className="text-[11px] text-slate-500">Restore physics, calculus, CS courses and exams to defaults</div>
          </div>
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100/70 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
