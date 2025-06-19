// src/components/ui/Modal/Modal.js
import React from "react";
import "./Modal.css"; // opcional: para estilizar o fundo e conteúdo

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-body">
        {children}
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Modal;