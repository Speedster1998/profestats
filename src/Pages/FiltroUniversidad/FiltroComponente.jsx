import React, { useEffect, useState } from "react";
import universitiesData from '../../data/Universidades.json';
import teacher_colleges from '../../data/teachers_colleges.json'
import teachersData from '../../data/Profesores.json'
import coursesData from '../../data/Cursos.json'
import facultyData from '../../data/Facultad.json'
import labelData from '../../data/labels.json'

const FiltroComponente = ({id, changeTeacherId}) => {
    
    const [uniersity, setUniversity] = useState({});
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [labels, setLabels] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const foundUniversity = universitiesData.find(u => u.college_id === id);
  setUniversity(foundUniversity);
        const teachers_ids = teacher_colleges.filter(u => u.college_id === id).map(t => teachersData.find(x => x.teacher_id === t.teacher_id))
        
        setTeachers(teachers_ids)
        setLabels(labelData.filter(x => x.label_id>4))
        setCourses(coursesData)
        setFaculties(facultyData.filter(x => x.college_id === id))
        console.log(labels)
        

        //Asginar primer perfil de profesor
        changeTeacherId(teachers_ids[0].teacher_id)
    }, []);

    const updateSearchText = (e) => {
      setSearchText(e.target.value);
    }

    return <div className="container py-4 text-white">
      <div className="mb-4">
        <h3 className="text-white">
          <img src={uniersity.image_url} alt="Logo" height="30" className="me-2" />
          {uniersity.name}
        </h3>
      </div>

      <div className="d-flex align-items-center px-3 py-2 rounded-pill mb-3" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#43BF98'}}>
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

      <div className="d-flex flex-wrap gap-2 mb-4">
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Facultad</option>
          {faculties.map((facultie,index) => (
            <option>{facultie.name}</option>
          ))}
        </select>
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Ciclo</option>
          {[1,2,3,4,5,6,7,8,9,10].map(x => <option>{x}</option>)}
        </select>
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Habilidades</option>
          {labels.map((label, index) => (
            <option key={index}>{label.name}</option>
          ))}
        </select>
        <select className="form-select bg-dark text-white" style={{ width: '48%' }}>
          <option>Cursos</option>
          {courses.map((course,index) => (
            <option key={index}>{course.name}</option>
          ))}
        </select>
      </div>

      {teachers.map((profesor, index) => (
        <button
          key={index}
          onClick={() => changeTeacherId(profesor.teacher_id)}
          className="d-flex align-items-center border rounded mb-2 p-2 w-100 text-start"
          style={{ borderColor: '#28a745', background: 'transparent', borderWidth: '1px', cursor: 'pointer' }}
        >
          <img
            src={profesor.image_url}
            alt={profesor.name}
            className="rounded-circle me-3"
            width="50"
            height="50"
          />
          <div>
            <div className="fw-bold text-white">
              {profesor.name.length > 15 ? profesor.name.slice(0, 15) + '...' : profesor.name}
            </div>
            <div className="text-light">{120} calificaciones</div>
          </div>
        </button>
      ))}
    </div>
}

export default FiltroComponente