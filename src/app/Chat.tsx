"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export const Chat = () => {
    const {messages, status, sendMessage} = useChat();
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
        }
    };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map(message => (
                <div key={message.id} className={`p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-100 dark:bg-blue-900 ml-auto max-w-xs' : 'bg-gray-100 dark:bg-gray-700 mr-auto max-w-xs'}`}>
                    <div className="font-semibold text-sm mb-1">
                        {message.role === 'user' ? 'You' : 'AI'}
                    </div>
                    {message.parts.map((part, index) => {
                        if (part.type === 'text') {
                            return <span key={index} className="text-sm">{part.text}</span>;
                        }
                        return null;
                    })}
                </div>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                disabled={status !== 'ready'}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={status !== 'ready' || !input.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
                Enviar
            </button>
        </form>
    </div>
  )
}

