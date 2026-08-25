const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

function getKey() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error(
      "Chave de API não configurada. Defina VITE_GEMINI_API_KEY no arquivo .env e reinicie o servidor.",
    );
  }
  return key;
}

async function callGemini(prompt) {
  const apiKey = getKey();

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    const message =
      error?.error?.message || `Gemini API error: ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Resposta vazia da API Gemini.");
  }

  return text;
}

/**
 * Generates a structured summary for the given topic.
 * @param {string} topic
 * @returns {Promise<{title, introduction, topics, conclusion}>}
 */
export async function generateSummary(topic) {
  const prompt = `Você é um assistente educacional. Gere um resumo didático e detalhado sobre o seguinte tema de aula: "${topic}".

Retorne APENAS um objeto JSON válido, sem markdown, sem código, sem explicações externas. Use exatamente esta estrutura:
{
  "title": "Título do tema",
  "introduction": "Parágrafo introdutório explicando o tema",
  "topics": [
    { "heading": "Subtítulo 1", "content": "Conteúdo explicativo do subtítulo 1" },
    { "heading": "Subtítulo 2", "content": "Conteúdo explicativo do subtítulo 2" },
    { "heading": "Subtítulo 3", "content": "Conteúdo explicativo do subtítulo 3" }
  ],
  "conclusion": "Parágrafo de conclusão resumindo os pontos principais"
}

Inclua pelo menos 3 subtópicos relevantes. Seja claro e objetivo.`;

  const raw = await callGemini(prompt);

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error(
      "Não foi possível interpretar o resumo gerado. Tente novamente.",
    );
  }
}

/**
 * Generates a list of flashcards for the given topic.
 * @param {string} topic
 * @param {number} count
 * @returns {Promise<Array<{question: string, answer: string}>>}
 */
export async function generateFlashcards(topic, count = 2) {
  const prompt = `Você é um assistente educacional. Crie EXATAMENTE ${count} flashcards de estudo sobre o tema: "${topic}".

Retorne APENAS um array JSON válido, sem markdown, sem código, sem explicações externas. Use exatamente esta estrutura:
[
  { "question": "Pergunta clara e objetiva?", "answer": "Resposta concisa e direta." },
  { "question": "...", "answer": "..." }
]

Os flashcards devem cobrir os conceitos mais importantes do tema. As perguntas devem ser objetivas e as respostas curtas mas completas.`;

  const raw = await callGemini(prompt);

  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const cards = JSON.parse(cleaned);
    if (!Array.isArray(cards)) throw new Error("Formato inesperado");
    return cards;
  } catch {
    throw new Error(
      "Não foi possível interpretar os flashcards gerados. Tente novamente.",
    );
  }
}
