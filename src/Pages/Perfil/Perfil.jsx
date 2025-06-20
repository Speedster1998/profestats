// Perfil.jsx
import React, { useState, useEffect } from "react";
import "./Perfil.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ReviewService from '../../Services/review_service';
import ReviewItem from '../../Componentes/Perfil/ReviewItem';
import ConfirmModal from '../../Componentes/Perfil/ConfirmModal';
import colleges from "../../data/Universidades.json";
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState({});
  const [collegeName, setCollegeName] = useState("");
  const [collegeId, setCollegeId] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];
    if (!usuario) return;

    const actualizado = usuarios.find(u => u.user_id === usuario.user_id) || usuario;
    setUserData(actualizado);
    setNewUsername(actualizado.username);

    const universidad = colleges.find(c => c.college_id === actualizado.college_id);
    setCollegeId(actualizado.college_id);
    setCollegeName(universidad?.name || "Universidad no registrada");
    loadProfile(actualizado.user_id);
  }, []);

  const loadProfile = (userId) => {
    ReviewService.getReviewsByUser(userId)
      .then(({ reviews }) => setReviews(reviews))
      .catch(console.error);
  };

  const handleUniversityChange = (e) => {
    setCollegeId(parseInt(e.target.value));
  };

  const handleSaveProfile = () => {
    if (!newUsername.trim()) return;

    const updatedUser = { ...userData, username: newUsername, college_id: collegeId };
    setUserData(updatedUser);

    const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];
    const updatedUsuarios = usuarios.map((u) =>
      u.user_id === updatedUser.user_id ? updatedUser : u
    );
    localStorage.setItem("Usuarios", JSON.stringify(updatedUsuarios));
    setCollegeName(colleges.find(c => c.college_id === collegeId)?.name || "Universidad no registrada");
    setIsEditingProfile(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      const updatedUser = { ...userData, image_url: base64String };
      setUserData(updatedUser);

      const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];
      const updatedUsuarios = usuarios.map((u) =>
        u.user_id === updatedUser.user_id ? updatedUser : u
      );
      localStorage.setItem("Usuarios", JSON.stringify(updatedUsuarios));
    };
    reader.readAsDataURL(file);
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

  return (
    <div className="perfil-container">
      <div className="perfil">
        <img
          src={userData.image_url || "../../../src/images/profileDefault.png"}
          alt="perfil"
          className="avatar"
          style={{ objectFit: "cover" }}
        />

        {isEditingProfile && (
          <div className="d-flex flex-column align-items-center my-2">
            <input
              type="file"
              accept="image/*"
              className="form-control form-control-sm w-75"
              style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}
              onChange={handleImageChange}
            />
            <small className="text-white-50 mt-1">Cambiar imagen de perfil</small>
          </div>
        )}

        <div className="perfil-datos text-center">
          {isEditingProfile ? (
            <input
              className="form-control form-control-sm w-75 mx-auto text-center"
              style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Nuevo nombre de usuario"
            />
          ) : (
            <h2 className="text-center">{userData.username}</h2>
          )}

          <div className="d-flex justify-content-center mt-3">{userData.email}</div>

          <div className="d-flex justify-content-center mt-3">
            {isEditingProfile ? (
              <select
                value={collegeId ?? ""}
                onChange={handleUniversityChange}
                className="form-control form-control-sm w-75 mx-auto text-center"
                style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}
              >
                {colleges.map((c) => (
                  <option key={c.college_id} value={c.college_id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <span className="text-light">{collegeName}</span>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          {isEditingProfile ? (
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={handleSaveProfile}>Guardar</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setIsEditingProfile(false)}>Cancelar</button>
            </div>
          ) : (
            <div className="mt-auto d-flex justify-content-center">
              <button
                className="btn btn-outline-light btn-sm mt-9"
                onClick={() => setIsEditingProfile(true)}
              >
                <i className="bi bi-pencil"></i> Editar perfil
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="historial">
        <h3>Historial de calificaciones</h3>
        {reviews.length > 0 ? (
          reviews.map((r) => (
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
                      state: { review: { ...r.review, labels: r.labels, course: r.courseName, emoji: r.review.emoji } }
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
