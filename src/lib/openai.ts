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
    `Tu es un expert en transcription et mise en forme de documents. Formate ce texte transcrit en un document structuré et professionnel.

Instructions de formatage :
1. Structure claire :
   - Utilise des titres de sections avec la syntaxe markdown (# pour titre principal, ## pour sous-titres)
   - Organise le contenu en paragraphes logiques
   - Ajoute des listes à puces pour les points importants

2. Identification des locuteurs :
   - Si plusieurs personnes parlent, ajoute leurs noms/rôles en gras (ex: **Présentateur:**)
   - Conserve la cohérence des identifications tout au long du document

3. Mise en valeur :
   - Mets en gras (**) les points clés et décisions importantes
   - Utilise l'italique (*) pour les citations directes
   - Ajoute des listes numérotées (1., 2., etc.) pour les étapes ou processus

4. Organisation :
   - Ajoute un titre principal reflétant le sujet
   - Si pertinent, inclus une brève introduction
   - Groupe les sujets connexes sous les mêmes sections
   - Termine par une conclusion ou les prochaines étapes si mentionnées

Retourne le texte formaté en markdown en respectant ces règles.

Texte à formater :
${text}` :
    `You are an expert in transcription and document formatting. Format this transcribed text into a structured and professional document.

Formatting instructions:
1. Clear structure:
   - Use section headings with markdown syntax (# for main title, ## for subtitles)
   - Organize content into logical paragraphs
   - Add bullet points for important items

2. Speaker identification:
   - If multiple people are speaking, add their names/roles in bold (e.g., **Presenter:**)
   - Maintain consistent identification throughout the document

3. Emphasis:
   - Bold (**) key points and important decisions
   - Use italics (*) for direct quotes
   - Add numbered lists (1., 2., etc.) for steps or processes

4. Organization:
   - Add a main title reflecting the subject
   - If relevant, include a brief introduction
   - Group related topics under the same sections
   - End with a conclusion or next steps if mentioned

Return the text formatted in markdown following these rules.

Text to format:
${text}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional editor specialized in formatting transcribed speech into clear, well-structured documents. You excel at identifying speakers, key points, and organizing content logically while maintaining the original meaning and context."
      },
      {
        role: "user",
        content: prompt
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