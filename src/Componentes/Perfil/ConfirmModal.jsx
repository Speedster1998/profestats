import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
  if (!show) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h5>Confirmar eliminación</h5>
          <button className="btn-close" onClick={onCancel}></button>
        </div>
        <div className="custom-modal-body">
          <p>{message}</p>
        </div>
        <div className="custom-modal-footer">
          <button className="editar cancelar" onClick={onCancel}>Cancelar</button>
          <button className="editar eliminar" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
