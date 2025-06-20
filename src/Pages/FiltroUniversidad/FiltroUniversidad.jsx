import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FiltroComponente from "./FiltroComponente";
import PerfilProfesor from "../PerfilProfesor/PerfilProfesor";

const FiltroUniversidad = () => {
    const { collegeId } = useParams();
    const location = useLocation();

    const [teacherId, setTeacherId] = useState(() => {
        const savedId = location.state?.teacher_id;
        return savedId ? savedId : 1;
    });

    useEffect(() => {
        if (location.state?.teacher_id) {
            setTeacherId(location.state.teacher_id);
        }
    }, [location.state?.teacher_id]);

    useEffect(() => {
        localStorage.setItem("collegeIdActual", collegeId);
    }, [collegeId]);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <FiltroComponente id={parseInt(collegeId)} changeTeacherId={setTeacherId} />
                </div>
                <div className="col-md">
                    <div className="overflow-auto">
                        <PerfilProfesor key={teacherId} idTeacher={teacherId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FiltroUniversidad;
