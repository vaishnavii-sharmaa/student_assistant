import Groq from 'groq-sdk';

let groqClient = null;

function getGroq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Add it to your .env file.');
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
}

const CODING_KEYWORDS = [
  'algorithm', 'programming', 'coding', 'javascript', 'python', 'java', 'c++', 'react',
  'node', 'data structure', 'binary search', 'sorting', 'recursion', 'dynamic programming',
  'leetcode', 'array', 'linked list', 'tree', 'graph', 'hash', 'stack', 'queue', 'sql',
  'database', 'api', 'typescript', 'html', 'css', 'machine learning', 'neural network',
  'software', 'function', 'class', 'object oriented', 'oop', 'backend', 'frontend',
];

export function isCodingTopic(topic) {
  const lower = topic.toLowerCase();
  return CODING_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function chat(messages, json = false) {
  const response = await getGroq().chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages,
    ...(json ? { response_format: { type: 'json_object' } } : {}),
    temperature: 0.7,
  });
  return response.choices[0].message.content;
}

export async function generateNotes(topic, difficulty) {
  const depthMap = {
    beginner: 'Explain in simple terms with basic examples. Avoid jargon.',
    intermediate: 'Provide moderate depth with practical examples and key formulas where relevant.',
    advanced: 'Provide in-depth coverage with advanced concepts, edge cases, and technical details.',
  };

  const content = await chat([
    {
      role: 'system',
      content: `You are an expert educator. Generate comprehensive study notes in Markdown format.
Use headings (##, ###), bullet points, bold for key terms, and code blocks for programming topics.
Include: Overview, Key Concepts, Important Details, Examples, and Summary sections.
${depthMap[difficulty] || depthMap.intermediate}`,
    },
    {
      role: 'user',
      content: `Generate study notes for the topic: "${topic}" at ${difficulty} level.`,
    },
  ]);

  return content;
}

export async function detectCodingTopic(topic) {
  if (isCodingTopic(topic)) return true;

  try {
    const result = await chat(
      [
        {
          role: 'system',
          content: 'Respond with JSON only: {"isCoding": boolean}. Determine if the topic is programming/CS related.',
        },
        { role: 'user', content: `Is "${topic}" a programming or computer science topic?` },
      ],
      true
    );
    const parsed = JSON.parse(result);
    return parsed.isCoding === true;
  } catch {
    return isCodingTopic(topic);
  }
}

export async function generateQuiz(notes, topic) {
  const result = await chat(
    [
      {
        role: 'system',
        content: `Generate a quiz based on the study notes. Return JSON with this structure:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "string explaining the correct answer"
    }
  ]
}
Generate 6-8 multiple choice questions. Each question must have exactly 4 options. correctIndex is 0-3.`,
      },
      {
        role: 'user',
        content: `Topic: ${topic}\n\nNotes:\n${notes.slice(0, 8000)}`,
      },
    ],
    true
  );

  const parsed = JSON.parse(result);
  return parsed.questions || [];
}

export async function generateAnalysis(topic, notes, questions, answers, score, timeTaken) {
  const review = questions.map((q, i) => ({
    question: q.question,
    userAnswer: answers[i] !== undefined ? q.options[answers[i]] : 'Not answered',
    correctAnswer: q.options[q.correctIndex],
    isCorrect: answers[i] === q.correctIndex,
    explanation: q.explanation,
  }));

  const result = await chat(
    [
      {
        role: 'system',
        content: `Analyze quiz performance and return JSON:
{
  "feedback": "Personalized paragraph about performance, what to revise",
  "weakAreas": ["area1", "area2", "area3"]
}`,
      },
      {
        role: 'user',
        content: `Topic: ${topic}
Score: ${score}/${questions.length} (${Math.round((score / questions.length) * 100)}%)
Time taken: ${timeTaken} seconds
Review: ${JSON.stringify(review)}
Notes excerpt: ${notes.slice(0, 2000)}`,
      },
    ],
    true
  );

  const parsed = JSON.parse(result);
  const percentage = Math.round((score / questions.length) * 100);
  let remark = 'Needs Work';
  if (percentage >= 90) remark = 'Excellent';
  else if (percentage >= 70) remark = 'Good';

  return {
    scorePercentage: percentage,
    remark,
    feedback: parsed.feedback || 'Keep studying and try again!',
    weakAreas: parsed.weakAreas || [],
  };
}

export async function generateRoadmap(topic, notes, weakAreas = []) {
  const result = await chat(
    [
      {
        role: 'system',
        content: 'Return JSON: {"roadmap": ["topic1", "topic2", "topic3", "topic4", "topic5"]}. Suggest 3-5 related topics to learn next, ordered from foundational to advanced.',
      },
      {
        role: 'user',
        content: `Current topic: ${topic}\nWeak areas: ${weakAreas.join(', ') || 'none'}\nNotes excerpt: ${notes.slice(0, 1500)}`,
      },
    ],
    true
  );

  const parsed = JSON.parse(result);
  return parsed.roadmap || [];
}

export async function generateFlashcards(notes, topic) {
  const result = await chat(
    [
      {
        role: 'system',
        content: 'Return JSON: {"flashcards": [{"front": "question/term", "back": "answer/definition"}]}. Generate 10-15 flashcards from the notes.',
      },
      {
        role: 'user',
        content: `Topic: ${topic}\n\nNotes:\n${notes.slice(0, 6000)}`,
      },
    ],
    true
  );

  const parsed = JSON.parse(result);
  return parsed.flashcards || [];
}

export async function chatAboutTopic(topic, notes, history, userMessage) {
  const messages = [
    {
      role: 'system',
      content: `You are a helpful tutor. The student is studying "${topic}". Use the notes below as context. Answer clearly in Markdown with code blocks when needed.

Notes:
${notes.slice(0, 6000)}`,
    },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  return chat(messages);
}
