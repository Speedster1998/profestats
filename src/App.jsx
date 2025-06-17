import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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

function App() {
    const [logged, setLogged] = useState(true)

    /*useEffect(() => {
        setLogged(localStorage.getItem("logged") === "true")
    }, [])*/

    const unloggedRoutes = [
        { path: "/", element: <Landing/> },
        { path: "/login", element: <Login/> },
        { path: "/signin", element: <Signin/> }
    ];

    const loggedRoutes = [
        { path: "/perfil", element: <Perfil/> },
        { path: "/perfilProfesor/:teacherId", element: <PerfilProfesor/> },
        { path: "/evaluacion/:teacherId", element: <Evaluacion/> },
        { path: "/filtrouniversidad/:collegeId", element: <FiltroUniversidad/> },
        { path: "/filtrogeneral", element: <FiltroGeneral/> }
    ];
    
    const CheckRoute = ({ children, loggedIn, elseRoute }) => {
        return logged === loggedIn ? children : <Navigate to={elseRoute} />;
    };

    return <FondoDecorativo>
        {logged && <Header/>}
        {logged !== undefined &&
        <Routes>
            {unloggedRoutes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={<CheckRoute loggedIn={false} elseRoute="/perfil">{element}</CheckRoute>} />
            ))}
            {loggedRoutes.map(({ path, element }, index) => (
                <Route key={index} path={path} element={<CheckRoute loggedIn={true} elseRoute="/login">{element}</CheckRoute>} />
            ))}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        }
    </FondoDecorativo>
}

export default App