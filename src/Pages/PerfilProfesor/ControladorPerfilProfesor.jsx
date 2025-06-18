import { useEffect, useState } from 'react';
import { TeacherService } from '../../Services/teacher_service';
import { CollegeService } from '../../Services/college_service';
import ReviewService from '../../Services/review_service';
import { CourseService } from '../../Services/course_service';

export const useControladorPerfilProfesor = (teacherId) => {
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const teacher = await TeacherService.getTeacherById(teacherId);
      const colleges = await CollegeService.getCollegesByTeacherId(teacherId);
      const courses = await CourseService.getCoursesByTeacherId(teacherId);
      const { reviews, promedios, usedLabelStats } = await ReviewService.getReviewsForTeacher(teacherId);


      const caracteristicasLabels = usedLabelStats.filter(label => {
        const fullLabel = ReviewService.labels.find(l => l.name === label.name);
        return fullLabel?.group_id === 21;
      });

      const profile = {
        name: teacher.name,
        image: teacher.image_url,
        facilidad: promedios.facilidad,
        calidad: promedios.calidad,
        description: teacher.description,
        colleges: colleges.map(c => ({ id: c.college_id, name: c.name })),
        courses: courses.map(c => c.name),
        labels: caracteristicasLabels,
        reviews,
      };

      setTeacherProfile(profile);
    } catch (error) {
      console.error('Error cargando perfil del profesor:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [teacherId]);

  const handleLike = (reviewId) => {
    ReviewService.addLike(reviewId);
    loadProfile(); // Refresca los datos
  };

  const handleDislike = (reviewId) => {
    ReviewService.addDislike(reviewId);
    loadProfile(); // Refresca los datos
  };

  return {
    teacherProfile,
    loading,
    handleLike,
    handleDislike,
  };
};
