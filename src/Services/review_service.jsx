class ReviewService {
  constructor() {
    this.reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    this.reviewLabels = JSON.parse(localStorage.getItem('reviewLabels')) || [];
    this.labels = JSON.parse(localStorage.getItem('labels')) || [];
    this.users = JSON.parse(localStorage.getItem('Usuarios')) || [];
    this.courses = JSON.parse(localStorage.getItem('Cursos')) || [];
    this.teachers = JSON.parse(localStorage.getItem('Profesores')) || [];
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

    const reviewList = [];
    const labelNames = new Set();

    for (const reviewJson of userReviews) {
      const display = this._buildReviewDisplay(reviewJson, data, true, labelNames);
      reviewList.push(display);
    }

    return {
      reviews: reviewList,
      usedLabelNames: Array.from(labelNames)
    };
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
    const caracteristicasLabels = allLabels.filter(l => l.group_id === 21);

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
      caracteristicasLabels.forEach(label => collectLabelNames.add(label.name));
    }

    return {
      review: reviewJson,
      user: user,
      labels: caracteristicasLabels,
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

  updateReview(reviewId, newReviewData, newLabelIds) {
  const index = this.reviews.findIndex(r => r.review_id === reviewId);
  if (index !== -1) {
    this.reviews[index] = { ...this.reviews[index], ...newReviewData };
    
    // Eliminar etiquetas anteriores
    this.reviewLabels = this.reviewLabels.filter(rl => rl.review_id !== reviewId);

    // Agregar nuevas etiquetas
    for (const labelId of newLabelIds) {
      const newReviewLabel = {
        review_label_id: this.nextReviewLabelId++,
        review_id: reviewId,
        label_id: labelId
      };
      this.reviewLabels.push(newReviewLabel);
    }

    this._saveToLocalStorage();
    console.log('Reseña actualizada:', this.reviews[index]);
  } else {
    console.warn(`No se encontró la reseña con ID ${reviewId}`);
  }
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
