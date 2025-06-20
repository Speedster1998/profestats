import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBase from './HeaderBase.jsx';
import styles from "./Header.module.scss";
import { BiMenu, BiX } from 'react-icons/bi';

const Header = ({ logOut }) => {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const CerrarSesion = () => {
    localStorage.setItem("logged", "false");
    logOut(); 
    navigate('/');
  };

  return (
    <HeaderBase>
      {/* CENTRO - Solo en desktop */}
      <div className={styles.center}>
        <a href="/filtrogeneral">BUSCAR</a>
        <a href="/perfil">PERFIL</a>
      </div>

      {/* DERECHA: Hamburguesa (mobile) + Cerrar sesión (desktop) */}
      <div className={styles.right}>
        {/* Botón cerrar sesión visible solo en desktop */}
        <button className={styles.logoutBtn} onClick={CerrarSesion}>
          CERRAR SESIÓN
        </button>

        {/* Hamburguesa solo en mobile */}
        <div className={styles.hamburguesa} onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? <BiX size={28} /> : <BiMenu size={28} />}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div className={`${styles.menuMobile} ${menuAbierto ? styles.menuVisible : ''}`}>
        <a href="/filtrogeneral" onClick={() => setMenuAbierto(false)}>BUSCAR</a>
        <a href="/perfil" onClick={() => setMenuAbierto(false)}>PERFIL</a>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            setMenuAbierto(false);
            CerrarSesion();
          }}
        >
          CERRAR SESIÓN
        </button>

      </div>
    </HeaderBase>
  );
};

export default Header;
