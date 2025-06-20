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

        <div className='container'>
            <div className='row align-items-center min-vh-100'>
                <div className='col-md-6 text-light'>
                    <h1 style={{fontSize:45}}>
                        <span className={styles.highlight}>CALIFICA</span> A TUS PROFESORES<br/>
                        TU <span className={styles.highlight}>OPINIÓN</span> CUENTA
                    </h1>
                    <p>
                        ¡Tu opinión cuenta y puede marcar la diferencia!<br/>
                        ¿Tuviste un profesor increíble que hizo más fácil aprender? ¿O uno que podría mejorar su forma de enseñar?<br/>
                        Calificar y comentar sobre tus profesores no solo te permite expresar tu experiencia, sino que también ayuda a cientos de estudiantes como tú a tomar mejores decisiones académicas.
                    </p>
                    <button className={styles.logoutBtn} onClick={Registarse}>REGISTRARSE<span className={styles.arrow}>→</span></button>
                </div>
                <div className='col-md-1'></div>
                <div className='col-md-4'>
                <div className={styles.imageSection}>
                    <img src={profeLanding} alt="Profesor"/>
                </div>
                </div>
                {<div className={styles.helpIcon}>
                    <button className={styles.helpButton}>?</button>
                </div>}
            </div>
        </div>
    </>
    )
}

export default Landing