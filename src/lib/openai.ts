import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const transcribeAudio = async (
  file: File,
  language: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', 'whisper-1');
  formData.append('language', language);
  formData.append('prompt', `Please transcribe this audio with proper formatting. Include:
- Clear section headings (using markdown # syntax)
- Proper paragraphs
- Speaker labels if multiple speakers are detected
- Important points or key takeaways (as bullet points)
Please format the output in markdown.`);
  formData.append('response_format', 'text');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to transcribe audio');
  }

  const transcriptionText = await response.text();
  return transcriptionText;
};

export const formatTranscription = async (text: string, language: string): Promise<string> => {
  const prompt = language === 'fr' ? 
    `Formate ce texte transcrit en un document structuré et lisible. Inclus :
    - Des titres de sections clairs (utilise la syntaxe markdown #)
    - Des paragraphes bien organisés
    - Des étiquettes de locuteurs si plusieurs personnes parlent
    - Une mise en forme cohérente
    Conserve tous les détails importants. Retourne le texte formaté en markdown.` :
    `Format this transcribed text into a structured, readable document. Include:
    - Clear section headings (use markdown # syntax)
    - Well-organized paragraphs
    - Speaker labels if multiple speakers are detected
    - Consistent formatting
    Maintain all important details. Return the formatted text in markdown.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a professional editor who formats transcribed text into well-structured documents."
      },
      {
        role: "user",
        content: `${prompt}\n\nText to format:\n${text}`
      }
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message.content || text;
};

export const summarizeTranscription = async (text: string, language: string): Promise<string> => {
  const prompt = language === 'fr' ? 
    `Crée un résumé concis de cette transcription. Inclus :
    - Les points clés principaux (maximum 5)
    - Les conclusions importantes
    - Les décisions ou actions à prendre (si mentionnées)
    Format requis :
    # Résumé
    ## Points Clés
    [liste des points]
    ## Conclusions
    [conclusions principales]
    ## Actions
    [actions si présentes]` :
    `Create a concise summary of this transcription. Include:
    - Main key points (maximum 5)
    - Important conclusions
    - Decisions or actions to be taken (if mentioned)
    Required format:
    # Summary
    ## Key Points
    [points list]
    ## Conclusions
    [main conclusions]
    ## Actions
    [actions if any]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert at summarizing complex discussions into clear, actionable points."
      },
      {
        role: "user",
        content: `${prompt}\n\nText to summarize:\n${text}`
      }
    ],
    temperature: 0.3,
  });

  return completion.choices[0].message.content || text;
};