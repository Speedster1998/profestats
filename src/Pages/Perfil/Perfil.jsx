// Perfil.jsx
import React, { useState, useEffect } from "react";
import "./Perfil.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReviewService from '../../Services/review_service';
import ReviewItem from '../../Componentes/Perfil/ReviewItem';
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
    ReviewService.addLike(reviewId);
    loadProfile(userData.user_id);
  };

  const handleDislike = (reviewId) => {
    ReviewService.addDislike(reviewId);
    loadProfile(userData.user_id);
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
                  image: r.user.image_url || '/default-avatar.png',
                  username: r.user.username,
                  date: r.review.date,
                  course: r.courseName,
                  nota: r.review.nota,
                  comment: r.review.comment,
                  labels: r.labels,
                  emoji: r.review.emoji,
                  ratingLabel: '',
                  likes: r.review.likes,
                  dislikes: r.review.dislikes
                }}
                showCourse={true}
                onLike={() => handleLike(r.review.review_id)}
                onDislike={() => handleDislike(r.review.review_id)}
                showEditButton={true}
                onEdit={() =>
                  navigate(`/evaluacion/${r.review.teacher_id}`, {
                    state: {
                      review: {
                        ...r.review,
                        labels: r.labels,
                        course: r.courseName,
                        emoji: r.review.emoji,
                      }
                    }
                  })
                }
              />
            </div>
          ))
        ) : (
          <p>No has realizado ninguna review todavía.</p>
        )}
      </div>
    </div>
  );
};

export default Perfil;
