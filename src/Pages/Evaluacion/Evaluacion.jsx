import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Componentes/Header/Header.jsx";
import FondoDecorativo from "../../Componentes/Fondo/Fondo.jsx";
import profesores from "../../data/Profesores.json";
import cursosData from "../../data/Cursos.json";
import relacionProfesorCurso from '../../data/Relacion_Profesor_Curso.json';

import "./Evaluacion.css";

const Evaluacion = () => {
  const location = useLocation();
  const { profesorId } = location.state || {};

  const [curso, setCurso] = useState("");
  const [claridad, setClaridad] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(null);

  const cursosDelProfesor = relacionProfesorCurso
    .filter((rel) => rel.profesor_id === profesorId)
    .map((rel) => cursosData.find((c) => c.course_id === rel.course_id))
    .filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = { curso, claridad, calificacion, comentario, anonimo };
    console.log("Formulario enviado:", datos);
  };

  return (
      <div className="evaluacion-container">
        <h1>Elige tu curso</h1>
        <select
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          className="select"
        >
          <option value="">Selecciona un curso</option>
          {cursosDelProfesor.map((c) => (
            <option key={c.course_id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <h2>¿Qué tan claro explica el profesor?</h2>
        <div className="button-group">
          {["Muy claro", "Claro", "Algo claro", "Un poco claro"].map((nivel, i) => (
            <button
              key={i}
              onClick={() => setClaridad(nivel)}
              className={`btn ${claridad === nivel ? "selected" : ""}`}
            >
              {nivel}
            </button>
          ))}
        </div>

        <h2>En general, ¿qué calificación le darías al profesor?</h2>
        <div className="emoji-group">
          {[
            { label: "Excelente", emoji: "🤩" },
            { label: "Buena", emoji: "🙂" },
            { label: "Regular", emoji: "😐" },
            { label: "Mala", emoji: "🙁" },
          ].map(({ label, emoji }, i) => (
            <button
              key={i}
              onClick={() => setCalificacion(label)}
              className={`emoji-btn ${calificacion === label ? "selected" : ""}`}
            >
              <span className="emoji">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <h2>Añadir un comentario (opcional)</h2>
        <textarea
          className="textarea"
          placeholder="Escribe un comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={300}
        />

        <h2>¿Quieres que tu calificación sea anónima?</h2>
        <div className="button-group">
          {["Sí", "No"].map((op, i) => (
            <button
              key={i}
              onClick={() => setAnonimo(op === "Sí")}
              className={`btn ${anonimo === (op === "Sí") ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Enviar evaluación
        </button>
      </div>

  );
};

export default Evaluacion;
