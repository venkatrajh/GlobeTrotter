import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiApi } from '../../api/ai';
import { useTrips } from '../../context/TripContext';
import {
  Sparkles,
  Send,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';

export const AICopilotChat = () => {
  const { activeTrip } = useTrips();
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello Traveler! I'm your trip-aware copilot. I'm actively tracking your itinerary for ${activeTrip?.title || 'Japan Adventure'}. How can I optimize your route or activities today?`,
      timestamp: '10:00 AM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    { label: 'Make today cheaper', prompt: 'How can I make today cheaper?' },
    { label: 'I only have 4 hours', prompt: 'I only have 4 hours this afternoon.' },
    { label: 'What if it rains?', prompt: 'What if it rains during our outdoor stops?' },
    { label: 'Add more food experiences', prompt: 'Add top rated local food experiences.' }
  ];

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputValue;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiApi.askCopilot(activeTrip?.id, textToSend);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        card: response.card,
        type: response.type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left h-full">
      {/* LEFT SIDE: Current Trip Context with Liquid Glass */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="glass-secondary rounded-3xl p-6 sm:p-8 shadow-md border">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-400">
            ACTIVE TRIP CONTEXT
          </span>
          <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 mt-1 mb-4 uppercase">
            DAY 03 — KYOTO
          </h3>

          <div className="space-y-3 pb-6 border-b border-zinc-200/50 dark:border-zinc-800">
            <div className="flex items-center gap-3 p-3 rounded-2xl glass-secondary border text-xs font-bold shadow-xs">
              <span>☀️</span>
              <span className="text-zinc-950 dark:text-zinc-50">09:00 AM • Fushimi Inari Torii</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl glass-secondary border text-xs font-bold shadow-xs">
              <span>🌤️</span>
              <span className="text-zinc-950 dark:text-zinc-50">01:30 PM • Nishiki Market Food</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl glass-secondary border text-xs font-bold shadow-xs">
              <span>🌙</span>
              <span className="text-zinc-950 dark:text-zinc-50">07:00 PM • Gion Lantern Walk</span>
            </div>
          </div>

          <div className="pt-5 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Budget Today:
            </span>
            <span className="text-base font-black text-zinc-950 dark:text-zinc-50">
              ₹12,400
            </span>
          </div>
        </div>

        {/* Quick Prompts Panel */}
        <div className="glass-secondary rounded-3xl p-6 shadow-md border">
          <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-400 block mb-3">
            SUGGESTED COPILOT ACTIONS
          </span>
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => handleSendMessage(action.prompt)}
                className="text-left px-3.5 py-2.5 rounded-2xl border glass-secondary hover:border-zinc-400 dark:hover:border-zinc-500 text-xs font-bold text-zinc-900 dark:text-zinc-100 transition-all flex items-center justify-between group shadow-xs"
              >
                <span>{action.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-zinc-100 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Copilot Interactive Chat with Liquid Glass */}
      <div className="lg:col-span-8 glass-primary rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl min-h-[550px] border">
        {/* Chat Header */}
        <div className="pb-4 border-b border-zinc-200/50 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold shadow-sm">
              ✦
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2 uppercase">
                TRIP COPILOT
              </h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Live & Aware of {activeTrip?.title || 'Current Trip'}
              </span>
            </div>
          </div>
          <Badge variant="success" size="sm">
            Copilot Online
          </Badge>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={clsx('flex gap-3', isAi ? 'justify-start' : 'justify-end')}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs">
                    ✦
                  </div>
                )}

                <div
                  className={clsx(
                    'max-w-xl rounded-2xl p-4 text-sm font-medium leading-relaxed shadow-sm',
                    isAi
                      ? 'glass-secondary text-zinc-950 dark:text-zinc-50 border'
                      : 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                  )}
                >
                  <p>{msg.text}</p>

                  {/* Structured AI Response Cards */}
                  {msg.card && (
                    <div className="mt-4 p-4 rounded-xl glass-secondary border text-zinc-950 dark:text-zinc-50 text-xs space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800 pb-2">
                        <span className="font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-50">
                          {msg.card.title}
                        </span>
                        {msg.card.savings && (
                          <Badge variant="success" size="sm">
                            {msg.card.savings}
                          </Badge>
                        )}
                      </div>

                      {msg.card.changes && (
                        <ul className="space-y-1.5 list-disc pl-4 text-zinc-700 dark:text-zinc-300">
                          {msg.card.changes.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      )}

                      {msg.card.items && (
                        <div className="space-y-1.5 text-zinc-800 dark:text-zinc-200">
                          {msg.card.items.map((it, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span>•</span>
                              <span>{it}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.card.replacement && (
                        <div className="space-y-1 text-zinc-800 dark:text-zinc-200">
                          <div className="line-through text-rose-500">{msg.card.original}</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ {msg.card.replacement}
                          </div>
                          {msg.card.note && <div className="text-[11px] text-zinc-500">{msg.card.note}</div>}
                        </div>
                      )}

                      {msg.card.actionLabel && (
                        <div className="pt-2">
                          <Button size="sm" variant="primary" className="text-xs font-bold w-full">
                            {msg.card.actionLabel}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  <span className="block text-[10px] text-zinc-400 mt-2 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-mono animate-pulse">
              <Sparkles className="w-4 h-4" /> Copilot is analyzing route & budget...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800 flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about your trip, weather, budget or route..."
            className="flex-1 glass-secondary border rounded-2xl px-4 py-3 text-sm text-zinc-950 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 shadow-xs"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            disabled={!inputValue.trim() || isTyping}
            className="rounded-2xl px-5 shadow-md"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};
