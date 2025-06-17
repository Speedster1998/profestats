import styles from "./login.module.css";
import logo from "@/Images/logo.png";

const SigLogLayout = ({ title, subtitle, buttonText, footer, href, footer2, onSubmit }) => {
    
    const InputGroup = ({ type, placeholder, icon }) => {
        return(
            <div className={styles.inputGroup}>
                <input type={type} className={styles.input} placeholder={placeholder} /><i className={`bi bi-${icon} ${styles.icon}`}></i>
            </div>
        )
    }
    
    return (
    <section className={styles.section}>
        <img src={logo} alt="ProfeStats logo" className={styles.logo} />
        <h2 className={styles.title}>{title}</h2>
        {subtitle !== "" && <p className={styles.subtitle}>{subtitle}</p>}

        <form className={styles.form} onSubmit={onSubmit}>
            <InputGroup type="email" placeholder="Correo@universidad.edu" icon="envelope" />
            <InputGroup type="password" placeholder="Contraseña" icon="eye" />
            {subtitle !== "" && <InputGroup type="password" placeholder="Confirma tu contraseña" icon="eye" />}
            <button type="submit" className={styles.button}>{buttonText}</button>
        </form>
        <p className={styles.footerText}>{footer}{" "}<a href={href} className={styles.link}>{footer2}</a></p>
    </section>
    )
}

export default SigLogLayout