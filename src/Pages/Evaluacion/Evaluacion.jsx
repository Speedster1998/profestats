import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const reviewToEdit = location.state?.review;
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
  const [labelsDinamicas, setLabelsDinamicas] = useState([]);
  const [preguntasCaracteristicas, setPreguntaCaracteristicas] = useState([]);
  const [labelsCaracteristicas, setLabelsCaracteristicas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [notaAlumno, setNotaAlumno] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [faltantes, setFaltantes] = useState([]);
  const [erroresCampos, setErroresCampos] = useState({});

  useEffect(() => {
    const cargarPreguntas = async () => {
      const data = await loadQuestionsWithLabels();

      // Preguntas (grupos 4 al 11)
      const preguntasGenerales = data.filter(
        (p) => p.group_id >= 4 && p.group_id <= 11
      );
      setPreguntasDinamicas(preguntasGenerales);

      // Características (grupo 21)
      const preguntaCaracteristicas = data.find((p) => p.group_id === 21);
      setPreguntaCaracteristicas(preguntaCaracteristicas);

      // Todas las etiquetas disponibles
      const etiquetas = data.flatMap((p) => p.labels || []);
      setLabelsDinamicas(etiquetas);
      console.log("Etiquetas dinámicas cargadas:", etiquetas);
    };
    cargarPreguntas();
  }, []);

  useEffect(() => {
    if (reviewToEdit && preguntasDinamicas.length > 0 && labelsDinamicas.length > 0) {

      setCurso(reviewToEdit.course);
      setFacilidad(reviewToEdit.facilidad);
      setRecomendado(reviewToEdit.recomendado);
      setAsistencia(reviewToEdit.asistencia);
      setCalificacion(reviewToEdit.emoji);
      setComentario(reviewToEdit.comment);
      setAnonimo(reviewToEdit.anonimo);
      setNotaAlumno(reviewToEdit.nota);
      setCaracteristicas(
        reviewToEdit.labels
          .filter((l) => l.group_id === 21)
          .map((l) => l.name)
      );

      const dinamicas = {};
      preguntasDinamicas.forEach((pregunta) => {
        const labelSeleccionado = reviewToEdit.labels.find(
          (l) => l.group_id === pregunta.group_id
        );
        if (labelSeleccionado) {
          const labelsDelGrupo = labelsDinamicas.filter(
            (l) => l.group_id === pregunta.group_id
          );

          const index = labelsDelGrupo.findIndex(
            (l) => parseInt(l.label_id) === parseInt(labelSeleccionado.label_id)
          );

          if (index !== -1) {
            dinamicas[pregunta.group_id] = index + 1;
          }
        }
      });
      setRespuestas(dinamicas);

      console.log("Preguntas dinámicas cargadas:", preguntasDinamicas);
      console.log("Etiquetas dinámicas cargadas:", labelsDinamicas);
      console.log("Review a editar:", reviewToEdit);

    }
  }, [reviewToEdit, preguntasDinamicas, labelsDinamicas]);


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


  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    preguntasDinamicas.forEach((p) => {
      if (!respuestas[p.group_id]) {
        nuevosErrores[`pregunta_${p.group_id}`] = true;
      }
    });

    if (!curso) nuevosErrores.curso = true;
    if (!facilidad) nuevosErrores.facilidad = true;
    if (!recomendado) nuevosErrores.recomendado = true;
    if (!asistencia) nuevosErrores.asistencia = true;
    if (!notaAlumno) nuevosErrores.notaAlumno = true;
    if (!emoji) nuevosErrores.emoji = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresCampos(nuevosErrores);
      return setErrorMensaje("Por favor, completa todos los campos obligatorios.");
    }

    setErroresCampos({});
    setFaltantes([]);


    if (!cursosDelProfesor.some((c) => c.name === curso)) {
      return setErrorMensaje("El curso seleccionado no pertenece al profesor.");
    }

    // Labels de las respuestas de preguntas generales (Likert)
    const dinamicasLabels = Object.entries(respuestas).map(([group_id, index]) => {
      const labelsDelGrupo = labelsDinamicas.filter(
        (l) => l.group_id === parseInt(group_id)
      );
      return labelsDelGrupo[index - 1]?.label_id;
    }).filter(Boolean);

    // Labels de características seleccionadas (checkboxes)
    const caracteristicasLabels = labels
      .filter((l) => l.group_id === 21 && caracteristicas.includes(l.name))
      .map((l) => l.label_id);

    console.log("Respuestas:", respuestas);
    console.log("Labels dinámicas disponibles:", labelsDinamicas);
    console.log("Label IDs seleccionadas:", dinamicasLabels);

    const promedioPreguntas = calcularPromedioDinamico();

    const reviewData = {
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

    const labelIds = [...dinamicasLabels, ...caracteristicasLabels];

    setEnviando(true);
    if (reviewToEdit) {
      await ReviewService.updateReview(reviewToEdit.review_id, reviewData, labelIds);

    } else {
      await ReviewService.addReview(reviewData, labelIds);
    }
    setEnviando(false);
    console.log("¡Gracias por tu evaluación!");
    if (reviewToEdit) {
      if (location.state?.fromPerfil) {
        navigate(-1);
        return;
      }
    }
    const collegeId = location.state?.collegeId;

    if (!collegeId) {
      console.error("No se pudo obtener el collegeId desde location.state");
      return;
    }


    navigate(`/filtrouniversidad/${collegeId}`, {
      state: { teacher_id: parsedProfesorId }
    });


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

      <h2>Elige tu curso</h2>
      <select
        value={curso}
        onChange={(e) => {
          setCurso(e.target.value);
          setErroresCampos((prev) => {
            const nuevos = { ...prev };
            delete nuevos.curso;
            return nuevos;
          });
        }}
        className={`select mb-2 ${erroresCampos.curso ? 'border border-danger' : ''}`}
        disabled={cursosDelProfesor.length === 0}
      >
        <option value="">Selecciona un curso</option>
        {cursosDelProfesor.map((c) => (
          <option key={c.course_id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      {erroresCampos.curso && <div className="invalid-feedback">Selecciona un curso.</div>}


      <h2>Contesta las siguientes preguntas</h2>
      {preguntasDinamicas.map((pregunta) => {
        const selectedValue = respuestas[pregunta.group_id];
        const labelsDelGrupo = labels.filter((l) => l.group_id === pregunta.group_id);
        const labelSeleccionado = labelsDelGrupo[selectedValue - 1];
        const errorClave = `pregunta_${pregunta.group_id}`;

        const hayError = erroresCampos[errorClave];

        return (
          <div
            key={pregunta.group_id}
            className={`likert-row rounded p-3 mb-3 ${hayError ? "border border-danger" : ""}`}
          >
            <div className="likert-label">{pregunta.text}</div>
            <div className="likert-options">
              {[1, 2, 3, 4, 5].map((valor) => (
                <button
                  key={valor}
                  onClick={() => {
                    setRespuestas((prev) => ({ ...prev, [pregunta.group_id]: valor }));
                    setErroresCampos((prev) => {
                      const nuevos = { ...prev };
                      delete nuevos[`pregunta_${pregunta.group_id}`];
                      return nuevos;
                    });
                  }}

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
            {hayError && (
              <div className="text-danger mt-2">Por favor, responde esta pregunta.</div>
            )}
          </div>
        );
      })}

      <div className={`likert-row rounded p-3 mb-3 ${erroresCampos.facilidad ? "border border-danger" : ""}`}>
        <div className="likert-label">¿Qué tan fácil fue el curso?</div>
        <div className="likert-options">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => {
                setFacilidad((prev) => (prev === n ? null : n));
                setErroresCampos((prev) => {
                  const nuevos = { ...prev };
                  delete nuevos.facilidad;
                  return nuevos;
                });
              }}

              className={`btn ${facilidad === n ? "selected" : ""}`}
            >
              {n}
            </button>
          ))}
        </div>
        {erroresCampos.facilidad && (
          <div className="text-danger mt-2">Selecciona una opción de facilidad.</div>
        )}
      </div>


      <div className={`inline-row rounded p-3 mb-3 ${erroresCampos.asistencia ? "border border-danger" : ""}`}>
        <div className="inline-label">¿La asistencia fue obligatoria?</div>
        <div className="inline-options">
          {["Obligatoria", "No obligatoria"].map((op) => (
            <button
              key={op}
              onClick={() => {
                setAsistencia((prev) => (prev === op ? null : op));
                setErroresCampos((prev) => {
                  const nuevos = { ...prev };
                  delete nuevos.asistencia;
                  return nuevos;
                });
              }}

              className={`btn ${asistencia === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
        {erroresCampos.asistencia && (
          <div className="text-danger mt-2">Selecciona si la asistencia fue obligatoria.</div>
        )}
      </div>

      <div className={`inline-row rounded p-3 mb-3 ${erroresCampos.recomendado ? "border border-danger" : ""}`}>
        <div className="inline-label">¿Recomiendas al profesor?</div>
        <div className="inline-options">
          {["Sí", "No"].map((op) => (
            <button
              key={op}
              onClick={() => {
                setRecomendado((prev) => (prev === op ? null : op));
                setErroresCampos((prev) => {
                  const nuevos = { ...prev };
                  delete nuevos.recomendado;
                  return nuevos;
                });
              }}

              className={`btn ${recomendado === op ? "selected" : ""}`}
            >
              {op}
            </button>
          ))}
        </div>
        {erroresCampos.recomendado && (
          <div className="text-danger mt-2">Indica si recomiendas al profesor.</div>
        )}
      </div>


      <div className={`inline-row rounded p-3 mb-3 ${erroresCampos.notaAlumno ? "border border-danger" : ""}`}>
        <div className="inline-label">¿Qué nota obtuviste en este curso?</div>
        <div className="inline-options">
          {[...Array(10)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                setNotaAlumno((prev) => (prev === i + 1 ? null : i + 1));
                setErroresCampos((prev) => {
                  const nuevos = { ...prev };
                  delete nuevos.notaAlumno;
                  return nuevos;
                });
              }}

              className={`btn ${notaAlumno === i + 1 ? "selected" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {erroresCampos.notaAlumno && (
          <div className="text-danger mt-2">Selecciona la nota que obtuviste.</div>
        )}
      </div>

      <h2>¿Qué calificación le das al profesor?</h2>
      <div className={`emoji-group rounded p-3 mb-3 ${erroresCampos.emoji ? "border border-danger" : ""}`}>

        <div className="emoji-group">
          {[
            { label: "Mala", emoji: "🙁" },
            { label: "Regular", emoji: "😐" },
            { label: "Buena", emoji: "😃" },
            { label: "Excelente", emoji: "🤩" },
          ].map(({ label, emoji: emojiOption }) => (
            <button
              key={emojiOption}
              onClick={() => {
                setCalificacion((prev) => (prev === emojiOption ? "" : emojiOption));
                setErroresCampos((prev) => {
                  const nuevos = { ...prev };
                  delete nuevos.emoji;
                  return nuevos;
                });
              }}
              className={`emoji-btn ${emoji === emojiOption ? "selected" : ""}`}
            >
              <span className="emoji">{emojiOption}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        {erroresCampos.emoji && (
          <div className="text-danger mt-2">Selecciona la calificación.</div>
        )}
      </div>

      <h2>{preguntasCaracteristicas?.text}</h2>
      <div className="checkbox-group">
        {labels
          .filter((l) => l.group_id === 21)
          .map((carac) => {
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
                <input type="checkbox" checked={selected} readOnly />
                {carac.name}
              </button>
            );
          })}
      </div>

      <h2>Añade un comentario (opcional)</h2>
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

      <div className="d-flex justify-content-center">

        <button className="btn-primary" style={{ height: '65px' }} onClick={handleSubmit} disabled={enviando}>
          {reviewToEdit ? 'Actualizar Reseña' : 'Enviar Reseña'}
        </button>
      </div>

    </div>
  );
};

export default Evaluacion;