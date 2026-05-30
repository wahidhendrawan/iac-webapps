import { useState, useRef, useEffect } from 'react';
import { useTerraformStore } from '../store';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';
import type { ResourceType } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your IaC Copilot. How can I help you design your infrastructure today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { addResource } = useTerraformStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Processing
    setTimeout(() => {
      let response = "I'm not sure how to do that yet. Try asking me to add a specific resource like an AWS S3 bucket.";
      const lowerMsg = userMessage.toLowerCase();

      // Simple keyword matching for simulation
      const mappings: Record<string, { type: ResourceType; name: string }> = {
        's3': { type: 'aws_s3_bucket', name: 'S3 Bucket' },
        'aws instance': { type: 'aws_instance', name: 'EC2 Instance' },
        'ec2': { type: 'aws_instance', name: 'EC2 Instance' },
        'azure vm': { type: 'azurerm_virtual_machine', name: 'Azure VM' },
        'gcp instance': { type: 'google_compute_instance', name: 'GCP Instance' },
        'proxmox': { type: 'proxmox_vm_qemu', name: 'Proxmox VM' },
        'vpc module': { type: 'module', name: 'VPC Module' },
      };

      for (const [key, resource] of Object.entries(mappings)) {
        if (lowerMsg.includes(key)) {
          addResource(resource.type);
          response = `Sure! I've added a new ${resource.name} to your project. You can now see it in the sidebar and visual designer.`;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-40 flex items-center gap-2 group ${
          isOpen ? 'bg-indigo-600 scale-90' : 'bg-slate-900 dark:bg-indigo-600 hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
        {!isOpen && (
           <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-white font-bold whitespace-nowrap text-sm">
             Ask Copilot
           </span>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col z-40 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 transition-colors">
          {/* Header */}
          <div className="px-6 py-4 bg-indigo-600 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">IaC Copilot</h3>
            </div>
            <div className="flex items-center gap-1">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
               <span className="text-[10px] text-indigo-100 font-bold uppercase">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me to add a resource..."
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Copilot can add resources based on your requests.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
