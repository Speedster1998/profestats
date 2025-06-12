import React, { useEffect, useState } from "react";
import universitiesData from '../../data/Universidades.json';

const profesores = [
  { nombre: 'Ana Lopez', calificaciones: 300000, imagen: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { nombre: 'Luis Hernandez', calificaciones: 300000, imagen: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { nombre: 'Susan Quiroz', calificaciones: 300000, imagen: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { nombre: 'Ana Lopez', calificaciones: 300000, imagen: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { nombre: 'Luis Hernandez', calificaciones: 300000, imagen: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { nombre: 'Ana Lopez', calificaciones: 300000, imagen: 'https://randomuser.me/api/portraits/women/1.jpg' },
];


const FiltroComponente = ({id}) => {
    
    const [uniersity, setUniversity] = useState({});

    useEffect(() => {
        const foundUniversity = universitiesData.find(u => u.college_id === id);
  setUniversity(foundUniversity);
    }, []);

    return <div className="container py-4 text-white">
      <div className="mb-4">
        <h3 className="text-white">
          <img src={uniersity.image_url} alt="Logo" height="30" className="me-2" />
          {uniersity.name}
        </h3>
      </div>

      <div className="input-group mb-3">
        <button className="btn btn-success">
          <i className="bi bi-list"></i>
        </button>
        <input type="text" className="form-control" placeholder="Busca a tu profesor" />
        <button className="btn btn-success">
          <i className="bi bi-search"></i>
        </button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Facultad</option>
        </select>
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Ciclo</option>
        </select>
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Habilidades</option>
        </select>
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Cursos</option>
        </select>
      </div>

      {profesores.map((profesor, index) => (
        <div key={index} className="d-flex align-items-center border rounded mb-2 p-2" style={{ borderColor: '#28a745' }}>
          <img src={profesor.imagen} alt={profesor.nombre} className="rounded-circle me-3" width="50" height="50" />
          <div>
            <div className="fw-bold text-white">{profesor.nombre.length > 15 ? profesor.nombre.slice(0, 15) + '...' : profesor.nombre}</div>
            <div className="text-muted">{profesor.calificaciones.toLocaleString()} calificaciones</div>
          </div>
        </div>
      ))}
    </div>
}

export default FiltroComponente