import teachers from '../data/Profesores.json';
import teacherColleges from '../data/teachers_colleges.json';
import teacherCourses from '../data/Cursos.json';

export const TeacherService = {
  // Obtiene un profesor por su ID
  getTeacherById: (id) => {
    return teachers.find(t => t.teacher_id === id);
  },

  // Obtiene los IDs de universidades (colleges) asociadas a un profesor
  getTeacherCollegeIds: (teacherId) => {
    return teacherColleges
      .filter(tc => tc.teacher_id === teacherId)
      .map(tc => tc.college_id);
  },

  // Obtiene todos los profesores que pertenecen a una universidad (college)
  getTeachersInCollege: (collegeId) => {
    const teacherIds = teacherColleges
      .filter(tc => tc.college_id === collegeId)
      .map(tc => tc.teacher_id);
    return teachers.filter(t => teacherIds.includes(t.teacher_id));
  },

  // Devuelve todos los profesores del archivo
  getAllTeachers: () => {
    return teachers;
  },

  // Obtiene los profesores que imparten un curso específico
  getTeachersByCourseId: (courseId) => {
    const teacherIds = teacherCourses
      .filter(tc => tc.course_id === courseId)
      .map(tc => tc.teacher_id);
    return teachers.filter(t => teacherIds.includes(t.teacher_id));
  }
};
