import React, { useState, useEffect } from 'react';
import { X, Layers, Palette } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Subject } from '../types';

const COLOR_PRESETS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#7c3aed', // Purple
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#0891b2', // Cyan
  '#d97706', // Amber
  '#4f46e5', // Indigo
];

export const SubjectModal: React.FC = () => {
  const { isSubjectModalOpen, closeSubjectModal, editingSubject, addSubject, updateSubject } = useStudy();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (editingSubject) {
      setName(editingSubject.name);
      setCode(editingSubject.code || '');
      setColor(editingSubject.color || COLOR_PRESETS[0]);
      setDescription(editingSubject.description || '');
      setCoverImage(editingSubject.coverImage || '');
    } else {
      setName('');
      setCode('');
      setColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
      setDescription('');
      setCoverImage('');
    }
  }, [editingSubject, isSubjectModalOpen]);

  if (!isSubjectModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject({
        ...editingSubject,
        name: name.trim(),
        code: code.trim() || undefined,
        color,
        description: description.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim() || undefined,
        color,
        description: description.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
      });
    }

    closeSubjectModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h2>
          </div>
          <button
            onClick={closeSubjectModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Physics, Mathematics, Computer Science, English"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Course / Module Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PHYS-201, CS-220"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Theme Color
              </label>
              <div className="flex items-center gap-1.5 py-1">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Description / Course Outline
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key textbook, professor, syllabus focus..."
              rows={2}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/... or use AI generator"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              You can also generate high-resolution AI covers with custom aspect ratios after saving!
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={closeSubjectModal}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              {editingSubject ? 'Save Changes' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
