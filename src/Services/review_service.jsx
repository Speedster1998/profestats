import reviews from '../data/review.json';
import reviewLabels from '../data/review_labels.json';
import labels from '../data/labels.json';
import users from '../data/users.json';
import courses from '../data/Cursos.json';
import teachers from '../data/Profesores.json';

function loadAllData() {
  return {
    reviews,
    reviewLabels,
    labelMap: Object.fromEntries(labels.map(l => [l.label_id, l])),
    userMap: Object.fromEntries(users.map(u => [u.user_id, u])),
    courseMap: Object.fromEntries(courses.map(c => [c.course_id, c])),
    teacherMap: Object.fromEntries(teachers.map(t => [t.teacher_id, t])),
  };
}

function buildReviewDisplay(reviewJson, data, { useTeacherAsUser = false, collectLabelNames = new Set() } = {}) {
  const reviewId = reviewJson.review_id;

  const labelIds = data.reviewLabels
    .filter(rl => rl.review_id === reviewId)
    .map(rl => rl.label_id);

  const allLabels = labelIds.map(id => data.labelMap[id]);

  const emojiLabel = allLabels.find(l => l.group_id === 1) || {
    label_id: 0,
    name: '',
    image_url: '',
    group_id: 1,
  };

  const otherLabels = allLabels.filter(l => l.group_id !== 1);

  const user = useTeacherAsUser
    ? (() => {
        const teacher = data.teacherMap[reviewJson.teacher_id] || {
          teacher_id: 0,
          name: 'Profesor desconocido',
          image_url: '',
          ratings: 0,
        };
        return {
          user_id: teacher.teacher_id,
          username: teacher.name,
          email: '',
          password: '',
          college_id: 0,
          image_url: teacher.image_url,
        };
      })()
    : data.userMap[reviewJson.user_id] || {
        user_id: 0,
        username: 'Anónimo',
        email: '',
        password: '',
        college_id: 0,
        image_url: '',
      };

  const courseName = data.courseMap[reviewJson.course_id]?.name || '';

  collectLabelNames && otherLabels.forEach(l => collectLabelNames.add(l.name));

  return {
    review: reviewJson,
    user,
    emoji: emojiLabel.name,
    labels: otherLabels,
    courseName,
  };
}

export const ReviewService = {
  getReviewsForTeacher: (teacherId) => {
    const data = loadAllData();
    const filtered = data.reviews.filter(r => r.teacher_id === teacherId);

    const labelNames = new Set();
    const reviewDisplays = filtered.map(r =>
      buildReviewDisplay(r, data, { useTeacherAsUser: false, collectLabelNames: labelNames })
    );

    return {
      reviews: reviewDisplays,
      usedLabelNames: Array.from(labelNames),
    };
  },

  getReviewsByUser: (userId) => {
    const data = loadAllData();
    const filtered = data.reviews.filter(r => r.user_id === userId);

    return filtered.map(r =>
      buildReviewDisplay(r, data, { useTeacherAsUser: true })
    );
  }
};
