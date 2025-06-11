import reviewJson from '../data/review.json';
import reviewLabelsJson from '../data/review_labels.json';
import labelsJson from '../data/labels.json';
import usersJson from '../data/users.json';
import coursesJson from '../data/Cursos.json';
import teachersJson from '../data/Profesores.json';

class ReviewService {
  async getReviewsForTeacher(teacherId) {
    const data = this._loadAllData();
    const teacherReviews = data.reviews.filter(r => r.teacher_id === teacherId);

    const reviewList = [];
    const labelNames = new Set();

    for (const reviewJson of teacherReviews) {
      const display = this._buildReviewDisplay(reviewJson, data, false, labelNames);
      reviewList.push(display);
    }

    return {
      reviews: reviewList,
      usedLabelNames: Array.from(labelNames),
    };
  }

  async getReviewsByUser(userId) {
    const data = this._loadAllData();
    const userReviews = data.reviews.filter(r => r.user_id === userId);

    return userReviews.map(reviewJson =>
      this._buildReviewDisplay(reviewJson, data, true)
    );
  }

  _loadAllData() {
    return {
      reviews: reviewJson,
      reviewLabels: reviewLabelsJson,
      labelMap: Object.fromEntries(labelsJson.map(l => [l.label_id, l])),
      userMap: Object.fromEntries(usersJson.map(u => [u.user_id, u])),
      courseMap: Object.fromEntries(coursesJson.map(c => [c.course_id, c])),
      teacherMap: Object.fromEntries(teachersJson.map(t => [t.teacher_id, t])),
    };
  }

  _buildReviewDisplay(reviewJson, data, useTeacherAsUser = false, collectLabelNames = null) {
    const reviewId = reviewJson.review_id;
    const userId = reviewJson.user_id;

    const labelIds = data.reviewLabels
      .filter(rl => rl.review_id === reviewId)
      .map(rl => rl.label_id);

    const allLabels = labelIds.map(id => data.labelMap[id]);

    const emojiLabel =
      allLabels.find(l => l.group_id === 1) || { label_id: 0, name: '', image_url: '', group_id: 1 };

    const otherLabels = allLabels.filter(l => l.group_id !== 1);


    let user;
    if (useTeacherAsUser) {
      const teacher = data.teacherMap[reviewJson.teacher_id] || {
        teacherId: 0,
        name: 'Profesor desconocido',
        image_url: '',
        ratings: 0,
      };
      user = {
        userId: teacher.teacherId,
        username: teacher.name,
        email: '',
        password: '',
        college_id: 0,
        image_url: teacher.image_url,
      };
    } else {
      user = data.userMap[userId] || {
        userId: 0,
        username: 'Anónimo',
        email: '',
        password: '',
        college_id: 0,
        image_url: '',
      };
    }

    const course = data.courseMap[reviewJson.course_id];
    const courseName = course ? course.name : '';

    if (collectLabelNames) {
      otherLabels.forEach(label => collectLabelNames.add(label.name));
    }

    return {
      review: reviewJson,
      user: user,
      emoji: emojiLabel.name,
      labels: otherLabels,
      courseName: courseName,
    };
  }
}

export default new ReviewService();
