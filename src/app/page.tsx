import { Chat } from "@/components/chat"
import { Sprout } from "lucide-react"
import { MeteorsBackground } from "@/components/meteors-background"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      <MeteorsBackground />
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Raxibot
            </h1>
          </div>
          <p className="text-center text-gray-400 max-w-2xl text-sm leading-normal">
            Tu asistente agrícola inteligente. Pregúntame sobre cultivos, semillas, suelos y mejores prácticas
            agrícolas.
          </p>
        </div>

        <Chat />
      </div>
    </main>
  )
}