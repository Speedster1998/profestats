import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import usuariosJSON from './data/Usuarios.json';
import profesoresJSON from './data/Profesores.json';
import cursosJSON from './data/Cursos.json';
import resenasJSON from './data/Resena.json';
import labelsJSON from './data/PreguntasContenido.json';
import reviewLabelsJSON from './data/review_labels.json';

function App() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const usuariosGuardados = JSON.parse(localStorage.getItem("Usuarios"));

        if (!usuariosGuardados || usuariosGuardados.length === 0) {
            localStorage.setItem("Usuarios", JSON.stringify(usuariosJSON));
        }

        if (!localStorage.getItem("Profesores")) {
            localStorage.setItem("Profesores", JSON.stringify(profesoresJSON));
        }

        if (!localStorage.getItem("Cursos")) {
            localStorage.setItem("Cursos", JSON.stringify(cursosJSON));
        }

        if (!localStorage.getItem("reviews")) {
            const reseñasConLikes = resenasJSON.map(r => ({
                ...r,
                likes: r.likes ?? 0,
                dislikes: r.dislikes ?? 0
            }));
            localStorage.setItem("reviews", JSON.stringify(reseñasConLikes));
        }

        if (!localStorage.getItem("reviewLabels")) {
            localStorage.setItem("reviewLabels", JSON.stringify(reviewLabelsJSON));
        }

        if (!localStorage.getItem("labels")) {
            localStorage.setItem("labels", JSON.stringify(labelsJSON));
        }
    }, []);


    const [logged, setLogged] = useState(null)

    useEffect(() => {
        const usuario = localStorage.getItem("usuario");
        const estaLogeado = localStorage.getItem("logged") === "true";

        setLogged(usuario !== null && estaLogeado);
    }, [])

    const logUser = () => {
        localStorage.setItem("logged", "true");
        const usuario = localStorage.getItem("usuario");
        const estaLogeado = localStorage.getItem("logged") === "true";

        setLogged(usuario !== null && estaLogeado);

        navigate("/perfil");
    }

    const logOut = () => {
        localStorage.setItem("logged", "false");
        const usuario = localStorage.getItem("usuario");
        const estaLogeado = localStorage.getItem("logged") === "true";

        setLogged(usuario !== null && estaLogeado);

        navigate("/login");
    }

    const unloggedRoutes = [
        { path: "/", element: <Landing /> },
        { path: "/login", element: <Login logFunc={logUser} /> },
        { path: "/signin", element: <Signin /> }
    ];

    const loggedRoutes = [
        { path: "/perfil", element: <Perfil /> },
        { path: "/perfilProfesor/:teacherId", element: <PerfilProfesor /> },
        { path: "/evaluacion/:teacherId", element: <Evaluacion /> },
        { path: "/filtrouniversidad/:collegeId", element: <FiltroUniversidad /> },
        { path: "/filtrogeneral", element: <FiltroGeneral /> }
    ];

    const CheckRoute = ({ children, loggedIn, elseRoute }) => {
        return logged === loggedIn ? children : <Navigate to={elseRoute} />;
    };

    return <FondoDecorativo>
        {logged && <Header logOut={logOut} />}
        {logged !== null &&
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
