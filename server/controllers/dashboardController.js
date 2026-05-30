import Session from '../models/Session.js';

export const getDashboard = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('topic difficulty quizScore quizQuestions analysis status createdAt quizCompletedAt');

    const completedSessions = sessions.filter((s) => s.status === 'completed');

    const scoreTrend = completedSessions
      .filter((s) => s.quizScore !== null && s.quizQuestions?.length)
      .map((s) => ({
        date: s.quizCompletedAt || s.createdAt,
        topic: s.topic,
        score: Math.round((s.quizScore / s.quizQuestions.length) * 100),
      }))
      .reverse();

    const subjectCounts = {};
    sessions.forEach((s) => {
      const key = s.topic.split(' ')[0];
      subjectCounts[key] = (subjectCounts[key] || 0) + 1;
    });

    const mostStudied = Object.entries(subjectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subject, count]) => ({ subject, count }));

    const studyDates = req.user.studyDates || [];
    const streak = calculateStreak(studyDates);

    res.json({
      sessions: sessions.map((s) => ({
        _id: s._id,
        topic: s.topic,
        difficulty: s.difficulty,
        score: s.quizScore !== null && s.quizQuestions?.length
          ? Math.round((s.quizScore / s.quizQuestions.length) * 100)
          : null,
        remark: s.analysis?.remark,
        weakAreas: s.analysis?.weakAreas || [],
        status: s.status,
        date: s.quizCompletedAt || s.createdAt,
      })),
      scoreTrend,
      mostStudied,
      streak,
      totalSessions: sessions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateStreak(dates) {
  if (!dates.length) return 0;

  const sorted = [...new Set(dates.map((d) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }))].sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  const oneDay = 86400000;

  const mostRecent = sorted[0];
  if (mostRecent !== todayTime && mostRecent !== todayTime - oneDay) {
    return 0;
  }

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i - 1] - sorted[i] === oneDay) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
