import { useParams } from "react-router-dom";
import { ControladorPerfilProfesor } from "../PerfilProfesor/ControladorPerfilProfesor"
import PerfilProfesor from "../PerfilProfesor/PerfilProfesor"
import FiltroComponente from "./FiltroComponente"
import { useState } from "react";

const FiltroUniversidad = () => {
    const { collegeId } = useParams();
    const collegeIdNum = parseInt(collegeId, 10);
    const [teacher_id, setTeacherId] = useState(1)
    return <div className="container">
        <div className="row">
            <div className="col-md-3">
                <FiltroComponente id={collegeIdNum}/>
            </div>
            <div className="col-md">
                <div className="overflow-auto">
                <PerfilProfesor idTeacher={teacher_id}/>
                </div>
            </div>
        </div>
    </div>
}

export default FiltroUniversidad