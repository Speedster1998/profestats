import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Evaluacion.css";
import profesores from "../../data/Profesores.json";
import cursosData from "../../data/Cursos.json";
import relaciones from "../../data/Relacion_Profesor_Curso.json";
import preguntas from "../../data/Preguntas.json";
import labels from "../../data/PreguntasContenido.json";
import { loadQuestionsWithLabels } from "../../Services/rate_service.jsx";
import ReviewService from "../../Services/review_service.jsx";
import { useNavigate } from "react-router-dom";

const Evaluacion = () => {
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const parsedProfesorId = parseInt(teacherId);
  const profesor = profesores.find((p) => p.teacher_id === parsedProfesorId);
  if (!profesor) return <div>Profesor no encontrado.</div>;
  console.log("Usuario actual:", localStorage.getItem("usuario"));

  const userFromStorage = JSON.parse(localStorage.getItem("usuario"));
  const user_id = userFromStorage?.user_id || 1;

  const [curso, setCurso] = useState("");
  const [facilidad, setFacilidad] = useState(null);
  const [recomendado, setRecomendado] = useState(null);
  const [asistencia, setAsistencia] = useState(null);
  const [emoji, setCalificacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [preguntasDinamicas, setPreguntasDinamicas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const labelsEtiquetas = labels.filter(label => label.group_id === 21);
  const [notaAlumno, setNotaAlumno] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    const cargarPreguntas = async () => {
      const data = await loadQuestionsWithLabels();
      setPreguntasDinamicas(data);
    };
    cargarPreguntas();
  }, []);

  if (!profesor) return <div>Profesor no encontrado.</div>;

  const cursosDelProfesor = relaciones
    .filter((rel) => rel.teacher_id === parsedProfesorId)
    .map((rel) => cursosData.find((c) => c.course_id === rel.course_id))
    .filter(Boolean);

  const calcularPromedioDinamico = () => {
    const valores = Object.entries(respuestas)
      .map(([_, val]) => parseInt(val))
      .filter((val) => !isNaN(val) && val >= 1 && val <= 5);

    return valores.length
      ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(2)
      : null;
  };

  // Extraer label_id de preguntas dinámicas
  const labelIdsDinamicos = preguntasDinamicas
    .map((preg) => {
      const selected = respuestas[preg.group_id];
      const label = labels.find(
        (l) => l.group_id === preg.group_id && l.level === selected
      );
      return label?.label_id;
    })
    .filter(Boolean);

  // Extraer label_id de características (group_id === 21)
  const labelIdsCaracteristicas = labelsEtiquetas
    .filter((l) => caracteristicas.includes(l.name))
    .map((l) => l.label_id);

  // Combinar todos los label_id
  const allLabelIds = [...labelIdsCaracteristicas];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (enviando) return;
    if (!curso) return setErrorMensaje("Debes seleccionar un curso.");
    if (!facilidad) return setErrorMensaje("Indica la facilidad.");
    if (!recomendado) return setErrorMensaje("Indica si recomiendas al profesor.");
    if (!asistencia) return setErrorMensaje("Selecciona la asistencia.");
    if (!notaAlumno) return setErrorMensaje("Debes indicar qué nota obtuviste.");
    if (!emoji) return setErrorMensaje("Selecciona una calificación en emojis.");
    if (preguntasDinamicas.some((p) => !respuestas[p.group_id])) {
      return setErrorMensaje("Responde todas las preguntas antes de enviar.");
    }

    if (!cursosDelProfesor.some((c) => c.name === curso)) {
      return setErrorMensaje("El curso seleccionado no pertenece al profesor.");
    }
    const promedioPreguntas = calcularPromedioDinamico();

    const datos = {
      user_id: user_id,
      teacher_id: parsedProfesorId,
      course_id: cursosDelProfesor.find((c) => c.name === curso)?.course_id || null,
      comment: comentario,
      date: new Date().toISOString().split("T")[0],
      anonimo: anonimo,
      calificacion_general: parseFloat(promedioPreguntas),
      facilidad: parseInt(facilidad),
      nota: parseInt(notaAlumno),
      recomendado: recomendado,
      asistencia: asistencia,
      emoji
    };

    setEnviando(true);
    await ReviewService.addReview(datos, allLabelIds);
    setEnviando(false);
    console.log("¡Gracias por tu evaluación!");
    navigate(-1);

    setCurso("");
    setFacilidad("");
    setRecomendado(null);
    setAsistencia(null);
    setCalificacion("");
    setComentario("");
    setAnonimo(null);
    setCaracteristicas([]);
    setErrorMensaje("");

  };


  return (
    <div className="evaluacion-container">
      <h6>Evaluando a: {profesor.name}</h6>

      <h1>Elige tu curso</h1>
      <select
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
        className="select"
        disabled={cursosDelProfesor.length === 0}
      >
        <option value="">Selecciona un curso</option>
        {cursosDelProfesor.map((c) => (
          <option key={c.course_id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {preguntasDinamicas.map((pregunta) => {
        const selectedValue = respuestas[pregunta.group_id];
        const labelsDelGrupo = labels.filter((l) => l.group_id === pregunta.group_id);
        const labelSeleccionado = labelsDelGrupo[selectedValue - 1];

        return (
          <div key={pregunta.group_id} className="likert-row">
            <div className="likert-label">{pregunta.text}</div>
            <div className="likert-options">
              {[1, 2, 3, 4, 5].map((valor) => (
                <button
                  key={valor}
                  onClick={() =>
                    setRespuestas((prev) => ({ ...prev, [pregunta.group_id]: valor }))
                  }
                  className={`btn ${selectedValue === valor ? "selected" : ""}`}
                >
                  {valor}
                </button>
              ))}
            </div>
            {selectedValue && (
              <div className="likert-description">
                {labelSeleccionado?.name || ""}
              </div>
            )}
          </div>
        );
      })}

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
      </div>

      <div className="inline-row">
        <div className="inline-label">¿Lo recomiendas?</div>
        <div className="inline-options">
          {["Sí", "No"].map((op) => (
            <button
              key={op}
              onClick={() => setRecomendado(op)}
              className={`btn ${recomendado === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="inline-row">
        <div className="inline-label">Asistencia a clase</div>
        <div className="inline-options">
          {["Obligatoria", "No obligatoria"].map((op) => (
            <button
              key={op}
              onClick={() => setAsistencia(op)}
              className={`btn ${asistencia === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="inline-row">
        <div className="inline-label">¿Qué nota obtuviste en este curso?</div>
        <div className="inline-options">
          {[...Array(10)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setNotaAlumno(i + 1)}
              className={`btn ${notaAlumno === i + 1 ? "selected" : ""}`}
            >
              {i + 1}
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
        ].map(({ label, emoji }) => (
          <button
            key={emoji}
            onClick={() => setCalificacion(emoji)}
            className={`emoji-btn ${emoji === emoji ? "selected" : ""}`}
          >
            <span className="emoji">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      <h2>¿Qué características destacarías del profesor?</h2>
      <div className="checkbox-group">
        {labelsEtiquetas.map((carac) => {
          const selected = caracteristicas.includes(carac.name);
          return (
            <button
              key={carac.label_id}
              className={`btn ${selected ? "selected" : ""}`}
              onClick={() => {
                setCaracteristicas((prev) =>
                  selected ? prev.filter((c) => c !== carac.name) : [...prev, carac.name]
                );
              }}
            >
              <input type="checkbox" checked={selected} readOnly />
              {carac.name}
            </button>
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
      <p>{300 - comentario.length} caracteres restantes</p>

      <h2>¿Quieres que tu calificación sea anónima?</h2>
      <div className="button-group">
        {["Sí", "No"].map((op) => (
          <button
            key={op}
            onClick={() => setAnonimo(op === "Sí")}
            className={`btn ${anonimo === (op === "Sí") ? "selected" : ""}`}
          >
            {op}
          </button>
        ))}
      </div>
      {errorMensaje && (
        <div className="error-message">
          {errorMensaje}
        </div>
      )}

      <button className="submit-btn" onClick={handleSubmit} disabled={enviando}>
        {enviando ? "Enviando..." : "Enviar evaluación"}
      </button>
    </div>
  );
};


export default Evaluacion;