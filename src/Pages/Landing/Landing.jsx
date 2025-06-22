import { useNavigate } from 'react-router-dom';
import profeLanding from "@/Images/profeLanding.png";
import styles from "./landing.module.css";
import HeaderLanding from "@/Componentes/Header/HeaderLanding.jsx";

const Landing = () => {
    const navigate = useNavigate();

    const Registarse = () => {
        navigate('/signin');
    };

    return (
        <>
            <HeaderLanding onRegisterClick={Registarse} />

            <div className="container">
                <div className="row align-items-center min-vh-100 text-center text-md-start">
                    <div className="col-12 col-md-6 text-light">
                        <h1 className={styles.title}>
                            <span className={styles.highlight}>CALIFICA</span> A TUS PROFESORES<br />
                            TU <span className={styles.highlight}>OPINIÓN</span> CUENTA
                        </h1>
                        <p className={styles.description}>
                            ¡Tu opinión cuenta y puede marcar la diferencia!<br />
                            ¿Tuviste un profesor increíble que hizo más fácil aprender? ¿O uno que podría mejorar su forma de enseñar?<br />
                            Calificar y comentar sobre tus profesores no solo te permite expresar tu experiencia, sino que también ayuda a cientos de estudiantes como tú a tomar mejores decisiones académicas.
                        </p>
                        <button className={styles.logoutBtn} onClick={Registarse}>
                            REGISTRARSE<span className={styles.arrow}>→</span>
                        </button>
                    </div>

                    <div className="col-12 col-md-1 d-none d-md-block"></div>

                    <div className="col-12 col-md-5 mt-4 mt-md-0 d-flex justify-content-center">
                        <div className={styles.imageSection}>
                            <img src={profeLanding} alt="Profesor" />
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.helpIcon}>
                <button className={styles.helpButton}>?</button>
            </div>
        </>
    );
};

export default Landing;
