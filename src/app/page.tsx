import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";
import { Chat } from "./Chat";

export default async function Home() {
  const {object} = await generateObject({
    model: google('models/gemini-2.0-flash-lite'),
    system: "Eres un especialista agrícola y agrónomo experto. Tu función es asesorar y orientar a los agricultores, campesinos y productores rurales sobre el manejo, cultivo y comercialización de distintos tipos de semillas, cultivos y suelos.",
    prompt: "Genera una receta de una limonada",
    schema: z.object({
      receta: z.object({
        nombre: z.string(),
        ingredientes: z.array(z.string()),
        pasos: z.array(z.string()),
      }),

    }),
    
  });
  return (
    <main className="min-h-screen p-8 md:p-20 flex flex-col gap-8 items-center justify-center">
      <h1 className="text-4xl font-bold text-center">Raxibot</h1>
      <h3 className="text-xl text-center"></h3>
      {/*<p>{JSON.stringify(object?.receta)}</p> */}
      <Chat />
    </main>
      
  );
}
