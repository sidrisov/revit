import React, { useRef, useState } from 'react';
import { z } from 'zod';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import StatusBadge from '../components/StatusBadge';
import { toast } from 'sonner';
import {
  Mic,
  MicOff,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Send,
} from 'lucide-react';

const schema = z.object({
  title: z.string().min(5, 'Title required'),
  description: z.string().min(10, 'Description required'),
  deposit: z.number().min(1, 'Deposit required'),
});

type FormData = z.infer<typeof schema>;

const defaultQuestions = [
  'What is the main goal of this request?',
  'What specific aspects need feedback?',
  "What's your target audience?",
];

const CreateRequest: React.FC = () => {
  const [form, setForm] = useState<{
    title: string;
    description: string;
    deposit: string;
  }>({ title: '', description: '', deposit: '' });
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    deposit?: string;
  }>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>(defaultQuestions);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [questionInput, setQuestionInput] = useState('');
  const [success, setSuccess] = useState(false);
  const audioChunks = useRef<Blob[]>([]);
  const requests = useStore((s) => s.requests);
  const setRequests = useStore((s) => s.setRequests);

  // Audio recording logic
  const startRecording = async () => {
    setRecording(true);
    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new window.MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      stream.getTracks().forEach((t) => t.stop());
    };
    setMediaRecorder(recorder);
    recorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorder?.stop();
  };

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleGenerate = () => {
    const parsedDeposit = Number(form.deposit);
    const result = schema.safeParse({ ...form, deposit: parsedDeposit });
    if (!result.success) {
      const fieldErrors: {
        title?: string;
        description?: string;
        deposit?: string;
      } = {};
      (
        result.error.issues as Array<{
          path: (string | number)[];
          message: string;
        }>
      ).forEach((err) => {
        if (err.path[0] === 'title') fieldErrors.title = err.message;
        if (err.path[0] === 'description')
          fieldErrors.description = err.message;
        if (err.path[0] === 'deposit') fieldErrors.deposit = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setShowQuestions(true);
  };

  // Questionnaire editing
  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setQuestionInput(questions[idx]);
  };
  const handleDelete = (idx: number) => {
    setQuestions((q) => q.filter((_, i) => i !== idx));
  };
  const handleSaveEdit = () => {
    if (editingIndex === null || !questionInput.trim()) return;
    setQuestions((q) =>
      q.map((item, i) => (i === editingIndex ? questionInput : item))
    );
    setEditingIndex(null);
    setQuestionInput('');
  };
  const handleAdd = () => {
    if (!questionInput.trim()) return;
    setQuestions((q) => [...q, questionInput]);
    setQuestionInput('');
  };

  // Publish/save
  const handlePublish = () => {
    const parsedDeposit = Number(form.deposit);
    const result = schema.safeParse({ ...form, deposit: parsedDeposit });
    if (!result.success) {
      const fieldErrors: {
        title?: string;
        description?: string;
        deposit?: string;
      } = {};
      (
        result.error.issues as Array<{
          path: (string | number)[];
          message: string;
        }>
      ).forEach((err) => {
        if (err.path[0] === 'title') fieldErrors.title = err.message;
        if (err.path[0] === 'description')
          fieldErrors.description = err.message;
        if (err.path[0] === 'deposit') fieldErrors.deposit = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (questions.length === 0) {
      setErrors((e) => ({ ...e, questions: 'At least one question required' }));
      return;
    }
    setErrors({});
    setRequests([
      {
        id: (requests.length + 1).toString(),
        title: form.title,
        description: form.description,
        audioUrl: audioUrl || '',
        questions: [...questions],
        creator: 'demoUser',
        reward: parsedDeposit,
        responses: [],
        status: 'active',
      },
      ...requests,
    ]);
    setSuccess(true);
    setForm({ title: '', description: '', deposit: '' });
    setAudioUrl(null);
    setQuestions(defaultQuestions);
    setShowQuestions(false);
    toast.success('Request published!', {
      description: 'Your feedback request is now live.',
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Hero Section */}
      <header className="text-center mb-8 sm:mb-12">
        <div
          className="relative inline-block mb-6"
          role="presentation"
          aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur-lg opacity-70 animate-pulse"></div>
          <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500 group">
            <Mic
              className="w-10 h-10 sm:w-12 sm:h-12 text-white group-hover:animate-bounce"
              aria-hidden="true"
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6 animate-fade-in">
          Create Magic ✨
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 font-medium px-4 leading-relaxed max-w-lg mx-auto">
          Turn your brilliant ideas into even more brilliant ideas with feedback
          from passionate creators who get it 🚀
        </p>

        {/* Progress Steps */}
        <nav
          aria-label="Form progress"
          className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
          {[
            { emoji: '📝', label: 'Fill Details', active: true },
            { emoji: '🎤', label: 'Record Audio', active: !!audioUrl },
            { emoji: '🤖', label: 'AI Questions', active: showQuestions },
            { emoji: '🚀', label: 'Publish', active: success },
          ].map((step, index) => {
            const isCompleted =
              step.active ||
              (index === 0 && form.title && form.description && form.deposit);
            const isCurrent =
              (index === 0 && !showQuestions) ||
              (index === 1 &&
                form.title &&
                form.description &&
                form.deposit &&
                !showQuestions) ||
              (index === 2 && showQuestions && !success) ||
              (index === 3 && success);

            return (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base transition-all duration-500 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-lg scale-110 animate-pulse'
                      : isCurrent
                      ? 'bg-purple-500 text-white shadow-lg scale-110 animate-bounce'
                      : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                  }`}
                  role="img"
                  aria-label={`Step ${index + 1}: ${step.label} - ${
                    isCompleted
                      ? 'Completed'
                      : isCurrent
                      ? 'Current step'
                      : 'Not started'
                  }`}>
                  <span aria-hidden="true">{step.emoji}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`w-8 sm:w-12 h-0.5 mx-1 transition-all duration-500 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                    role="presentation"
                    aria-hidden="true"></div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="text-xs sm:text-sm mt-2 font-medium text-center">
          {!showQuestions && !success && (
            <p className="text-purple-600">
              Share your vision and let the magic begin! ✨
            </p>
          )}
          {showQuestions && !success && (
            <p className="text-amber-600">
              Your AI questions are ready! Review and publish when you're happy
              🤖
            </p>
          )}
          {success && (
            <p className="text-emerald-600">
              🎉 Amazing! Your request is live and ready for brilliant feedback!
              🎉
            </p>
          )}
        </div>
      </header>

      {/* Main Form */}
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl blur-xl opacity-50"></div>
        <form
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-200/50"
          aria-label="Create feedback request form">
          {success && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 text-green-800 p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8 shadow-lg animate-bounce">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg">
                    Amazing! Your request is live! 🎉
                  </h3>
                  <p className="text-sm sm:text-base text-green-700 font-medium">
                    People can now discover and respond to your request
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-6 sm:space-y-8">
            <div className="group">
              <label className="block mb-2 sm:mb-3 font-black text-slate-800 text-lg sm:text-xl transform group-hover:scale-105 transition-transform duration-200 origin-left">
                📝 Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="project-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="h-12 sm:h-14 text-base sm:text-lg border-4 border-emerald-200 rounded-xl sm:rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-emerald-50 font-semibold transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:bg-emerald-100/50 focus:transform focus:scale-[1.02]"
                  placeholder="What amazing thing do you need feedback on? ✨"
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  aria-invalid={!!errors.title}
                  required
                />
                {form.title && (
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 animate-bounce"
                    aria-hidden="true">
                    ✨
                  </div>
                )}
              </div>
              {errors.title && (
                <div
                  id="title-error"
                  className="text-red-600 text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-100 p-2 sm:p-3 rounded-xl font-bold border-2 border-red-300 animate-shake"
                  role="alert"
                  aria-live="polite">
                  <span
                    className="text-base sm:text-lg animate-pulse"
                    aria-hidden="true">
                    ⚠️
                  </span>
                  {errors.title}
                </div>
              )}
            </div>

            <div className="group">
              <label className="block mb-2 sm:mb-3 font-black text-slate-800 text-lg sm:text-xl transform group-hover:scale-105 transition-transform duration-200 origin-left">
                📄 Description <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="project-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full min-h-[120px] sm:min-h-[140px] p-3 sm:p-4 border-4 border-emerald-200 rounded-xl sm:rounded-2xl text-base sm:text-lg focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 resize-vertical bg-emerald-50 font-semibold transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:bg-emerald-100/50 focus:transform focus:scale-[1.02]"
                  placeholder="Tell us about your request! What makes it special? What feedback would make it even better? 🚀"
                  aria-describedby={`description-helper ${
                    errors.description ? 'description-error' : ''
                  }`}
                  aria-invalid={!!errors.description}
                  required
                />
                {form.description && form.description.length > 50 && (
                  <div
                    className="absolute right-3 bottom-3 text-emerald-500 animate-pulse"
                    aria-hidden="true">
                    💡
                  </div>
                )}
              </div>
              {form.description && (
                <div
                  id="description-helper"
                  className="text-xs text-emerald-600 mt-1 flex items-center gap-1"
                  aria-live="polite">
                  <span
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                    aria-hidden="true"></span>
                  {form.description.length >= 100
                    ? `${form.description.length} characters - Great detail! 🎯`
                    : form.description.length >= 50
                    ? `${form.description.length} characters - Looking good! 👍`
                    : `${form.description.length} characters`}
                </div>
              )}
              {errors.description && (
                <div
                  id="description-error"
                  className="text-red-600 text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-100 p-2 sm:p-3 rounded-xl font-bold border-2 border-red-300 animate-shake"
                  role="alert"
                  aria-live="polite">
                  <span
                    className="text-base sm:text-lg animate-pulse"
                    aria-hidden="true">
                    ⚠️
                  </span>
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          <fieldset className="mt-8 sm:mt-10 group">
            <legend className="block mb-3 sm:mb-4 font-black text-slate-800 text-lg sm:text-xl transform group-hover:scale-105 transition-transform duration-200 origin-left">
              🎤 Audio Brief (Optional)
            </legend>
            <div
              className="bg-blue-50 border-4 border-dashed border-blue-300 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center hover:border-blue-400 transition-all duration-500 hover:bg-blue-100 hover:shadow-lg transform hover:scale-[1.02]"
              role="region"
              aria-labelledby="audio-section">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-full mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300 shadow-lg ${
                  recording ? 'animate-pulse bg-red-500 shadow-red-200' : ''
                }`}
                aria-hidden="true">
                {recording ? (
                  <MicOff className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                )}
              </div>
              {recording && (
                <div className="mb-4 sm:mb-6" role="status" aria-live="polite">
                  <div
                    className="flex justify-center items-center gap-1 mb-2"
                    aria-hidden="true">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}></div>
                    <div
                      className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-red-600 font-bold text-sm">
                    Recording in progress...
                  </p>
                </div>
              )}
              <div className="space-y-3 sm:space-y-4">
                {!recording && !audioUrl && (
                  <Button
                    type="button"
                    onClick={startRecording}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 hover:transform hover:scale-105 shadow-xl text-base sm:text-lg group-hover:animate-pulse"
                    aria-label="Start audio recording">
                    <Mic
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                      aria-hidden="true"
                    />
                    🎙️ Start Recording
                  </Button>
                )}
                {recording && (
                  <Button
                    type="button"
                    onClick={stopRecording}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 animate-bounce shadow-xl text-base sm:text-lg ring-4 ring-red-200"
                    aria-label="Stop audio recording">
                    <MicOff
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3"
                      aria-hidden="true"
                    />
                    ⏹️ Stop Recording
                  </Button>
                )}
                {audioUrl && (
                  <div className="space-y-3 sm:space-y-4 animate-fade-in">
                    <div
                      className="text-green-600 font-bold flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg animate-bounce"
                      role="status"
                      aria-live="polite">
                      <CheckCircle
                        className="w-5 h-5 sm:w-6 sm:h-6 animate-spin"
                        aria-hidden="true"
                      />
                      🎉 Recording saved!
                    </div>
                    <audio
                      src={audioUrl}
                      controls
                      className="mx-auto rounded-xl sm:rounded-2xl shadow-lg w-full max-w-sm transition-all duration-300 hover:shadow-xl"
                      aria-label="Audio brief recording playback"
                    />
                    <p className="text-blue-600 text-sm font-medium">
                      Fantastic! Your voice adds that personal touch that makes
                      feedback so much better! 🎤✨
                    </p>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <div className="mt-8 sm:mt-10 group">
            <label className="block mb-2 sm:mb-3 font-black text-slate-800 text-lg sm:text-xl transform group-hover:scale-105 transition-transform duration-200 origin-left">
              💰 Reward Amount ($) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Minimum $1 • Higher rewards attract more responses
            </p>
            <div className="relative">
              <Input
                id="reward-amount"
                name="deposit"
                type="number"
                min="1"
                step="1"
                value={form.deposit}
                onChange={handleChange}
                className="h-12 sm:h-14 text-base sm:text-lg border-4 border-emerald-200 rounded-xl sm:rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 bg-emerald-50 font-semibold transition-all duration-300 hover:shadow-lg hover:border-emerald-300 hover:bg-emerald-100/50 focus:transform focus:scale-[1.02]"
                placeholder="What's great feedback worth to you? 💎"
                aria-describedby={`deposit-helper ${
                  errors.deposit ? 'deposit-error' : ''
                }`}
                aria-invalid={!!errors.deposit}
                required
              />
              {form.deposit && Number(form.deposit) > 0 && (
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500 animate-bounce"
                  aria-hidden="true">
                  💎
                </div>
              )}
            </div>
            {form.deposit && Number(form.deposit) > 0 && (
              <div
                id="deposit-helper"
                className="text-xs text-emerald-600 mt-1 flex items-center gap-1"
                aria-live="polite">
                <span
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
                  aria-hidden="true"></span>
                {Number(form.deposit) >= 50
                  ? 'Wow! Premium feedback incoming! 🔥'
                  : Number(form.deposit) >= 20
                  ? 'Nice! This will attract great reviewers! 💫'
                  : 'Perfect! Every request deserves thoughtful feedback! ✨'}
              </div>
            )}
            {errors.deposit && (
              <div
                id="deposit-error"
                className="text-red-600 text-sm mt-2 sm:mt-3 flex items-center gap-2 bg-red-100 p-2 sm:p-3 rounded-xl font-bold border-2 border-red-300 animate-shake"
                role="alert"
                aria-live="polite">
                <span
                  className="text-base sm:text-lg animate-pulse"
                  aria-hidden="true">
                  ⚠️
                </span>
                {errors.deposit}
              </div>
            )}
          </div>

          {/* Dynamic CTA Button */}
          {(() => {
            const hasRequiredFields =
              form.title && form.description && form.deposit;
            const isFormValid =
              form.title.length >= 5 &&
              form.description.length >= 10 &&
              Number(form.deposit) >= 1;

            if (!hasRequiredFields) {
              return (
                <div className="w-full mt-8 sm:mt-10 bg-slate-200 text-slate-500 py-4 sm:py-5 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 cursor-not-allowed">
                  <span className="animate-pulse">🎨</span>
                  Fill in the magic details above to unlock AI power!
                  <span className="animate-pulse">✨</span>
                </div>
              );
            }

            if (!isFormValid) {
              return (
                <div className="w-full mt-8 sm:mt-10 bg-amber-200 text-amber-700 py-4 sm:py-5 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 cursor-not-allowed">
                  <span className="animate-bounce">🧙‍♂️</span>
                  Just a few tweaks needed to cast the perfect spell!
                  <span className="animate-bounce">✨</span>
                </div>
              );
            }

            return (
              <Button
                type="button"
                onClick={handleGenerate}
                className="w-full mt-8 sm:mt-10 bg-purple-500 hover:bg-purple-600 text-white py-4 sm:py-5 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl transition-all duration-300 hover:transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-purple-200 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-spin" />
                  ✨ Generate AI Questions ✨
                  <Sparkles
                    className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:animate-spin"
                    style={{ animationDelay: '0.5s' }}
                  />
                </div>
              </Button>
            );
          })()}
          {showQuestions && (
            <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 animate-fade-in transform translate-y-0 opacity-100 transition-all duration-500">
              <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl animate-pulse">
                  <Sparkles className="w-5 h-5 text-white animate-spin" />
                </div>
                AI-Generated Questions
              </h4>
              <div className="space-y-4 mb-6">
                {questions.map((q, i) => (
                  <div
                    key={i}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-[1.02] group animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}>
                    {editingIndex === i ? (
                      <div className="flex gap-3 items-center">
                        <Input
                          value={questionInput}
                          onChange={(e) => setQuestionInput(e.target.value)}
                          className="flex-1 border-slate-200 rounded-xl bg-white/50 focus:ring-4 focus:ring-amber-100 focus:border-amber-300 transition-all duration-300"
                        />
                        <Button
                          type="button"
                          onClick={handleSaveEdit}
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-110">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setEditingIndex(null)}
                          className="bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-110">
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-3 items-center justify-between">
                        <span className="text-slate-700 font-medium flex-1 group-hover:text-slate-800 transition-colors">
                          {i + 1}. {q}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            type="button"
                            onClick={() => handleEdit(i)}
                            className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white px-3 py-1 text-sm rounded-lg transition-all duration-300 hover:scale-110">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => handleDelete(i)}
                            className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-3 py-1 text-sm rounded-lg transition-all duration-300 hover:scale-110">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 items-center">
                <Input
                  value={editingIndex === null ? questionInput : ''}
                  onChange={(e) =>
                    editingIndex === null && setQuestionInput(e.target.value)
                  }
                  placeholder="Add a custom question..."
                  className="flex-1 border-slate-200 rounded-xl h-12 bg-white/50 focus:ring-4 focus:ring-amber-100 focus:border-amber-300 transition-all duration-300 hover:shadow-md"
                />
                <Button
                  type="button"
                  onClick={handleAdd}
                  disabled={editingIndex !== null}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          )}
          {showQuestions && (
            <div className="mt-8 space-y-6">
              {/* Publish Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Ready to Publish
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Title:</span>
                    <span className="font-semibold text-slate-800 max-w-xs truncate">
                      {form.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Reward:</span>
                    <span className="font-bold text-emerald-600">
                      ${form.deposit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Questions:</span>
                    <span className="font-semibold text-slate-800">
                      {questions.length} generated
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Audio:</span>
                    <span className="font-semibold text-slate-800">
                      {audioUrl ? '✅ Included' : '⭕ Optional'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white/50 rounded-xl border border-emerald-200/50">
                  <p className="text-xs text-emerald-700 font-medium">
                    🌟 Ready to launch! Your request will be discovered by
                    amazing creators who'll give you thoughtful feedback for $
                    {form.deposit} each.
                  </p>
                </div>
              </div>

              {/* Final Publish Button */}
              <Button
                type="button"
                onClick={handlePublish}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-4 sm:py-5 text-lg sm:text-xl font-black rounded-2xl sm:rounded-3xl transition-all duration-300 hover:transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-emerald-200 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                  🚀 Publish My Request 🚀
                  <Send
                    className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </Button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default CreateRequest;
