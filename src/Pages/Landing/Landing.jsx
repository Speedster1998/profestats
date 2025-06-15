import "./landing.css";
import profeLanding from "@/Images/profeLanding.png"

const Landing = () => {
    return (
    <section>
        <div className="text-section">
            <h1>
                <span className="highlight">CALIFICA</span> A TUS PROFESORES<br/>
                TU <span className="highlight">OPINIÓN</span> CUENTA
            </h1>
            <p>
                ¡Tu opinión cuenta y puede marcar la diferencia!<br/>
                ¿Tuviste un profesor increíble que hizo más fácil aprender? ¿O uno que podría mejorar su forma de enseñar?<br/>
                Calificar y comentar sobre tus profesores no solo te permite expresar tu experiencia, sino que también ayuda a cientos de estudiantes como tú a tomar mejores decisiones académicas.
            </p>
            <button className="register-button">REGISTRARSE<span className="arrow">→</span></button>
        </div>
        <div className="image-section">
            <img src={profeLanding} alt="Profesor" />
        </div>
        <div className="help-icon">
            <button className="help-button">?</button>
        </div>
    </section>
    )
}

export default Landing