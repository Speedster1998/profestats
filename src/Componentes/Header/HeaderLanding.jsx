import { useNavigate } from 'react-router-dom';
import HeaderBase from './HeaderBase.jsx';
import styles from "./Header.module.scss";

const HeaderLanding = ({ onRegisterClick }) => {
  const navigate = useNavigate();

  const IniciarSesion = () => {
    navigate('/login')
  }

  return (
    <HeaderBase>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "30px", width: "100%" }}>
        <button className={styles.registerBtn} onClick={onRegisterClick}>REGISTRARSE</button>
        <button className={styles.logoutBtn} onClick={IniciarSesion}>INICIAR SESIÓN</button>
      </div>
    </HeaderBase>
  );
};

export default HeaderLanding;