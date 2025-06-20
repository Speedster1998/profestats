import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewItem from '../../Componentes/Perfil/ReviewItem';
import ProfileImage from '../../Componentes/Perfil/ProfileImage';
import './PerfilProfesor.css';
import Boton from '../../Componentes/Boton/Boton';
import { useControladorPerfilProfesor } from './ControladorPerfilProfesor';
import CriterioCirculo from '../../Componentes/Estadisticas/Grafico';

const MAX_LENGTH = 150;

const PerfilProfesor = ({ idTeacher }) => {
    const navigate = useNavigate();
    const { teacherProfile: teacher, loading, handleLike, handleDislike } = useControladorPerfilProfesor(idTeacher);
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (loading || !teacher) return <p className="text-center mt-5">Cargando...</p>;

    const toggleDescription = () => setShowFullDescription(prev => !prev);

    const getDescriptionText = () => {
        if (showFullDescription || teacher.description.length <= MAX_LENGTH) {
            return teacher.description;
        }
        return teacher.description.slice(0, MAX_LENGTH) + '...';
    };

    const mostrarNombreGrupo = (id) => {
        const nombres = {
            4: "Claridad",
            5: "Ayuda",
            6: "Puntualidad",
            7: "Uso de recursos",
            8: "Evaluación justa",
            9: "Feedback",
            10: "Actitud profesional",
            11: "Motivación"
        };
        return nombres[id] || `Grupo ${id}`;
    };

    return (
        <div className="container profile-main">
            <div className="profile-card my-4 mx-auto">
                <div className="left-column">
                    <ProfileImage src={teacher.image} size={140} />
                    <h2 className="text-white fs-5 fw-bold mt-4">{teacher.name}</h2>
                </div>
                <div className="right-column">
                    <h3 className="section-title fs-3">Dificultad: {teacher.facilidad}</h3>
                    <h3 className="section-title fs-3">Calidad: {teacher.calidad}</h3>

                    <p>{getDescriptionText()}</p>
                    {teacher.description.length > MAX_LENGTH && (
                        <div className="d-flex justify-content-center mt-3">
                            <Boton
                                texto={showFullDescription ? 'Ver menos' : 'Ver más'}
                                width="150px"
                                height="40px"
                                onClick={toggleDescription}
                            />
                        </div>
                    )}

                </div>
            </div>

            <div className="profile-review my-4 mx-auto">



                <div className="section">
                    <h3 className="section-title fs-5">Universidad</h3>
                    <div className="chip-container">
                        {teacher.colleges.map(college => (
                            <span key={college.id} className="chip">{college.name}</span>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h3 className="section-title fs-5">Cursos</h3>
                    <div className="chip-container">
                        {teacher.courses.map((course, i) => (
                            <span key={i} className="chip">{course}</span>
                        ))}
                    </div>
                </div>

                {teacher.groupAverages && teacher.groupAverages.length > 0 && (
                    <div className="section">
                        <h3 className="section-title fs-5">Estadisticas</h3>
                        <div className="d-flex flex-wrap justify-content-center">
                            {teacher.groupAverages.map(avg => (
                                <CriterioCirculo
                                    key={avg.group_id}
                                    nombre={mostrarNombreGrupo(avg.group_id)}
                                    valor={avg.promedio}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="section">
                    <h3 className="section-title fs-5">Etiquetas para profesor</h3>
                    <div className="chip-container">
                        {teacher.labels.map((label, i) => (
                            <span key={i} className="chip-labels">{label.name} ({label.count})</span>
                        ))}

                    </div>
                </div>

               <Boton
  texto="Calificar profesor"
  onClick={() =>
    navigate(`/evaluacion/${idTeacher}`, {
      state: { collegeId: teacher.colleges[0]?.id } // Usa el primer college asociado
    })
  }
/>


                <hr className="dashed" />

                <div className="section">
                    <h3 className="section-title fs-5">Reseñas</h3>
                    {teacher.reviews.map((r, i) => (
                        <ReviewItem
                            key={i}
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PerfilProfesor;
