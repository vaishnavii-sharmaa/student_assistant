import api from './axios';

export const createSession = (data) => api.post('/study/sessions', data);
export const generateContent = (sessionId) => api.post(`/study/sessions/${sessionId}/generate`);
export const getSession = (sessionId) => api.get(`/study/sessions/${sessionId}`);
export const updateDifficulty = (sessionId, difficulty) =>
  api.patch(`/study/sessions/${sessionId}/difficulty`, { difficulty });
export const sendChat = (sessionId, message) =>
  api.post(`/study/sessions/${sessionId}/chat`, { message });
export const generateQuiz = (sessionId) => api.post(`/study/sessions/${sessionId}/quiz/generate`);
export const submitQuiz = (sessionId, data) => api.post(`/study/sessions/${sessionId}/quiz/submit`, data);
export const getQuiz = (sessionId) => api.get(`/quiz/${sessionId}`);
export const getFlashcards = (sessionId) => api.get(`/study/sessions/${sessionId}/flashcards`);
