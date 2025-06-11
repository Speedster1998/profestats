import { useEffect, useState } from 'react';
import { TeacherService } from '../../Services/teacher_service';
import { CollegeService } from '../../Services/college_service';
import { ReviewService } from '../../Services/review_service';
import { CourseService } from '../../Services/course_service';

const teacherId = 1
export const useTeacherProfile = () => {
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const teacher = await TeacherService.getTeacherById(teacherId);
        const colleges = await CollegeService.getCollegesByTeacherId(teacherId);
        const courses = await CourseService.getCoursesByTeacherId(teacherId);
        const { reviews, usedLabelNames } = await ReviewService.getReviewsForTeacher(teacherId);

        const profile = {
          name: teacher.name,
          image: teacher.image_url,
          facilidad: teacher.facilidad,
          calidad: teacher.calidad,
          description: teacher.description,
          colleges: colleges.map(c => ({ id: c.college_id, name: c.name })),
          courses: courses.map(c => c.name),
          labels: usedLabelNames,
          reviews,
        };

        setTeacherProfile(profile);
      } catch (error) {
        console.error('Error cargando perfil del profesor:', error);
      }
      setLoading(false);
    };

    loadProfile();
  }, [teacherId]);

  return { teacherProfile, loading };
};
