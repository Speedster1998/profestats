import { useNavigate } from "react-router-dom";
import FondoDecorativo from "../../Componentes/Fondo/Fondo";
import "./Error.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <FondoDecorativo>
      <div className="error-cute-container">
        <div className="error-face">
          <svg width="140" height="110" viewBox="0 0 140 110" xmlns="http://www.w3.org/2000/svg">
            {/* Ojos blancos */}
            <ellipse cx="47" cy="45" rx="18" ry="22" fill="white" />
            <ellipse cx="93" cy="45" rx="18" ry="22" fill="white" />
            
            {/* Pupilas */}
            <circle cx="47" cy="45" r="6" fill="#0e1e1b" />
            <circle cx="93" cy="45" r="6" fill="#0e1e1b" />

            {/* Sonrisa tipo onda centrada */}
            <path 
              d="M40 80 
                Q45 75 50 80 
                Q55 85 60 80 
                Q65 75 70 80 
                Q75 85 80 80 
                Q85 75 90 80"
              stroke="#ccc" 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round" 
            />

            {/* Cejas */}
            <path d="M35 20 Q45 10 55 20" stroke="#ccc" strokeWidth="3" fill="none" />
            <path d="M85 20 Q95 10 105 20" stroke="#ccc" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h1>404: La página no existe,<br />pero está en nuestro corazón</h1>
        <button className="btn-cute" onClick={() => navigate("/filtrogeneral")}>
          Volver al inicio
        </button>
      </div>
    </FondoDecorativo>
  );
};

export default ErrorPage;
