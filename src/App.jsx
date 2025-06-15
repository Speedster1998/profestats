import { Route, Routes } from "react-router-dom";
import Header from "./Componentes/Header/Header";
import Landing from "./Pages/Landing/Landing";
import FondoDecorativo from "./Componentes/Fondo/Fondo";
import Evaluacion from "./Pages/Evaluacion/Evaluacion";
import Login from "./Pages/LogIn/Login";
import Signin from "./Pages/SignIn/Signin";
import Perfil from "./Pages/Perfil/Perfil";
import FiltroUniversidad from "./Pages/FiltroUniversidad/FiltroUniversidad";
import FiltroGeneral from "./Pages/FiltroGeneral/FiltroGeneral";
import PerfilProfesor from "./Pages/PerfilProfesor/PerfilProfesor";

import ErrorPage from "./Pages/Error/Error";

function App() {
    return <FondoDecorativo>
        <Header/>
        <Routes>
            <Route path="/" element={<Landing/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signin" element={<Signin/>}/>
            <Route path="/perfil" element={<Perfil/>}/>
             <Route path="/perfilProfesor" element={<PerfilProfesor/>}/>
            <Route path="/evaluacion/:teacherId" element={<Evaluacion/>}/>
            <Route path="/filtrouniversidad/:collegeId" element={<FiltroUniversidad/>}/>
            <Route path="/filtrogeneral" element={<FiltroGeneral/>}/>
            <Route path="/error" element={<ErrorPage/>}/>
            
        </Routes>
    </FondoDecorativo>
}

export default App