import { useNavigate } from 'react-router-dom';
import HeaderBase from './HeaderBase.jsx';
import styles from "./Header.module.scss";

const Header = () => {
  const navigate = useNavigate();

  const CerrarSesion = () => {
    localStorage.setItem("logged", "false");
    navigate('/')
    
  }

  return (
    <HeaderBase>
      <nav className={styles.nav}>
        <a href="/filtrogeneral">BUSCAR</a>
        <a href="/perfil">PERFIL</a>
      </nav>
      <button className={styles.logoutBtn} onClick={CerrarSesion}>CERRAR SESIÓN</button>
    </HeaderBase>
  );
};

export default Header;