import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../Componentes/Header/Header.jsx";
import FondoDecorativo from "../../Componentes/Fondo/Fondo.jsx";
import profesores from "../../data/Profesores.json";
import cursosData from "../../data/Cursos.json";
import relaciones from "../../data/Relación_Profesor_Curso.json copy.json";
import "./Evaluacion.css";

const Evaluacion = () => {
  const location = useLocation();
  const { profesorId } = location.state || {};

  const [curso, setCurso] = useState("");
  const [claridad, setClaridad] = useState("");
  const [ayuda, setAyuda] = useState("");
  const [facilidad, setFacilidad] = useState("");
  const [interes, setInteres] = useState("");
  const [recomienda, setRecomienda] = useState(null);
  const [asistencia, setAsistencia] = useState(null);
  const [calificacion, setCalificacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);

  const cursosDelProfesor = relaciones
    .filter((rel) => rel.profesor_id === profesorId)
    .map((rel) => cursosData.find((c) => c.course_id === rel.course_id))
    .filter(Boolean);

  const opcionesCaracteristicas = [
    "Tiene buena disposición",
    "Responde dudas con claridad",
    "Motiva a los estudiantes",
    "Domina el curso",
    "Es empático",
    "Es puntual",
    "Es organizado",
    "Es accesible fuera de clase",
    "Hace clases dinámicas",
    "Explica con ejemplos claros",
    "Transmite seguridad en lo que enseña",
    "Hace seguimiento a los alumnos",
    "Se preocupa por el aprendizaje",
    "Fomenta la participación",
    "Promueve el pensamiento crítico",
    "Califica con justicia",
    "Da buena retroalimentación",
    "Las clases son excelentes",
    "Tomaría su clase otra vez",
    "Respetado por los estudiantes",
    "Es muy cómico"
  ];

  const descriptorClaridad = (v) =>
    ["Muy confuso", "Confuso", "Algo claro", "Bastante claro", "Súper claro"][v - 1] || "";

  const descriptorAyuda = (v) =>
    ["No ayuda nada", "Le tienes que rogar por algo de ayuda", "Si le pides ayuda, te la da", "Lo más probable es que te ayude", "Ayuda bastante"][v - 1] || "";

  const descriptorFacilidad = (v) =>
    ["Muy difícil", "Difícil", "Lo usual", "Fácil", "Súper fácil"][v - 1] || "";

  const descriptorInteres = (v) =>
    ["Casi nada", "Poco interesado", "Más o menos interesado", "Interesado", "Súper interesado"][v - 1] || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = {
      curso,
      claridad,
      ayuda,
      facilidad,
      interes,
      recomienda,
      asistencia,
      calificacion,
      comentario,
      anonimo,
      caracteristicas,
    };
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

      <div className="likert-row">
        <div className="likert-label">Claridad</div>
        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setClaridad(n)}
              className={`btn ${claridad === n ? "selected" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="likert-description">{descriptorClaridad(claridad)}</div>
      </div>

      <div className="likert-row">
        <div className="likert-label">Ayuda</div>
        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setAyuda(n)}
              className={`btn ${ayuda === n ? "selected" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="likert-description">{descriptorAyuda(ayuda)}</div>
      </div>

      <div className="likert-row">
        <div className="likert-label">Facilidad</div>
        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setFacilidad(n)}
              className={`btn ${facilidad === n ? "selected" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="likert-description">{descriptorFacilidad(facilidad)}</div>
      </div>

      <div className="likert-row">
        <div className="likert-label">Tu interés en clase</div>
        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setInteres(n)}
              className={`btn ${interes === n ? "selected" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="likert-description">{descriptorInteres(interes)}</div>
      </div>

      <div className="inline-row">
        <div className="inline-label">¿Lo recomiendas?</div>
        <div className="inline-options">
          {["Sí", "No"].map((op, i) => (
            <button
              key={i}
              onClick={() => setRecomienda(op)}
              className={`btn ${recomienda === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="inline-row">
        <div className="inline-label">Asistencia a clase</div>
        <div className="inline-options">
          {["Obligatoria", "No obligatoria"].map((op, i) => (
            <button
              key={i}
              onClick={() => setAsistencia(op)}
              className={`btn ${asistencia === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <h2>¿Qué calificación le das al profesor?</h2>
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

      <h2>¿Cuáles de estas frases describen mejor al profesor?</h2>
      <div className="checkbox-group">
        {opcionesCaracteristicas.map((carac, index) => {
          const selected = caracteristicas.includes(carac);
          return (
            <label
              key={index}
              className={`btn ${selected ? "selected" : ""}`}
              onClick={() => {
                setCaracteristicas((prev) =>
                  selected
                    ? prev.filter((c) => c !== carac)
                    : [...prev, carac]
                );
              }}
            >
              <input
                type="checkbox"
                value={carac}
                checked={selected}
                readOnly
              />
              {carac}
            </label>
          );
        })}
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
