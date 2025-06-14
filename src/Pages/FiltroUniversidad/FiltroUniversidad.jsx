import { useParams } from "react-router-dom";
import { ControladorPerfilProfesor } from "../PerfilProfesor/ControladorPerfilProfesor"
import PerfilProfesor from "../PerfilProfesor/PerfilProfesor"
import FiltroComponente from "./FiltroComponente"

const FiltroUniversidad = () => {
    const { id } = useParams();
    const idNum = parseInt(id, 10);
    return <div className="container">
        <div className="row">
            <div className="col-md-3">
                <FiltroComponente id={idNum}/>
            </div>
            <div className="col-md">
                <div className="overflow-auto">
                <PerfilProfesor/>
                </div>
            </div>
        </div>
    </div>
}

export default FiltroUniversidad