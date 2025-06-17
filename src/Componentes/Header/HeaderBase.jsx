import styles from "./Header.module.scss";
import logo from "../../Images/logo.png";

const HeaderBase = ({ children }) => {

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="ProfeStats logo" className={styles.logo} />
        <span className={styles.brandName}>
          <span className={styles.brandLight}>Profe</span>
          <span className={styles.brandBold}>Stats</span>
        </span>
      </div>
      {children}
    </header>
  );
};

export default HeaderBase;