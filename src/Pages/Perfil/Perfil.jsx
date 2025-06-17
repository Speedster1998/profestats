import React, { useState, useEffect } from "react";
import "./Perfil.css";

const Perfil = () => {
  const [reviews, setReviews] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editComentario, setEditComentario] = useState("");
  const [editNota, setEditNota] = useState("");

  useEffect(() => {
    fetch("./src/data/reviews-Perfil.json")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Error cargando datos:", err));
  }, []);

  const startEditing = (index) => {
    setEditIndex(index);
    setEditComentario(reviews[index].comentario);
    setEditNota(reviews[index].nota);
  };

  const saveChanges = () => {
    const updated = [...reviews];
    updated[editIndex].comentario = editComentario;
    updated[editIndex].nota = parseFloat(editNota);
    setReviews(updated);
    setEditIndex(null);
  };

  const cancelEdit = () => setEditIndex(null);

  return (
    <div className="perfil-container">
      <div className="perfil">
        <img src="https://i.pravatar.cc/150?img=12" alt="perfil" className="avatar" />
        <h2>Alex Hernandez</h2>
        <p className="perfil-datos">
            Alex@ulima.com<br></br>
            Tu nombre anónimo: <strong>AMSN</strong><br></br>
            Universidad de Lima
        </p>
      </div>

      <div className="historial">
        <div className="top-bar">
          <h3>Historial de calificaciones</h3>
        </div>

        {reviews.map((rev, index) => (
          <div className="review" key={index}>
            <div className="review-info">
              <img src={rev["image-url"]} alt="profe" className="mini-avatar" />
              <div className="contenido">
                <p className="perfil-nombreProfesor"><strong>{rev.nombreProfesor}</strong> · {rev.dia}</p>

                {editIndex === index ? (
                  <>
                    <p>📘 <strong>Curso:</strong> {rev.curso} 🧾 <strong>Nueva nota:</strong> <input className="perfil-numberbox" type="number" value={editNota} onChange={(e) => setEditNota(e.target.value)} /></p>
                    <p><strong>Comentario:</strong></p>
                    <textarea
                      className="perfil-textbox"
                      rows={2}
                      value={editComentario}
                      onChange={(e) => setEditComentario(e.target.value)}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <button className="perfil-guardar" onClick={saveChanges}>Guardar</button>
                      <button className="perfil-cancelar" onClick={cancelEdit} style={{ marginLeft: "10px" }}>Cancelar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>📘 <strong>Curso:</strong> {rev.curso} 🧾 <strong>Nota recibida:</strong> {rev.nota}</p>
                    <p className="comentario">{rev.comentario}</p>
                  </>
                )}

                <div className="tags">
                  {rev.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
              </div>
              <div className="perfil-contenido-right-section">
                <div className="perfil-emoji">{rev.emoji}</div>
                <div className="rating-label">{rev.ratingLabel}</div>
                <div className="vote-icons">👍 🔁</div>
              </div>
            </div>

            {editIndex !== index && (
              <button className="editar" onClick={() => startEditing(index)}>
                <img src="./src/Images/pencil.png" alt="pencil" id="pencil"/> Editar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Perfil;