import courses from '../data/Cursos.json';
import faculties from '../data/Facultad.json';
import teachersCourses from '../data/Relacion_Profesor_Curso.json'; 

export const CourseService = {
  // Obtener todos los cursos
  loadCoursesFromJson: () => {
    return courses; 
  },

  // Obtener todas las facultades
  loadFacultiesFromJson: () => {
    return faculties; 
  },

  // Obtener un curso por ID
  getCourseById: (id) => {
    const course = courses.find(c => c.course_id === id);
    return course || null;
  },

  // Obtener todos los cursos relacionados con una universidad (college)
  getCoursesByCollegeId: (collegeId) => {
    const facultyIds = faculties
      .filter(f => f.college_id === collegeId)
      .map(f => f.faculty_id);

    return courses.filter(c => facultyIds.includes(c.faculty_id));
  },

  // Obtener todos los cursos que imparte un profesor
  getCoursesByTeacherId: (teacherId) => {
    const courseIds = teachersCourses
      .filter(tc => tc.teacher_id === teacherId)
      .map(tc => tc.course_id);

    return courses.filter(c => courseIds.includes(c.course_id));
  }
};
