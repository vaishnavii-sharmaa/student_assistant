import Groq from 'groq-sdk';
import axios from 'axios';

let groqClient = null;

function getGroq() {
  const apiKey = process.env.GROQ_YOUTUBE_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_YOUTUBE_API_KEY or GROQ_API_KEY is not configured.');
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// Fetch a real video ID from YouTube search results by query
async function fetchRealVideoId(query) {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 5000,
    });
    
    const html = response.data;
    
    // Find videoIds from the HTML (look for: "videoId":"XXXXXXXXXXX")
    const regex = /"videoId":\s*"([a-zA-Z0-9_-]{11})"/g;
    let match;
    const videoIds = [];
    while ((match = regex.exec(html)) !== null && videoIds.length < 5) {
      const id = match[1];
      if (!videoIds.includes(id) && id !== 'dQw4w9WgXcQ') {
        videoIds.push(id);
      }
    }
    
    return videoIds[0] || null;
  } catch (error) {
    console.warn(`Failed to fetch real video ID for query "${query}":`, error.message);
    return null;
  }
}

export async function searchVideos(topic, maxResults = 5) {
  try {
    const prompt = `You are a helpful study assistant. Recommend ${maxResults} high-quality, real, educational YouTube videos for the topic: "${topic}".
Provide details about the video (title and channel name, e.g. from freeCodeCamp.org, Traversy Media, Khan Academy, CrashCourse, CS Dojo, MIT OpenCourseWare, 3Blue1Brown, etc.).

Return JSON ONLY in the following format:
{
  "videos": [
    {
      "title": "string (a descriptive video title)",
      "channel": "string (the name of the channel, e.g., freeCodeCamp.org)",
      "duration": "string (formatted duration, e.g., 12:45 or 1:15:30)",
      "suggestedVideoId": "string (a likely YouTube video ID if you are confident, or empty string)"
    }
  ]
}`;

    const response = await getGroq().chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are a database of educational YouTube videos. Respond only with JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;
    const parsed = JSON.parse(result);
    const recommendedVideos = parsed.videos || [];
    
    const videos = [];
    for (const item of recommendedVideos) {
      const query = `${item.title} ${item.channel} tutorial`;
      
      // Fetch a real, working video ID
      let videoId = await fetchRealVideoId(query);
      
      // Fallback if scraping failed
      if (!videoId) {
        videoId = item.suggestedVideoId || 'dQw4w9WgXcQ';
      }
      
      videos.push({
        videoId,
        title: item.title || 'Educational Video',
        channel: item.channel || 'Education',
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        duration: item.duration || '10:00'
      });
    }

    return videos.slice(0, maxResults);
  } catch (error) {
    console.error('YouTube Groq recommendation error:', error.message);
    return [];
  }
}
