// Perfil.jsx
import React, { useState, useEffect } from "react";
import "./Perfil.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReviewService from '../../Services/review_service';
import ReviewItem from '../../Componentes/Perfil/ReviewItem';
import ConfirmModal from '../../Componentes/Perfil/ConfirmModal';

import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    setUserData(usuario);

    if (usuario?.user_id) {
      loadProfile(usuario.user_id);
    }
  }, []);

  const loadProfile = (userId) => {
    ReviewService.getReviewsByUser(userId)
      .then(({ reviews }) => setReviews(reviews))
      .catch(console.error);
  };

  const handleLike = (reviewId) => {
    const userId = userData?.user_id;
    if (!userId) return;
    ReviewService.toggleLike(reviewId, userId);
    loadProfile(userId);
  };

  const handleDislike = (reviewId) => {
    const userId = userData?.user_id;
    if (!userId) return;
    ReviewService.toggleDislike(reviewId, userId);
    loadProfile(userId);
  };

 const [modalVisible, setModalVisible] = useState(false);
const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

const openDeleteModal = (reviewId) => {
  setReviewIdToDelete(reviewId);
  setModalVisible(true);
};

const handleConfirmDelete = () => {
  ReviewService.deleteReview(reviewIdToDelete);
  setModalVisible(false);
  loadProfile(userData.user_id);
};

const handleCancelDelete = () => {
  setModalVisible(false);
  setReviewIdToDelete(null);
};



  const startEditing = (index) => {
    setEditIndex(index);

  };

  return (
    <div className="perfil-container">
      <div className="perfil">
        <img src='../../../src/images/profileDefault.png' alt="perfil" className="avatar" />
        <h2>{userData.username}</h2>
        <p className="perfil-datos">
          {userData.email}<br></br>
          Tu nombre anónimo: <strong>AMSN</strong><br></br>
          Universidad de Lima
        </p>
      </div>

      <div className="historial">
        <h3>Historial de calificaciones</h3>
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div className="review-wrapper" key={r.review.review_id}>
              <ReviewItem
                review={{
                  anonimo: r.review.anonimo,
                  image: r.user.image_url || '/profileDefault.png',
                  username: r.user.username,
                  date: r.review.date,
                  course: r.courseName,
                  nota: r.review.nota,
                  comment: r.review.comment,
                  labels: r.labels.filter(l => l.group_id === 21),
                  emoji: r.review.emoji,
                  ratingLabel: '',
                  likes: r.review.likes,
                  dislikes: r.review.dislikes
                }}
                showCourse={true}
                onLike={() => handleLike(r.review.review_id)}
                onDislike={() => handleDislike(r.review.review_id)}
              />
              <div className="editar-boton-wrapper">
                <button
                  onClick={() =>
                    navigate(`/evaluacion/${r.review.teacher_id}`, {
                      state: {
                        review: {
                          ...r.review,
                          labels: r.labels,
                          course: r.courseName,
                          emoji: r.review.emoji,
                        },
                      },
                    })
                  }
                  className="editar"
                >
                  <i className="bi bi-pencil"></i> Editar
                </button>
              <button
  onClick={() => openDeleteModal(r.review.review_id)}
  className="editar"
>
  <i className="bi bi-trash"></i> Eliminar
</button>

              </div>
            </div>
          ))
        ) : (
          <p>No has realizado ninguna review todavía.</p>
        )}
      </div>
      <ConfirmModal
  show={modalVisible}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
  message="¿Estás seguro de que deseas eliminar esta reseña?"
/>

    </div>
    
  );
};

export default Perfil;
