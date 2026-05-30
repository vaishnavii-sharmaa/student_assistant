import { chat } from './aiService.js';

export async function searchProblems(topic, limit = 5) {
  try {
    const prompt = `You are a helpful computer science tutor. Recommend ${limit} relevant LeetCode problems for the programming/CS topic: "${topic}".
Ensure the problems are real, existing LeetCode questions (e.g., "Two Sum", "Reverse Linked List", "Binary Search", "Longest Substring Without Repeating Characters", etc.).

Return JSON ONLY in the following format:
{
  "questions": [
    {
      "title": "string (exact LeetCode question title)",
      "titleSlug": "string (lowercase, hyphen-separated title slug used in LeetCode URL, e.g., reverse-linked-list)",
      "difficulty": "Easy" | "Medium" | "Hard"
    }
  ]
}`;

    const result = await chat([
      { role: 'system', content: 'You are a LeetCode problem recommender. Respond only with JSON.' },
      { role: 'user', content: prompt }
    ], true);

    const parsed = JSON.parse(result);
    const questions = (parsed.questions || []).map(q => {
      const slug = q.titleSlug || q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        title: q.title || 'LeetCode Problem',
        titleSlug: slug,
        difficulty: q.difficulty || 'Medium',
        url: `https://leetcode.com/problems/${slug}/`
      };
    });

    return questions.slice(0, limit);
  } catch (error) {
    console.error('LeetCode Groq recommendation error:', error.message);
    return [];
  }
}
