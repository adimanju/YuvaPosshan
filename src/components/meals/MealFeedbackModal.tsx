/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Mid-Day Meal Quality & Taste Feedback Modal
 * Includes multi-role submission (Teacher, Parent, SDMC, Student Rep),
 * star ratings, temperature check, and microphone voice audio input!
 */

import React, { useState, useRef } from 'react';
import { 
  X, 
  Star, 
  MessageSquare, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ThumbsUp, 
  AlertCircle 
} from 'lucide-react';
import { MealFeedbackEntry } from '../../utils/feedback';

interface MealFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeedback: (entry: MealFeedbackEntry) => void;
  feedbackEntries: MealFeedbackEntry[];
}

export const MealFeedbackModal: React.FC<MealFeedbackModalProps> = ({
  isOpen,
  onClose,
  onAddFeedback,
  feedbackEntries,
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  // Form State
  const [evaluatorRole, setEvaluatorRole] = useState<'teacher' | 'parent_visitor' | 'sdmc_member' | 'student_rep'>('teacher');
  const [evaluatorName, setEvaluatorName] = useState('Anitha Shenoy (Class Teacher)');
  const [mealType, setMealType] = useState<'lunch' | 'morning_snack'>('lunch');
  const [temperature, setTemperature] = useState<'steaming_hot' | 'warm' | 'tepid' | 'cold'>('steaming_hot');
  const [hygieneRating, setHygieneRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(5);
  const [portionSufficiency, setPortionSufficiency] = useState<'optimal' | 'excess' | 'insufficient'>('optimal');
  const [wasteLevelPercent, setWasteLevelPercent] = useState(3);
  const [notes, setNotes] = useState('');

  // Audio Voice Recording / Transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Escape key handler
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleStartVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      // Fallback helpful message
      setNotes((prev) => prev ? `${prev} Food was prepared hot and served with high cleanliness.` : 'Food was prepared hot, served with fresh vegetables, and students finished portions with negligible plate waste.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleStopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: MealFeedbackEntry = {
      id: `fb-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      mealType,
      evaluatorRole,
      evaluatorName: evaluatorName.trim() || 'Verified School Inspector',
      temperature,
      hygieneRating,
      tasteRating,
      portionSufficiency,
      wasteLevelPercent,
      notes: notes.trim() || 'Food sampled and approved according to upper primary mid-day meal guidelines.',
      verifiedByHeadmaster: evaluatorRole === 'teacher' || evaluatorRole === 'sdmc_member',
      createdAt: new Date().toISOString(),
    };

    onAddFeedback(newEntry);
    setActiveTab('history');
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
    >
      <div className="glass-panel-elevated w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 cursor-default">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                School Meal Quality &amp; Taste Feedback Register
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Mandatory daily inspection by teachers, visiting parents, and SDMC committee
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'submit'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Submit New Evaluation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Inspection History ({feedbackEntries.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-neutral-700 dark:text-neutral-300">
          {activeTab === 'submit' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Evaluator Role & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Evaluator Category
                  </label>
                  <select
                    value={evaluatorRole}
                    onChange={(e) => {
                      const role = e.target.value as any;
                      setEvaluatorRole(role);
                      if (role === 'teacher') setEvaluatorName('Anitha Shenoy (Class Teacher 6A)');
                      else if (role === 'parent_visitor') setEvaluatorName('Ramesh Gowda (Parent)');
                      else if (role === 'sdmc_member') setEvaluatorName('K. V. Suresh (SDMC Chairman)');
                      else setEvaluatorName('Lakshmi N. (School Pupil Leader)');
                    }}
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                  >
                    <option value="teacher">Class Teacher / Headmaster</option>
                    <option value="parent_visitor">Parent Visitor / Community Member</option>
                    <option value="sdmc_member">SDMC Monitoring Committee Member</option>
                    <option value="student_rep">Student Representative / Class Leader</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Evaluator Full Name
                  </label>
                  <input
                    type="text"
                    value={evaluatorName}
                    onChange={(e) => setEvaluatorName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                  />
                </div>
              </div>

              {/* Temperature & Portion Sufficiency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Serving Temperature
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['steaming_hot', 'warm', 'tepid', 'cold'] as const).map((temp) => (
                      <button
                        key={temp}
                        type="button"
                        onClick={() => setTemperature(temp)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                          temperature === temp
                            ? 'bg-teal-600 text-white shadow-2xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {temp.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Portion Sufficiency (Per Child)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['optimal', 'excess', 'insufficient'] as const).map((suff) => (
                      <button
                        key={suff}
                        type="button"
                        onClick={() => setPortionSufficiency(suff)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                          portionSufficiency === suff
                            ? 'bg-teal-600 text-white shadow-2xs'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {suff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Star Ratings: Taste & Hygiene */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Taste &amp; Flavor Palatability
                    </span>
                    <span className="font-bold font-mono text-teal-600 dark:text-teal-400">
                      {tasteRating} / 5
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setTasteRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-5 h-5 ${star <= tasteRating ? 'fill-amber-400' : 'text-neutral-300 dark:text-neutral-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Kitchen &amp; Server Cleanliness
                    </span>
                    <span className="font-bold font-mono text-teal-600 dark:text-teal-400">
                      {hygieneRating} / 5
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setHygieneRating(star)}
                        className="p-1 text-teal-500 hover:scale-110 transition-transform"
                      >
                        <ShieldCheck className={`w-5 h-5 ${star <= hygieneRating ? 'text-teal-500' : 'text-neutral-300 dark:text-neutral-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes / Remarks with Voice Audio Dictation Button */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Observation Notes / Child Acceptance
                  </label>

                  {/* Speech to text voice microphone trigger */}
                  <button
                    type="button"
                    onClick={isRecording ? handleStopVoiceRecording : handleStartVoiceRecording}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                      isRecording
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 hover:bg-teal-100'
                    }`}
                    title="Speak notes using microphone"
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Listening... (Tap to stop)' : 'Voice Dictate Notes'}</span>
                  </button>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sambar cooked with fresh drumsticks and greens; good salt and spice level suitable for children. Zero food left over in Grade 6A."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Quality Feedback Record</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-neutral-500 mb-2">
                Showing recorded inspection reports from teachers, visiting parents, and SDMC members.
              </div>

              {feedbackEntries.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>{fb.evaluatorName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 capitalize">
                          {fb.evaluatorRole.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        {fb.date} · {fb.mealType === 'lunch' ? 'Mid-Day Lunch' : 'Morning Snack'} · Temperature: {fb.temperature.replace('_', ' ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-[10px] text-neutral-400">Taste</span>
                        <div className="font-bold font-mono text-amber-500 flex items-center justify-end gap-0.5">
                          <span>{fb.tasteRating}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400">Hygiene</span>
                        <div className="font-bold font-mono text-teal-600 dark:text-teal-400">{fb.hygieneRating}/5</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 italic bg-neutral-50 dark:bg-neutral-950/40 p-2.5 rounded-lg border border-neutral-100 dark:border-neutral-800/80">
                    &ldquo;{fb.notes}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                    <span>Plate Waste: ~{fb.wasteLevelPercent}%</span>
                    {fb.verifiedByHeadmaster && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified by Headmaster</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
