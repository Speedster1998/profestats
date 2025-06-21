import React, { useEffect, useState } from "react";
import universitiesData from '../../data/Universidades.json';
import teacher_colleges from '../../data/teachers_colleges.json'
import teacher_courses from '../../data/Relacion_Profesor_Curso.json'
import teachersData from '../../data/Profesores.json'
import coursesData from '../../data/Cursos.json'
import facultyData from '../../data/Facultad.json'
import labelData from '../../data/PreguntasContenido.json'
import reviews from '../../data/Resena.json';
import review_labels from '../../data/review_labels.json';
import BackButton from "./BackButton";

const FiltroComponente = ({ id, changeTeacherId }) => {

  const [uniersity, setUniversity] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [labels, setLabels] = useState([]);
  const [searchText, setSearchText] = useState('');

  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedCycle, setSelectedCycle] = useState(0);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  const [mostrarFiltro, setMostrarFiltro] = useState(true);

  useEffect(() => {
    const manejarResize = () => {
      const esMovil = window.innerWidth < 768;
      if (!esMovil) setMostrarFiltro(true);
    };

    manejarResize(); 
    window.addEventListener("resize", manejarResize);

    return () => window.removeEventListener("resize", manejarResize);
  }, []);


  useEffect(() => {
    filterTeachers();
  }, [searchText, selectedFaculty, selectedCycle, selectedLabel, selectedCourse]);

  useEffect(() => {
    const foundUniversity = universitiesData.find(u => u.college_id === id);
    setUniversity(foundUniversity);

    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const teachers_ids = teacher_colleges
      .filter(u => u.college_id === id)
      .map(t => teachersData.find(x => x.teacher_id === t.teacher_id))
      .map(x => ({
        ...x,
        calificaciones: reviews.filter(c => c.teacher_id === x.teacher_id).length
      }));


    setTeachers(teachers_ids)
    setFilteredTeachers(teachers_ids)
    setLabels(labelData.filter(x => x.label_id > 4))
    setCourses(coursesData)
    setFilteredCourses(coursesData)
    setFaculties(facultyData.filter(x => x.college_id === id))
    console.log(labels)

    //Asginar primer perfil de profesor
    changeTeacherId(teachers_ids[0].teacher_id)
  }, []);



  const updateSearchText = (e) => {
    setSearchText(e.target.value);
  }

  const updateFaculty = (e) => {
    setSelectedFaculty(e.target.value);
  }

  const updateCycle = (e) => {
    setSelectedCycle(e.target.value);
  }

  const updateLabel = (e) => {
    setSelectedLabel(e.target.value);
  }

  const updateCourse = (e) => {
    setSelectedCourse(e.target.value);
  }

  const filterTeachers = () => {
    let filtered = [...teachers];
    setFilteredCourses(coursesData)

    // Filtro por texto (nombre del profesor)
    if (searchText.trim() !== '') {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchText.trim().toLowerCase())
      );
    }

    // Filtro por facultad
    if (selectedFaculty) {
      const my_faculty_id = faculties.filter(f => f.name === selectedFaculty)[0].faculty_id;
      console.log(my_faculty_id)
      setFilteredCourses(coursesData.filter(x => x.faculty_id === my_faculty_id))

      const facultyIds = facultyData
        .filter(f => f.name === selectedFaculty && f.college_id === id)
        .map(f => f.faculty_id);

      const courseIds = coursesData
        .filter(c => facultyIds.includes(c.faculty_id))
        .map(c => c.course_id);

      const teacherIds = teacher_colleges
        .filter(tc => tc.college_id === id)
        .map(tc => tc.teacher_id);

      const relatedTeacherIds = teacher_courses
        .filter(tc => courseIds.includes(tc.course_id))
        .map(tc => tc.teacher_id);

      filtered = filtered.filter(t => relatedTeacherIds.includes(t.teacher_id));
    }

    // Filtro por ciclo
    if (selectedCycle > 0) {
      const courseIds = coursesData
        .filter(c => c.ciclo === parseInt(selectedCycle))
        .map(c => c.course_id);

      const relatedTeacherIds = teacher_courses
        .filter(tc => courseIds.includes(tc.course_id))
        .map(tc => tc.teacher_id);

      filtered = filtered.filter(t => relatedTeacherIds.includes(t.teacher_id));
    }

    // Filtro por curso
    if (selectedCourse) {
      const course = coursesData.find(c => c.name === selectedCourse);
      if (course) {
        const relatedTeacherIds = teacher_courses
          .filter(tc => tc.course_id === course.course_id)
          .map(tc => tc.teacher_id);

        filtered = filtered.filter(t => relatedTeacherIds.includes(t.teacher_id));
      }
    }

    // Filtro por habilidades (labels) — opcional si tienes los datos de reviews
    // Esto solo funcionará si más adelante agregas los archivos: `reviews.json` y `review_labels.json`

    if (selectedLabel) {
      const labelObj = labelData.find(l => l.name === selectedLabel);
      if (labelObj) {
        const reviewIds = review_labels
          .filter(rl => rl.label_id === labelObj.label_id)
          .map(rl => rl.review_id);

        const teacherIds = reviews
          .filter(r => reviewIds.includes(r.review_id))
          .map(r => r.teacher_id);

        filtered = filtered.filter(t => teacherIds.includes(t.teacher_id));
      }
    }

    setFilteredTeachers(filtered);
  };

  return <div className="container py-4 text-white">
    {!mostrarFiltro && (
      <div className="mb-3">
        <button
          className="btn btn-outline-light w-100"
          onClick={() => setMostrarFiltro(true)}
        >
          <i className="bi bi-arrow-left me-2"></i> Seguir buscando
        </button>
      </div>
    )}
  {mostrarFiltro && (
 <>
    <div className="mb-4">
      <h3 className="text-white">
        <BackButton to={'/filtrogeneral'}/>
        <img src={uniersity.image_url} alt="Logo" height="30" className="me-2" />
        {uniersity.name}
      </h3>
    </div>

    <div className="d-flex align-items-center px-3 py-2 rounded-pill mb-3" style={{ width: '100%', backgroundColor: '#43BF98' }}>
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
      <select className="form-select bg-dark text-white" style={{ width: '48%' }} value={selectedFaculty}
        onChange={updateFaculty}>
        <option key={0} value={''}>Facultad</option>
        {faculties.map((facultie, index) => (
          <option key={index} value={facultie.name}>{facultie.name}</option>
        ))}
      </select>
      <select className="form-select bg-dark text-white" style={{ width: '48%' }} value={selectedCycle} onChange={updateCycle}>
        <option key={0} value={0}>Ciclo</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(x => <option key={x} value={x}>{x}</option>)}
      </select>
      <select className="form-select bg-dark text-white" style={{ width: '48%' }} value={selectedLabel} onChange={updateLabel}>
        <option value={''}>Habilidades</option>
        {labels.map((label, index) => (
          <option key={index} value={label.name}>{label.name}</option>
        ))}
      </select>
      <select className="form-select bg-dark text-white" style={{ width: '48%' }} value={selectedCourse} onChange={updateCourse}>
        <option value={''}>Cursos</option>
        {filteredCourses.map((course, index) => (
          <option key={index} value={course.name}>{course.name}</option>
        ))}
      </select>
    </div>

    <div className="overflow-auto" style={{ maxHeight: '50vh' }}>
      {filteredTeachers.map((profesor, index) => (
        <button
          key={index}
          onClick={() => {
            changeTeacherId(profesor.teacher_id);
            if (window.innerWidth < 768) setMostrarFiltro(false);
          }}
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
            <div className="text-light">{profesor.calificaciones} calificaciones</div>
          </div>
        </button>
      ))}</div>
  </>
  )}
  </div>
}

export default FiltroComponente