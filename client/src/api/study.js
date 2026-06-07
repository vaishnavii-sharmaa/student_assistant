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
export const getSessions = () => api.get('/study/sessions');
export const deleteSession = (sessionId) => api.delete(`/study/sessions/${sessionId}`);
export const updateSessionNotes = (sessionId, notes) =>
  api.patch(`/study/sessions/${sessionId}/notes`, { notes });
export const summarizeCustomContent = (data) => api.post('/study/sessions/summarize', data);
export const saveCustomSummary = (data) => api.post('/study/sessions/save-summary', data);

