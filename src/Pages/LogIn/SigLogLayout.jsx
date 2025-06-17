import styles from "./login.module.css";
import logo from "@/Images/logo.png";

const SigLogLayout = ({
    title,
    subtitle,
    buttonText,
    footer,
    href,
    footer2,
    onSubmit,
    emailText,
    setEmail,
    passwordText,
    setPassword,
    repeatPassword,
    setRepeat,
    username,
    setUsername,
    warningText = ''
}) => {
    const InputGroup = ({ type, placeholder, icon, value, onChange }) => (
        <div className={styles.inputGroup}>
            <input
                type={type}
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            <i className={`bi bi-${icon} ${styles.icon}`}></i>
        </div>
    );

    return (
        <section className={styles.section}>
            <img src={logo} alt="ProfeStats logo" className={styles.logo} />
            <h2 className={styles.title}>{title}</h2>
            {subtitle !== "" && <p className={styles.subtitle}>{subtitle}</p>}

            <form className={styles.form} onSubmit={onSubmit}>
                {subtitle !== "" && (
                    <div className={styles.inputGroup}>
            <input
                type="text"
                className={styles.input}
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <i className={`bi bi-person ${styles.icon}`}></i>
        </div>
                )}
                <div className={styles.inputGroup}>
            <input
                type="email"
                className={styles.input}
                placeholder="Correo@universidad.edu"
                value={emailText}
                onChange={(e) => setEmail(e.target.value)}
            />
            <i className={`bi bi-envelope ${styles.icon}`}></i>
        </div>
                <div className={styles.inputGroup}>
            <input
                type="password"
                className={styles.input}
                placeholder="Contraseña"
                value={passwordText}
                onChange={(e) => setPassword(e.target.value)}
            />
            <i className={`bi bi-eye ${styles.icon}`}></i>
        </div>
                {subtitle !== "" && (
                    <div className={styles.inputGroup}>
            <input
                type="password"
                className={styles.input}
                placeholder="Confirma tu contraseña"
                value={repeatPassword}
                onChange={(e) => setRepeat(e.target.value)}
            />
            <i className={`bi bi-repeat ${styles.icon}`}></i>
        </div>
                )}
                {warningText !== '' ? <div className="alert alert-danger mb-0">{warningText}</div> : <></>}
                <button type="submit" className={styles.button}>{buttonText}</button>
            </form>

            <p className={styles.footerText}>
                {footer} <a href={href} className={styles.link}>{footer2}</a>
            </p>
        </section>
    );
};

export default SigLogLayout