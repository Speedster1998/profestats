import colleges from '../data/Universidades.json';
import teacherColleges from '../data/teachers_colleges.json';

export const CollegeService = {
  // Obtiene una universidad por su ID
  getCollegeById: (id) => {
    return colleges.find(college => college.college_id === id);
  },

  // Obtiene todas las universidades asociadas a un profesor por su ID
  getCollegesByTeacherId: (teacherId) => {
    const collegeIds = teacherColleges
      .filter(tc => tc.teacher_id === teacherId)
      .map(tc => tc.college_id);

    return colleges.filter(c => collegeIds.includes(c.college_id));
  }
};
