import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReviewItem from '../../Componentes/Perfil/ReviewItem';
import ProfileImage from '../../Componentes/Perfil/ProfileImage';
import './PerfilProfesor.css';
import Boton from '../../Componentes/Boton/Boton';
import { ControladorPerfilProfesor } from './ControladorPerfilProfesor';
const MAX_LENGTH = 150;

const PerfilProfesor = () => {
    const navigate = useNavigate();
    const { idTeacher } = useParams();
    const { teacherProfile: teacher, loading } = ControladorPerfilProfesor(parseInt(idTeacher));
        const [showFullDescription, setShowFullDescription] = useState(false);

    if (loading || !teacher) return <p className="text-center mt-5">Cargando...</p>;

     const toggleDescription = () => setShowFullDescription(prev => !prev);

    const getDescriptionText = () => {
        if (showFullDescription || teacher.description.length <= MAX_LENGTH) {
            return teacher.description;
        }
        return teacher.description.slice(0, MAX_LENGTH) + '...';
    };
    
    return (
        <div className="container profile-main">
            <div className="profile-card my-4 mx-auto">
                <div className="left-column">
                    <ProfileImage src={teacher.image} size={140} />
                    <h2 className="text-success fs-5">{teacher.name}</h2>
                </div>
                <div className="right-column">
                    <h3 className="text-success">Facilidad: {teacher.facilidad}</h3>
                    <h3 className="text-success">Calidad: {teacher.calidad}</h3>

                    <p>{getDescriptionText()}</p>
                    {teacher.description.length > MAX_LENGTH && (
                        <Boton
                            texto={showFullDescription ? 'Ver menos' : 'Ver más'}
                            width="150px"
                            height="40px"
                            onClick={toggleDescription}
                        />
                    )}
                </div>
            </div>

            <div className="profile-review my-4 mx-auto">
                <div className="section">
                    <h3 className="text-success fs-5">Universidad</h3>
                    <div className="chip-container">
                        {teacher.colleges.map(college => (
                            <span key={college.id} className="chip">{college.name}</span>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h3 className="text-success fs-5">Cursos</h3>
                    <div className="chip-container">
                        {teacher.courses.map((course, i) => (
                            <span key={i} className="chip">{course}</span>
                        ))}
                    </div>
                </div>

                <div className="section">
                    <h3 className="text-success fs-5">Etiquetas para profesor</h3>
                    <div className="chip-container">
                        {teacher.labels.map((label, i) => (
                            <span key={i} className="chip-labels">{label}</span>
                        ))}
                    </div>
                </div>

                <div className="my-4">
                    <Boton texto="Calificar profesor" onClick={() => navigate(`/rate-teacher/${idTeacher}`)} />
                </div>

                <div className="section">
                    <h3 className="text-success fs-5">Reseñas</h3>
                    {teacher.reviews.map((r, i) => (
                        <ReviewItem
                            key={i}
                            review={{
                                image: r.user.image_url || '/default-avatar.png',
                                username: r.user.username,
                                date: r.review.date,
                                course: r.courseName,
                                grade: r.review.calificacion_general,
                                comment: r.review.comment,
                                labels: r.labels,
                                emoji: r.emoji,
                                ratingLabel: '',
                            }}
                            showCourse={true}
                        />
                    ))}

                </div>
            </div>
        </div>
    );
};

export default PerfilProfesor;
