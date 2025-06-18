import { useNavigate } from 'react-router-dom';
import profeLanding from "@/Images/profeLanding.png";
import styles from "./landing.module.css";
import HeaderLanding from "@/Componentes/Header/HeaderLanding.jsx"

const Landing = () => {
    const navigate = useNavigate();

    const Registarse = () => {
        navigate('/signin')
    }

    return (
    <>
    <HeaderLanding onRegisterClick={Registarse}/>
    <section className={styles.section}>
        <div className={styles.textSection}>
            <h1>
                <span className={styles.highlight}>CALIFICA</span> A TUS PROFESORES<br/>
                TU <span className={styles.highlight}>OPINIÓN</span> CUENTA
            </h1>
            <p>
                ¡Tu opinión cuenta y puede marcar la diferencia!<br/>
                ¿Tuviste un profesor increíble que hizo más fácil aprender? ¿O uno que podría mejorar su forma de enseñar?<br/>
                Calificar y comentar sobre tus profesores no solo te permite expresar tu experiencia, sino que también ayuda a cientos de estudiantes como tú a tomar mejores decisiones académicas.
            </p>
            <button className={styles.registerButton} onClick={Registarse}>REGISTRARSE<span className={styles.arrow}>→</span></button>
        </div>
        <div className={styles.imageSection}>
            <img src={profeLanding} alt="Profesor" />
        </div>
        <div className={styles.helpIcon}>
            <button className={styles.helpButton}>?</button>
        </div>
    </section>
    </>
    )
}

export default Landing