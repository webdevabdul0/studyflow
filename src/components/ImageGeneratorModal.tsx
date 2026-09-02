import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  Check, 
  AlertCircle, 
  Loader2, 
  Layers, 
  Maximize2,
  RefreshCw
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { AspectRatioOption, ImageSizeOption, ImageModelOption, GeneratedStudyImage } from '../types';

export const ImageGeneratorModal: React.FC = () => {
  const { 
    isImageGenModalOpen, 
    closeImageGenModal, 
    subjects, 
    imageGenTargetSubjectId, 
    imageGenDefaultPrompt,
    saveGeneratedImage,
    setSubjectCover
  } = useStudy();

  const [prompt, setPrompt] = useState(imageGenDefaultPrompt || '');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('16:9');
  const [imageSize, setImageSize] = useState<ImageSizeOption>('1K');
  const [model, setModel] = useState<ImageModelOption>('gemini-3.1-flash-image-preview');
  const [targetSubjectId, setTargetSubjectId] = useState<string>(imageGenTargetSubjectId || '');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    text?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Sync default prompt when modal opens
  React.useEffect(() => {
    if (isImageGenModalOpen) {
      if (imageGenDefaultPrompt) {
        setPrompt(imageGenDefaultPrompt);
      }
      if (imageGenTargetSubjectId) {
        setTargetSubjectId(imageGenTargetSubjectId);
        const subj = subjects.find(s => s.id === imageGenTargetSubjectId);
        if (subj && !imageGenDefaultPrompt) {
          setPrompt(`${subj.name} textbook concept illustration, clean modern diagram`);
        }
      }
      setGeneratedResult(null);
      setErrorMsg(null);
      setAppliedSuccess(false);
    }
  }, [isImageGenModalOpen, imageGenDefaultPrompt, imageGenTargetSubjectId, subjects]);

  if (!isImageGenModalOpen) return null;

  const aspectRatios: { value: AspectRatioOption; label: string; desc: string }[] = [
    { value: '16:9', label: '16:9', desc: 'Subject Banner' },
    { value: '1:1', label: '1:1', desc: 'Square / Icon' },
    { value: '4:3', label: '4:3', desc: 'Presentation' },
    { value: '3:4', label: '3:4', desc: 'Document Card' },
    { value: '3:2', label: '3:2', desc: 'Landscape Photo' },
    { value: '2:3', label: '2:3', desc: 'Portrait Poster' },
    { value: '9:16', label: '9:16', desc: 'Mobile Story' },
    { value: '21:9', label: '21:9', desc: 'Cinematic Ultrawide' },
  ];

  const imageSizes: { value: ImageSizeOption; label: string; desc: string }[] = [
    { value: '1K', label: '1K Standard', desc: 'Fast & clean (1024px)' },
    { value: '2K', label: '2K High Res', desc: 'Sharper study print (2048px)' },
    { value: '4K', label: '4K Ultra Studio', desc: 'Maximum fidelity (4096px)' },
  ];

  const presetPrompts = [
    "Physics classical mechanics pendulum oscillation, vector diagram, sleek blue scientific style",
    "Multivariable calculus 3D geometric manifold surface, gradient contours, minimalist educational aesthetic",
    "Computer Science binary search tree traversal diagram, clean nodes and modern lines",
    "Modern literature concept vintage typewriter with subtle warm golden lighting",
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setAppliedSuccess(false);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          imageSize,
          model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study visual.');
      }

      setGeneratedResult({
        imageUrl: data.imageUrl,
        text: data.text,
      });

      // Save to study context
      const newImg: GeneratedStudyImage = {
        id: `img-${Date.now()}`,
        prompt: prompt.trim(),
        imageUrl: data.imageUrl,
        aspectRatio,
        imageSize,
        model,
        createdAt: new Date().toISOString(),
        subjectId: targetSubjectId || undefined,
      };
      saveGeneratedImage(newImg);

    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Error occurred while contacting Gemini image service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyAsCover = () => {
    if (!generatedResult || !targetSubjectId) return;
    setSubjectCover(targetSubjectId, generatedResult.imageUrl);
    setAppliedSuccess(true);
    setTimeout(() => {
      closeImageGenModal();
    }, 1200);
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const link = document.createElement('a');
    link.href = generatedResult.imageUrl;
    link.download = `studyflow-${aspectRatio.replace(':', 'x')}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                AI Study Visual & Cover Generator
              </h2>
              <p className="text-xs text-slate-500">
                Powered by Gemini • Configurable aspect ratios & resolutions
              </p>
            </div>
          </div>
          <button
            onClick={closeImageGenModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <strong className="block font-bold">Generation Notice:</strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Prompt Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Visual Concept Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your subject visual (e.g., Physics thermodynamics heat engine schematic, clean educational diagram)"
                rows={3}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
              {/* Preset prompt pills */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 self-center">Try:</span>
                {presetPrompts.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="text-[10px] px-2 py-1 rounded-md bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 transition-colors truncate max-w-[200px]"
                    title={preset}
                  >
                    {preset.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Affordance (Prompt requirement) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Aspect Ratio (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      aspectRatio === ratio.value
                        ? 'border-purple-600 bg-purple-50/80 text-purple-900 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs font-mono">{ratio.label}</span>
                      {aspectRatio === ratio.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{ratio.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Size / Resolution Affordance (Prompt requirement) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Image Resolution (1K, 2K, 4K)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {imageSizes.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setImageSize(size.value)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      imageSize === size.value
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{size.label}</span>
                      {imageSize === size.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{size.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Model Quality Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  AI Model Quality
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as ImageModelOption)}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:outline-none text-slate-800"
                >
                  <option value="gemini-3.1-flash-image-preview">
                    Gemini 3.1 Flash Image (Fast & General)
                  </option>
                  <option value="gemini-3-pro-image-preview">
                    Gemini 3 Pro Image (Studio Quality)
                  </option>
                </select>
              </div>

              {/* Associate with Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Associate with Subject (Optional)
                </label>
                <select
                  value={targetSubjectId}
                  onChange={(e) => setTargetSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-purple-500 focus:outline-none text-slate-800"
                >
                  <option value="">None (Freeform Study Aid)</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code || 'Course'})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-md shadow-purple-500/20 transition-all active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Image with {model.includes('pro') ? 'Studio Model' : 'Flash'}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Visual Asset ({aspectRatio} • {imageSize})</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Generated Image Preview
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {aspectRatio} • {imageSize}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center max-h-80">
                <img
                  src={generatedResult.imageUrl}
                  alt="Generated study visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-80 object-contain rounded-xl"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>

                {targetSubjectId && (
                  <button
                    onClick={handleApplyAsCover}
                    disabled={appliedSuccess}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    {appliedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Applied as Subject Cover!</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Set as {subjects.find(s => s.id === targetSubjectId)?.name} Cover</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
