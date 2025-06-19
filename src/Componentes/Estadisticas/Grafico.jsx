import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const CriterioCirculo = ({ nombre, valor }) => {
  const porcentaje = (valor / 5) * 100;

  const getColor = (valor) => {
    if (valor >= 4) return "#4caf50";
    if (valor >= 3) return "#ffc107";
    return "#f44336"; 
  };

  return (
    <div style={{ width: 65, margin: 11, textAlign: 'center' }}>
      <CircularProgressbar
        value={porcentaje}
        text={`${valor.toFixed(1)}%`}
        styles={buildStyles({
          pathColor: getColor(valor),
          textColor: "#f8f5f5",
          trailColor: "#eee",
        })}
      />
      <div style={{ marginTop: 5, fontSize: 14 }}>{nombre}</div>
    </div>
  );
};

export default CriterioCirculo;
