import "./Fondo.css";

const Fondo = ({ children }) => {
  return (
    <div className="fondo-wrapper">
      <div className="fondo-decorativo">
        {children}
      </div>
    </div>
  );
};

export default Fondo;

