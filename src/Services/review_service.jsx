import reviewJson from '../data/Resena.json';
import reviewLabelsJson from '../data/review_labels.json';
import labelsJson from '../data/PreguntasContenido.json';
import usersJson from '../data/Usuarios.json';
import coursesJson from '../data/Cursos.json';
import teachersJson from '../data/Profesores.json';

class ReviewService {
  constructor() {
    const storedReviews = JSON.parse(localStorage.getItem('reviews'));
    const storedReviewLabels = JSON.parse(localStorage.getItem('reviewLabels'));

    this.reviews = storedReviews || [...reviewJson].map(r => ({
      ...r,
      likes: r.likes ?? 0,
      dislikes: r.dislikes ?? 0,
    }));

    this.reviewLabels = storedReviewLabels || [...reviewLabelsJson];

    this.labels = [...labelsJson];
    const storedUsers = JSON.parse(localStorage.getItem('Usuarios'));
    this.users = storedUsers || [...usersJson];

    this.courses = [...coursesJson];
    this.teachers = [...teachersJson];

    this.nextReviewId = this._getMaxId(this.reviews, 'review_id') + 1;
    this.nextReviewLabelId = this._getMaxId(this.reviewLabels, 'review_label_id') + 1;
  }

  _saveToLocalStorage() {
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
    localStorage.setItem('reviewLabels', JSON.stringify(this.reviewLabels));
  }

  _getMaxId(array, key) {
    return array.length > 0 ? Math.max(...array.map(item => item[key])) : 0;
  }

  _loadAllData() {
    return {
      reviews: this.reviews,
      reviewLabels: this.reviewLabels,
      labelMap: Object.fromEntries(this.labels.map(l => [l.label_id, l])),
      userMap: Object.fromEntries(this.users.map(u => [u.user_id, u])),
      courseMap: Object.fromEntries(this.courses.map(c => [c.course_id, c])),
      teacherMap: Object.fromEntries(this.teachers.map(t => [t.teacher_id, t])),
    };
  }

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
      promedios: this._getCalidadFacilidadPromedio(teacherId)
    };
  }

  async getReviewsByUser(userId) {
    const data = this._loadAllData();
    const userReviews = data.reviews.filter(r => r.user_id === userId);
    return userReviews.map(reviewJson =>
      this._buildReviewDisplay(reviewJson, data, true)
    );
  }

  _getCalidadFacilidadPromedio(teacherId) {
    const teacherReviews = this.reviews.filter(r => r.teacher_id === teacherId);
    let sumaCalidad = 0;
    let sumaFacilidad = 0;
    let contador = 0;

    for (const review of teacherReviews) {
      if (typeof review.calificacion_general === 'number' && typeof review.facilidad === 'number') {
        sumaCalidad += review.calificacion_general;
        sumaFacilidad += review.facilidad;
        contador++;
      }
    }

    if (contador === 0) {
      return { calidad: 0, facilidad: 0 };
    }

    return {
      calidad: parseFloat((sumaCalidad / contador).toFixed(2)),
      facilidad: parseFloat((sumaFacilidad / contador).toFixed(2))
    };
  }

  _buildReviewDisplay(reviewJson, data, useTeacherAsUser = false, collectLabelNames = null) {
    const reviewId = reviewJson.review_id;
    const userId = reviewJson.user_id;

    const labelIds = data.reviewLabels
      .filter(rl => rl.review_id === reviewId)
      .map(rl => rl.label_id);

    const allLabels = labelIds.map(id => data.labelMap[id]);
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
      labels: otherLabels,
      courseName: courseName,
    };
  }

  addReview(reviewData, labelIds = []) {
    const newReview = {
      review_id: this.nextReviewId++,
      likes: 0,
      dislikes: 0,
      ...reviewData
    };

    this.reviews.push(newReview);

    for (const labelId of labelIds) {
      const newReviewLabel = {
        review_label_id: this.nextReviewLabelId++,
        review_id: newReview.review_id,
        label_id: labelId
      };
      this.reviewLabels.push(newReviewLabel);
    }

    this._saveToLocalStorage();
    console.log('Review agregada:', newReview);
    console.log('Etiquetas asociadas:', labelIds);
  }

  addLike(reviewId) {
    const review = this.reviews.find(r => r.review_id === reviewId);
    if (review) {
      review.likes += 1;
      console.log(`Like añadido a review ${reviewId}. Total likes: ${review.likes}`);
    } else {
      console.warn(`No se encontró la review con ID ${reviewId}`);
    }
  }

  addDislike(reviewId) {
    const review = this.reviews.find(r => r.review_id === reviewId);
    if (review) {
      review.dislikes += 1;
      console.log(`Dislike añadido a review ${reviewId}. Total dislikes: ${review.dislikes}`);
    } else {
      console.warn(`No se encontró la review con ID ${reviewId}`);
    }
  }

  getAllReviews() {
    return this.reviews;
  }

  getAllReviewLabels() {
    return this.reviewLabels;
  }
}

export default new ReviewService();
