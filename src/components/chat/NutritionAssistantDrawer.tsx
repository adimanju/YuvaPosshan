/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Poshan Sahayak (ಪೋಷಣ್ ಸಹಾಯಕ / போஷன் சகாயக்)
 * Multi-turn Gemini Nutrition & Growth Assistant for South Indian Schools
 * Answers ICMR-NIN guidelines, PM-POSHAN dietary norms, and parent queries.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  HelpCircle, 
  BookOpen,
  Info
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface NutritionAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionAssistantDrawer: React.FC<NutritionAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Namaskara! I am Poshan Sahayak, your school nutrition and child growth assistant. I can help with ICMR-NIN food composition tables, PM-POSHAN Upper Primary norms (700 kcal & 20g protein), seasonal South Indian millet menus, and answering parent questions. How may I assist you today?',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPrompts = [
    'What are Upper Primary lunch norms under PM-POSHAN?',
    'How can we boost dietary iron using moringa drumstick leaves?',
    'How do I explain an Underweight growth flag to parents calmly?',
    'Suggest a nutritious Ragi Mudde Thursday menu recipe.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize Gemini using @google/genai SDK
      const apiKey = process.env.GEMINI_API_KEY || (window as any).GEMINI_API_KEY || '';
      
      let replyText = '';

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are "Poshan Sahayak", a compassionate, culturally grounded South Indian school nutrition advisor and record-keeping assistant for Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, and Kerala government schools.
Guidelines:
1. Ground answers in ICMR-NIN (National Institute of Nutrition, Hyderabad) IFCT 2020 and PM-POSHAN Upper Primary guidelines (Grades 5-8: 700 kcal, 20g protein, 150g cereal, 30g pulses, 75g vegetables, iron-folic acid).
2. Clarify that school records reflect "food supplied per child", not food eaten.
3. State that all child growth calculations are non-diagnostic guideposts and must be reviewed by a registered medical officer or PHC pediatrician.
4. Keep answers concise, actionable for teachers with limited time, and respectful.
User query: ${text}`
                }
              ]
            }
          ]
        });
        replyText = response.text || 'I could not generate an answer right now.';
      } else {
        // High-quality deterministic South Indian nutrition knowledge base fallback
        if (text.toLowerCase().includes('upper primary') || text.toLowerCase().includes('norm')) {
          replyText = 'Under PM-POSHAN guidelines for Upper Primary (Grades 5 to 8):\n• Calories supplied: Minimum 700 kcal per child\n• Protein supplied: 20 grams per child\n• Foodgrain ration: 150 grams (rice or ragi/millets)\n• Pulses/dal: 30 grams\n• Vegetables: 75 grams\n• Oil & Fat: 7.5 grams\nNote: All values refer to raw ingredients and food supplied per child for record-keeping.';
        } else if (text.toLowerCase().includes('iron') || text.toLowerCase().includes('drumstick') || text.toLowerCase().includes('leaf')) {
          replyText = 'Fresh drumstick leaves (Moringa oleifera) are an exceptional source of bioavailable iron (approx. 5.4 mg iron per 100g, ICMR Code D015). To maximize iron absorption among students:\n1. Prepare Drumstick Leaf Poriyal / Keerai Kootu lightly sautéed with turmeric.\n2. Pair with lemon or tomato sambar rich in Vitamin C, which triples non-heme iron absorption.\n3. Avoid serving tea immediately before or after meals.';
        } else if (text.toLowerCase().includes('ragi') || text.toLowerCase().includes('millet') || text.toLowerCase().includes('menu')) {
          replyText = 'Recommended South Indian Millet Menu (Karnataka & Southern States):\n• Main: Ragi Mudde (140g) or Ragi Roti (approx. 230 kcal, 5.3g protein, 5.5mg iron)\n• Accompaniment: Sprouted Horsegram (Hurali) or Chana Dal Sambar with pumpkin and drumstick\n• Supplement: Boiled Egg or Sprouted Sundal (12g protein)\n• Beverage: Fresh spiced buttermilk with curry leaves for gut hydration.';
        } else if (text.toLowerCase().includes('parent') || text.toLowerCase().includes('underweight') || text.toLowerCase().includes('growth')) {
          replyText = 'Communication guide for teachers speaking with parents:\n1. Clarify immediately that school measurements are informational records, not a medical sickness diagnosis.\n2. Explain that children grow in spurts and reference bands merely suggest a routine review.\n3. Offer an introduction to the visiting Primary Health Centre (PHC) Rashtriya Bal Swasthya Karyakram (RBSK) medical officer on their next camp date.';
        } else {
          replyText = `Thank you for your question. Under ICMR-NIN dietary standards for South Indian school lunches, students in Grades 5–8 require a balance of cereal energy (rice/ragi), pulse proteins (toor dal/chana), and micro-nutrients from leafy greens. Let me know if you would like portion calculations, recipe suggestions, or growth indicator guidance.`;
        }
      }

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: 'Poshan Sahayak is currently running in local offline guidance mode. Upper primary standards require ~700 kcal and 20g protein per child. All growth indicators should be reviewed by a visiting PHC pediatrician.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput('What are the Upper Primary PM-POSHAN nutrition norms?');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/50 backdrop-blur-sm cursor-pointer"
    >
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200 cursor-default">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-teal-50/50 dark:bg-teal-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Poshan Sahayak</h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 font-mono">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">
                ICMR-NIN &amp; PM-POSHAN School Nutrition Advisor
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Bar */}
        <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Informational guidance only; not medical diagnosis. Consult PHC pediatrician.</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white text-[10px] font-bold ${
                  m.sender === 'user' ? 'bg-indigo-600' : 'bg-teal-600'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-line text-xs ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/60 dark:border-neutral-700/60'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-neutral-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-neutral-500 text-xs p-2">
              <Sparkles className="w-4 h-4 text-teal-500 animate-spin" />
              <span>Poshan Sahayak is referencing ICMR composition tables...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Chips */}
        <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950/40">
          <button
            type="button"
            onClick={handleStartVoice}
            className={`p-2 rounded-xl transition-colors ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'text-neutral-500 hover:text-teal-600 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
            title="Ask via voice microphone"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask about school meal calories, recipes, or growth..."
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
