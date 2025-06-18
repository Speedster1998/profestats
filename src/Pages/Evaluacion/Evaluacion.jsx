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

  const [curso, setCurso] = useState("");
  const [facilidad, setFacilidad] = useState(null);
  const [recomendado, setRecomendado] = useState(null);
  const [asistencia, setAsistencia] = useState(null);
  const [emoji, setCalificacion] = useState("");
  const [comentario, setComentario] = useState("");
  const [anonimo, setAnonimo] = useState(null);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [preguntasDinamicas, setPreguntasDinamicas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const labelsEtiquetas = labels.filter(label => label.group_id === 21);
  const [notaAlumno, setNotaAlumno] = useState(null);

  useEffect(() => {
    const cargarPreguntas = async () => {
      const data = await loadQuestionsWithLabels();
      console.log("Preguntas dinámicas cargadas:", data);
      setPreguntasDinamicas(data);
    };
    cargarPreguntas();
  }, []);

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


  const handleSubmit = (e) => {
    e.preventDefault();

    const cursoValido = cursosDelProfesor.some((c) => c.name === curso);
    if (!cursoValido) {
      alert("El curso seleccionado no pertenece al profesor.");
      return;
    }

    const promedioPreguntas = calcularPromedioDinamico();

    const usuario = anonimo
      ? {
        user_id: 1,
        username: "Alumno",
        email: "alumno@aloe.ulima.edu.pe",
        password: "123456",
        college_id: 1,
        image_url: require("../../Images/profileDefault.png")
      }
      : {
        user_id: 1,
        username: "Usuario Actual",
        email: "usuario@ulima.edu.pe",
        image_url: "https://cris.ulima.edu.pe/files-asset/40822754/EEscobedo.jpg?w=320&f=webp"
      };

    const datos = {
      user_id: usuario.user_id,
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

    ReviewService.addReview(datos, allLabelIds);
     
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
  };

  return (
    <div className="evaluacion-container">

      <h6>Evaluando a: {profesor.name}</h6>
      <br />
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


      {preguntasDinamicas.map((pregunta) => {
        const selectedValue = respuestas[pregunta.group_id];
        const labelsDelGrupo = labels.filter((l) => l.group_id === pregunta.group_id);
        const labelSeleccionado = labelsDelGrupo[selectedValue - 1];

        return (
          <div key={pregunta.group_id} className="likert-row">
            <div className="likert-label">{pregunta.text}</div>
            <div className="likert-options">
              {[1, 2, 3, 4, 5].map((valor, i) => (
                <button
                  key={valor}
                  onClick={() =>
                    setRespuestas((prev) => ({
                      ...prev,
                      [pregunta.group_id]: valor,
                    }))
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

      {/* Facilidad */}
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

      {/* Recomienda */}
      <div className="inline-row">
        <div className="inline-label">¿Lo recomiendas?</div>
        <div className="inline-options">
          {["Sí", "No"].map((op, i) => (
            <button
              key={i}
              onClick={() => setRecomendado(op)}
              className={`btn ${recomendado === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      {/* Asistencia */}
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
      
       {/* Nota */}
      <div className="inline-row">
        <div className="inline-label">¿Qué nota obtuviste en este curso?</div>
        <div className="inline-options">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => setNotaAlumno(n)}
              className={`btn ${notaAlumno === n ? "selected" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Emoji rating */}
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
            onClick={() => setCalificacion(emoji)}
            className={`emoji-btn ${emoji === emoji ? "selected" : ""}`}
          >
            <span className="emoji">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Características */}
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
                  selected
                    ? prev.filter((c) => c !== carac.name)
                    : [...prev, carac.name]
                );
              }}
            >
              <input
                type="checkbox"
                value={carac.name}
                checked={selected}
                readOnly
              />
              {carac.name}
            </button>
          );
        })}
      </div>

      {/* Comentario */}
      <h2>Añadir un comentario (opcional)</h2>
      <textarea
        className="textarea"
        placeholder="Escribe un comentario..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        maxLength={300}
      />

      {/* Anonimato */}
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