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
    this.reviewVotes = JSON.parse(localStorage.getItem('reviewVotes')) || {};
  }

  _saveToLocalStorage() {
    localStorage.setItem('reviews', JSON.stringify(this.reviews));
    localStorage.setItem('reviewLabels', JSON.stringify(this.reviewLabels));
    localStorage.setItem('reviewVotes', JSON.stringify(this.reviewVotes));
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
    const labelCounts = new Map();

    for (const reviewJson of teacherReviews) {
      const display = this._buildReviewDisplay(reviewJson, data, false, labelCounts);
      reviewList.push(display);
    }

    const usedLabelStats = Array.from(labelCounts.entries()).map(([name, count]) => ({
      name,
      count
    }));


    return {
      reviews: reviewList,
      usedLabelStats,
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

  _buildReviewDisplay(reviewJson, data, useTeacherAsUser = false, labelCounts = null) {

    const reviewId = reviewJson.review_id;
    const userId = reviewJson.user_id;

    // Obtener todos los label_ids asociados a esta review
    const labelIds = data.reviewLabels
      .filter(rl => rl.review_id === reviewId)
      .map(rl => rl.label_id);

    // Mapear esos IDs a los objetos de etiqueta completos

    const allLabels = labelIds.map(id => data.labelMap[id]).filter(Boolean);

    if (labelCounts) {
      allLabels.forEach(label => {
        if (labelCounts instanceof Map) {
          labelCounts.set(label.name, (labelCounts.get(label.name) || 0) + 1);   // Conteo ( perfil profesor)
        } else if (labelCounts instanceof Set) {
          labelCounts.add(label.name);  // Solo registrar (perfil usuario)
        }
      });
    }

    // Obtener el usuario (o profesor si se usa esa opción)
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

    // Obtener nombre del curso
    const course = data.courseMap[reviewJson.course_id];
    const courseName = course ? course.name : '';

    return {
      review: reviewJson,
      user: user,
      labels: allLabels,
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

  deleteReview(reviewId) {
    // Eliminar la review
    this.reviews = this.reviews.filter(r => r.review_id !== reviewId);

    // Eliminar etiquetas asociadas
    this.reviewLabels = this.reviewLabels.filter(rl => rl.review_id !== reviewId);

    // Eliminar votos asociados a esta review
    for (const key in this.reviewVotes) {
      if (key.endsWith(`-${reviewId}`)) {
        delete this.reviewVotes[key];
      }
    }

    this._saveToLocalStorage();
    console.log(`Reseña ${reviewId} eliminada correctamente.`);
  }


  toggleLike(reviewId, userId) {
    const review = this.reviews.find(r => r.review_id === reviewId);
    if (!review) return;

    const key = `${userId}-${reviewId}`;
    const previousVote = this.reviewVotes[key];

    if (previousVote === 'like') {
      review.likes -= 1;
      delete this.reviewVotes[key];
    } else {
      if (previousVote === 'dislike') review.dislikes -= 1;
      review.likes += 1;
      this.reviewVotes[key] = 'like';
    }

    this._saveToLocalStorage();
  }

  toggleDislike(reviewId, userId) {
    const review = this.reviews.find(r => r.review_id === reviewId);
    if (!review) return;

    const key = `${userId}-${reviewId}`;
    const previousVote = this.reviewVotes[key];

    if (previousVote === 'dislike') {
      review.dislikes -= 1;
      delete this.reviewVotes[key];
    } else {
      if (previousVote === 'like') review.likes -= 1;
      review.dislikes += 1;
      this.reviewVotes[key] = 'dislike';
    }

    this._saveToLocalStorage();
  }

  getAllReviews() {
    return this.reviews;
  }

  getAllReviewLabels() {
    return this.reviewLabels;
  }

  getGroupAveragesForTeacher(teacherId) {
    const data = this._loadAllData();
    const teacherReviews = this.reviews.filter(r => r.teacher_id === teacherId);

    const groupScores = {};
    const groupCounts = {};

    for (const review of teacherReviews) {
      const labelIds = this.reviewLabels
        .filter(rl => rl.review_id === review.review_id)
        .map(rl => rl.label_id);

      for (const labelId of labelIds) {
        const label = data.labelMap[labelId];
        console.log("Etiqueta cargada:", label);
        if (!label || label.nivel == null) continue;

        const groupId = label.group_id;

        if (!groupScores[groupId]) {
          groupScores[groupId] = 0;
          groupCounts[groupId] = 0;
        }

        groupScores[groupId] += label.nivel;
        groupCounts[groupId] += 1;
      }
    }

    const result = [];

    for (const groupId in groupScores) {
      const groupLabel = this.labels.find(l => l.group_id == groupId && l.text);
      result.push({
        group_id: Number(groupId),
        name: groupLabel?.text || `Pregunta ${groupId}`,
        promedio: parseFloat((groupScores[groupId] / groupCounts[groupId]).toFixed(2))
      });
    }

    return result;
  }


}

export default new ReviewService();
