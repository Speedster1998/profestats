import { useState } from "react";
import styles from "./login.module.css";
import SigLogLayout from "./SigLogLayout.jsx"
import { UserService } from "../../Services/user_services.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("email:", email);
        console.log("contraseña:", password);
        
         const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

        if (
            usuarioGuardado &&
            usuarioGuardado.email === email &&
            usuarioGuardado.password === password
        ) {
            console.log("Inicio de sesión exitoso");
            localStorage.setItem("logged", "true");
            navigate("/perfil");
        } else {
            console.log("Credenciales incorrectas");
            setWarning("Correo o contraseña incorrectos");
        }

    };

    return (
        <>
            <SigLogLayout
                title="Ingresa tu cuenta"
                subtitle=""
                buttonText="Iniciar sesión"
                footer="¿No tienes cuenta?"
                href="/signin"
                footer2="Regístrate ahora"
                onSubmit={handleLogin}
                emailText={email}
                setEmail={setEmail}
                passwordText={password}
                setPassword={setPassword}
                warningText={warning}
            />
        </>
    );
};
export default Login