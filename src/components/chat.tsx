"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { BorderBeam } from "@/components/ui/border-beam"
import { TextAnimate } from "@/components/ui/text-animate"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      let assistantMessage = ""
      const assistantId = (Date.now() + 1).toString()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk
        
        setMessages((prev) => {
          const newMessages = prev.filter((m) => m.id !== assistantId)
          return [
            ...newMessages,
            {
              id: assistantId,
              role: "assistant",
              content: assistantMessage,
            },
          ]
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-emerald-800/50 overflow-hidden bg-gray-900">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700 p-3 md:p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Asistente Agrícola</h2>
            <p className="text-sm text-emerald-100">{isLoading ? "Escribiendo..." : "En línea"}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="h-[calc(100vh-400px)] min-h-[300px] max-h-[500px] bg-gray-900">
        <div className="p-3 md:p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="p-3 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-full mb-3">
                <Sparkles className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">¡Bienvenido a Raxibot!</h3>
              <p className="text-gray-400 max-w-md text-sm leading-normal">
                Pregúntame sobre cultivos, semillas, suelos y agricultura.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500",
                message.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              {/* Avatar */}
              <Avatar
                className={cn(
                  "w-10 h-10 border-2",
                  message.role === "user"
                    ? "border-blue-500 bg-blue-900"
                    : "border-emerald-500 bg-emerald-900",
                )}
              >
                <AvatarFallback>
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Bot className="w-5 h-5 text-emerald-400" />
                  )}
                </AvatarFallback>
              </Avatar>

              {/* Message Bubble */}
              <div
                className={cn(
                  "flex flex-col gap-1 max-w-[80%] md:max-w-[70%]",
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <span className="text-xs font-medium text-gray-400 px-1">
                  {message.role === "user" ? "Tú" : "Raxibot"}
                </span>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm",
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-sm"
                      : "bg-gradient-to-br from-gray-800 to-gray-800 text-gray-100 border border-emerald-700/50 rounded-tl-sm",
                  )}
                >
                  {message.role === "assistant" ? (
                    <TextAnimate
                      animation="fadeIn"
                      by="word"
                      duration={0.5}
                      className="text-sm leading-relaxed"
                      segmentClassName="inline-block"
                      once
                    >
                      {message.content}
                    </TextAnimate>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <Avatar className="w-10 h-10 border-2 border-emerald-500 bg-emerald-900">
                <AvatarFallback>
                  <Bot className="w-5 h-5 text-emerald-400" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 bg-gradient-to-br from-gray-800 to-gray-800 border border-emerald-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span className="text-sm text-gray-300">Pensando...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">
                Error: {error}
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-emerald-800 bg-gray-800/50 p-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta sobre agricultura..."
              disabled={isLoading}
              className="w-full bg-gray-900 text-gray-100 border-emerald-800 focus-visible:ring-emerald-500 disabled:opacity-50 placeholder:text-gray-500"
            />
            {input && (
              <BorderBeam
                size={90}
                duration={8}
                delay={0}
                colorFrom="#10b981"
                colorTo="#34d399"
                borderWidth={2}
                borderRadius={8}
              />
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </form>
        <p className="text-xs text-gray-500 text-center mt-2">
          Raxibot puede cometer errores. Verifica información importante.
        </p>
      </div>
    </Card>
  )
}
