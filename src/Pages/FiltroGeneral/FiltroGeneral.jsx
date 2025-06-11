import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import universitiesData from '../../data/Universidades.json';

const FiltroGeneral = () => {
  const [universities, setUniversities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  setUniversities(universitiesData);
}, []);

  return (
    <div className="container py-5">
        <div className="row">
            <div className="col-md-8">
      <h1 className="mb-4">
        <span className="text-success">Califica</span> <span className="text-light"> a tus profesores </span> 
      </h1>

      <div className="input-group mb-4">
        <span className="input-group-text bg-success border-0">
          <i className="bi bi-list"></i>
        </span>
        <input
          type="text"
          className="form-control bg-success text-white border-0"
          placeholder="Busca universidad"
        />
        <button className="btn btn-success">
          <i className="bi bi-search"></i>
        </button>
      </div>

      <div className="overflow-auto" style={{ maxHeight: '70vh' }}>
        {universities.map((u) => (
          <button key={u.college_id} className="card mb-2 bg-transparent text-white border-success text-start w-100" style={{ border: '1px solid #198754' }} onClick={() => navigate(`/filtrouniversidad/${u.college_id}`)}>
            <div className="card-body d-flex align-items-center">
              <img src={u.image_url} alt={u.name} className="me-3 rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              <div>
                <h5 className="card-title mb-1">
                  {u.name.length > 50 ? u.name.slice(0, 30) + "..." : u.name}
                </h5>
                <p className="card-text text-light">{u.teachers_amount} profesores</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      </div>
      </div>
    </div>
  );
}

export default FiltroGeneral