import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import universitiesData from '../../data/Universidades.json';
import teachers_colleges from '../../data/teachers_colleges.json'

const FiltroGeneral = () => {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const universitiesHeads = universitiesData.map(x => {return {
      ...x,
      profesores_cantidad: teachers_colleges.filter(r => r.college_id === x.college_id).length
    }})
    setUniversities(universitiesHeads);
    setFilteredUniversities(universitiesHeads);
  }, []);

  useEffect(() => {
  filterUniversities();
}, [searchText, universities]);

  const updateSearchText = (e) => {
      setSearchText(e.target.value);
      filterUniversities()
  }

  const filterUniversities = () => {
    const filtered = universities.filter(u =>
      u.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUniversities(filtered);
  }

  return (
    <div className="container py-5">
        <div className="row">
            <div className="col-md-8">
      <h1 className="mb-4">
        <span style={{ color: '#43BF98'}}>Califica</span> <span className="text-light"> a tus profesores </span> 
      </h1>

      <div className="d-flex align-items-center px-3 py-2 rounded-pill mb-3" style={{ width: '100%', backgroundColor: '#43BF98'}}>
        <i className="bi bi-list text-white me-3" style={{ fontSize: '1.2rem' }}></i>
        <input
          type="text"
          className="form-control border-0 bg-transparent text-white"
          placeholder="Busca a tu profesor"
          style={{ boxShadow: 'none' }}
          value={searchText}
          onChange={updateSearchText}
        />
        <i className="bi bi-search text-white ms-3" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>
      </div>

      <div className="" style={{ maxHeight: '70vh' }}>
        {filteredUniversities.map((u) => (
          <button key={u.college_id} className="card mb-2 bg-transparent text-white border-success text-start w-100" style={{ border: '1px solid #198754' }} onClick={() => navigate(`/filtrouniversidad/${u.college_id}`)}>
            <div className="card-body d-flex align-items-center">
              <img src={u.image_url} alt={u.name} className="me-3 rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              <div>
                <h5 className="card-title mb-1">
                  {u.name.length > 50 ? u.name.slice(0, 30) + "..." : u.name}
                </h5>
                <p className="card-text text-light">{u.profesores_cantidad} profesores</p>
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