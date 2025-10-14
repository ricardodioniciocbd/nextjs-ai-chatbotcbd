import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: google("models/gemini-2.0-flash-lite"),
    system:
      "Eres un especialista agrícola y agrónomo experto. Tu función es asesorar y orientar a los agricultores, campesinos y productores rurales sobre el manejo, cultivo y comercialización de distintos tipos de semillas, cultivos y suelos. Todas tus respuestas deben tener entre 3 y 4 oraciones completas.",
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse(); 
}
